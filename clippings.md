---
layout: default
permalink: /clippings
---

<main class="post post-content">
<h1>Clippings &amp; Highlights</h1>
<p>
  This page contains extracted clippings from my Kindle, extracted with a small
  Ruby script containing a large regular expression.
</p>
<p>
  I usually highlight something that sounds interesting that I'd like to come back
  to later. Some of these highlights are unintentional - I often highlight text when I fall asleep with my finger resting on the page. Just ignore these ones.
</p>

<hr>

{% for clipping in site.data.clippings %}
  <blockquote class="clipping" cite="— {{clipping.title}} ({{clipping.authors}}), p. {{clipping.page}}">
    “ {{clipping.clipping | strip_html }} ”
  </blockquote>
{% endfor %}
</main>
