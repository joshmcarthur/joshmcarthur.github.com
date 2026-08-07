---
title: How I publish Standard.site records from a Rails Bluesky delivery channel
category: TIL
featured_image: /img/posts/how-i-publish-standard-site-records/bluesky.png
---

[Aotearoa, Again](https://github.com/joshmcarthur/aotearoa-again) is a Rails
app that publishes a daily colourised photo edition and fans it out to email,
Instagram, Facebook, YouTube Shorts, and now Bluesky. I wanted those Bluesky
posts to pick up the enhanced link cards Bluesky renders for
[Standard.site](https://standard.site/) documents, instead of a plain
<abbr title="HTML meta tags (og:title, og:image, and so on) used for link previews">Open Graph</abbr>
preview.

Standard.site is a set of
<abbr title="Authenticated Transfer Protocol: the open social networking protocol Bluesky is built on">AT Protocol</abbr>
<abbr title="Schemas that define record types and APIs on AT Protocol (e.g. what a post or publication looks like)">lexicons</abbr>
for publications and documents. Bluesky reads those records (and checks them
against your domain) to show publication branding on the card. What I needed in
the delivery pipeline:

1. One shared `site.standard.publication` record for the site
2. A `site.standard.document` record per edition
3. Proof both ways: the domain exposes the publication
   <abbr title="An at:// address pointing at a specific record in someone's AT Protocol repository">AT-URI</abbr>,
   and each edition page points at its document record
4. When posting, attach both refs on the external embed via
   <abbr title="References on a Bluesky external embed that point at related AT Protocol records (here, the document and publication)"><code>associatedRefs</code></abbr>

## One-off publication bootstrap

Creating the publication is a one-shot. A rake task calls a small service that
uploads the site icon as a
<abbr title="A binary file uploaded to a Personal Data Server and referenced by hash, rather than stored inline in the record">blob</abbr>
and creates the record:

```ruby
# app/services/standard_site/publication_bootstrap.rb (trimmed)
record = {
  "$type" => "site.standard.publication",
  "url" => site_url,
  "name" => SITE_NAME,
  "description" => SITE_DESCRIPTION,
  "icon" => icon_blob,
  "basicTheme" => basic_theme,
  "preferences" => { "showInDiscover" => true }
}

@client.create_record(collection: "site.standard.publication", record: record)
```

```bash
bin/rails bluesky:bootstrap_publication
```

That prints a `publication_uri` and
<abbr title="Content Identifier: a hash of the record contents, used with the AT-URI to pin a specific version"><code>publication_cid</code></abbr>
to paste into credentials alongside the Bluesky handle and
<abbr title="A Bluesky password scoped for API clients; create one under Settings → Privacy and security → App passwords">app password</abbr>.
Re-run only when the
<abbr title="Decentralized Identifier: the stable account identity on AT Protocol (e.g. did:plc:…)">DID</abbr>
or domain changes.

Domain verification is a plain-text
<abbr title="A conventional path under /.well-known/ where a site publishes machine-readable metadata about itself">well-known</abbr>
endpoint that returns the publication AT-URI:

```ruby
# GET /.well-known/site.standard.publication
def site_standard_publication
  uri = AppConfig.bluesky_publication_uri
  return head :not_found if uri.blank?

  render plain: uri
end
```

> Domain verification can also be used to verify ownershipn of a handle (e.g. I own @aotearoa-again.joshmcarthur.com),
> but since a Bluesky account is a prerequisite for this integration, I chose to verify ownership using DNS rather than
> overloading the handle verification endpoint.

## Per-edition delivery

Bluesky sits in the same `deliveries` table as the other channels. On publish
day, `DeliverBlueskyJob`:

1. Creates (or reuses) a `site.standard.document` and stores its uri/cid on the
   delivery's `metadata`
2. Uploads the share image as a blob
3. Creates an `app.bsky.feed.post` with an
   <abbr title="A Bluesky post attachment that links out to a URL with title, description, and thumbnail (as opposed to an inline image)">external embed</abbr>
   whose `associatedRefs` point at the document and publication records

The embed side looks like:

```ruby
"embed" => {
  "$type" => "app.bsky.embed.external",
  "external" => {
    "uri" => uri,
    "title" => title,
    "description" => description,
    "thumb" => thumb_blob,
    "associatedRefs" => [
      { "uri" => document_ref.fetch(:uri), "cid" => document_ref.fetch(:cid) },
      { "uri" => publication_ref.fetch(:uri), "cid" => publication_ref.fetch(:cid) }
    ]
  }
}
```

Edition pages close the loop with link tags once the document metadata exists:

```erb
<% if (document_uri = @edition.bluesky_delivery&.metadata_get("standard_site_document_uri")).present? %>
  <link rel="site.standard.document" href="<%= document_uri %>">
<% end %>
<% if AppConfig.bluesky_publication_uri.present? %>
  <link rel="site.standard.publication" href="<%= AppConfig.bluesky_publication_uri %>">
<% end %>
```

To check the card, paste a published edition URL into the composer on
[main.bsky.dev](https://main.bsky.dev) and confirm you get publication branding
rather than a bare domain preview. For the records themselves,
[pdsls.dev](https://pdsls.dev) is a useful debugger: paste a AT-URI and you get
the raw JSON. Here's
[Aotearoa, Again's publication record](https://pdsls.dev/at://did:plc:e2qzjjow4ivem3xkovconljr/site.standard.publication/3msfruptg4e2i),
for example.
