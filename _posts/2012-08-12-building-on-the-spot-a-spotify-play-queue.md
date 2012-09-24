---
layout: post
title: "Building On-The-Spot: A Spotify play queue"
description: ""
category: 
tags: []
projects:
  - name: Hallon
    description: Hallon is a Ruby interface to the Spotify C library supporting searching, playback, and basically anything Spotify itself can do.
    url: https://github.com/Burgestrand/Hallon
  - name: Meta Spotify
    description: A Rubygem for searching tracks using Spotify's web services.
    url: https://github.com/philnash/meta-spotify
  - name: Redis
    description: Redis is a key-value store also supporting complex data types such as lists and sets. Super cool.
    url: https://github.com/antirez/redis
  - name: Daemons Rails
    description: A handy gem for generating the boilerplate required to run daemon processes with Rails.
    url: https://github.com/mirasrael/daemons-rails
---

## About the Application

The idea behind On the Spot was to allow everyone in the office at work to control the playlist, so that there was some semblence of fairness about what we listen to. Probably the simplest way of showing you what it is is to see some pictures, right?

<div class="image-box stack-2">
	<figure>
	    <img src="/img/posts/building-on-the-spot/searching.jpg" alt="Part 1: You can search for music" />
	    <figcaption>
	    	Part 1: You can search for music
	    	<a href="/img/posts/building-on-the-spot/searching.jpg" class="img-larger">
	    	<i class="icon-external-link"></i>
	    	Open Full-Size
	    	</a>
	    </figcaption>
	</figure>
	
	<figure>
	    <img src="/img/posts/building-on-the-spot/queue.jpg" alt="Part 2: You can see what's playing, and what's about to play" />
	    <figcaption>
	    	Part 2: You can see what's playing, and what's about to play
	    	<a href="/img/posts/building-on-the-spot/queue.jpg" class="img-larger">
	    	<i class="icon-external-link"></i>
	    	Open Full-Size
	    	</a>
	    </figcaption>
	</figure>

	<br class="clearfix" />
</div>

So, we basically have a two-page app - one page for finding music, another for playing it. This whole thing runs on a server in the office, and is DNS-d to http://spotify.office.3months.com, making it accessible to all staff.


![Spotify's headquarters at Humlegårdsgatan](/img/posts/spotify.jpeg)

## Technology Choices

The technology choices for this app ended up being pretty clear cut, although as with all projects I do in Rails, I do sense that I could have found a lighter approach. 

In the end, the core technologies are:

1. Rails 3.2
2. No database
3. Redis
4. [Hallon](https://github.com/Burgestrand/Hallon)
5. [Daemons Rails](https://github.com/mirasrael/daemons-rails)
6. Bootstrap for UI (customized)
7. Font Awesome for Icons

When I started the project, I considered a couple of projects that I thought might make the 'real-time' part of the application, mostly (Sinatra and [Cramp](http://cramp.in/)). I figured though, that as I wanted to add extra features, the drawbacks of these frameworks were going to get in the way - I opted to use Rails, accept the performance hit, in favor of not having to risk the framework getting in the way too much.

## Searching

Searching was the first feature I worked on - here's a reminder of what a search looks like:

<div class="image-box stack-1">
	<figure>
	    <img src="/img/posts/building-on-the-spot/searching_again.jpg" alt="A reminder about searching" />
	    <figcaption>
	    	A reminder about searching
	    	<a href="/img/posts/building-on-the-spot/searching_again.jpg" class="img-larger">
	    	<i class="icon-external-link"></i>
	    	Open Full-Size
	    	</a>
	    </figcaption>
	</figure>
</div>

I actually tried two different ways of searching Spotify - the first was [Meta Spotify](https://github.com/philnash/meta-spotify), and the second was [Hallon](https://github.com/Burgestrand/Hallon). I ended up sticking with Hallon, as I was using this library to also play the files, however I did that Meta Spotify's results seemed more accurate.

The way I implemented the search was actually very simple - I have a `SearchController`, with a `new` action which looks a bit like this:

{% highlight ruby %}
  def new
    @results = Rails.cache.fetch "search-for-#{params[:q]}" do
      Hallon::Search.new(params[:q], :tracks => 25, :tracks_offset => 10).load.tracks.to_a.map do |track|
        {
          :name => track.name, 
          :artist => track.artists.first.name, 
          :album => track.album.name, 
          :popularity => track.popularity, 
          :uri => track.to_link.to_str
        }
      end
    end

    respond_to do |format|
      format.json { render :json => @results }
    end
  end
{% endhighlight %}

In human terms, I perform the search, restricting the number of results to 25 for performance, and then pull a subset of the information available to me out, and return the data as JSON.

The other side of this is the Javascript - once again, quite a simple and common implementation of a typeahead search. The code for this is a bit more convoluted, so I'm going to post a shortened and annotated version of the main bit of it:

{% highlight coffeescript %}
# This function takes results that are returned from an AJAX getJSON() call to the search action
handleSearchResults = (results) ->
	tracks = []

	# We only want to add unique tracks to our array
	for track in results
		tracks.push track unless _.include(tracks, track)

	# Now that we have the raw data, we iterate through the
	# collection and build an HTML list item for
	# each track
	tracks = _.map tracks, (track) ->
		$("<li></li>")
		.append($('<span></span>').addClass('track').text(track.name))
		.append($('<span></span>').addClass('artist').text(" - #{track.artist}")) 
		.append($('<span></span>').addClass('album').text(" (#{track.album})"))
		.data('popularity', track.popularity)
		.data('uri', track.uri)
		.prepend($('<i></i>').addClass('icon-music'))
		.append($("<button></button>")
			.addClass('btn btn-success play-btn')
			.attr('title', "Play: #{track.name}")
			.append($('<i />').addClass('icon-plus')))


	# We want to sort the collection by the 'popularity'
	# that Spotify records. This helps pull
	# popular songs to the top, and push Karaoke/Knock off
	# versions to the bottom
	collection = _.sortBy tracks, (item) ->
		return 1000 unless item.data('popularity')
		console.log "Track: #{item.find('.track').text()}, popularity: #{(100 - item.data('popularity'))}"
		return 100 - item.data('popularity')

    # Don't add anything if we have nothing in our collection
	return if collection.length == 0
	
	# Empty the last set of search results and add 
	# the new ones.
	$('#tracks').empty()
	_.each collection, (item) -> 
		$('#tracks').append(item)


{% endhighlight %}

So, the combination of these two code blocks is enough to give us a typeahead search of tracks on Spotify. The search itself is trivialized by the Hallon library, and so the only real concern for us here is performance - each search takes about 500ms, and each key stroke performs a search.

## Queueing Tracks

Once we have our search results, clicking on the '+' icon next to the track queues it. The queue is a simple [Redis](http://redis.io) `list`, which I push onto from the 'left' side, and pop items off from the 'right' side. This makes the controller action to queue a track as simple as this:

{% highlight ruby %}
  def create
    position = $redis.lpush "tracks", params[:uri]
    flash.now[:notice] = I18n.t('queue.create.success', :position => position.ordinalize)
    render :status => :created
  end
{% endhighlight %}

Queueing is one thing, but we still need a way to interact with this queue, and play tracks through Spotify. This is where the `daemons-rails` gem comes in!

## Playing Tracks

'On the Spot' has two components. The first, we've discussed - it's the Rails application, that we use for searching and queueing tracks. The second is a [daemon](http://en.wikipedia.org/wiki/Daemon_(computing)), which runs in a loop, grabbing the next track to play, and playing it using Hallon - here's the main bit of this code:

{% highlight ruby %}
  # Keep running while there are tracks to play
  while uri = $redis.rpop("tracks")
  
    # Only continue if the URI looks like a spotify one
    if uri =~ /\Aspotify\:/


      # Set the currently-playing track
      $redis.set "currently_playing", uri

      # Load the track
      track = Hallon::Track.new(uri).load

      begin
        # Pre-load the track
        $player.load(track)
        
        # Play the track (blocks until complete)
        $player.play!(track)
      ensure
        $redis.del "currently_playing"
      end
    end
  end
{% endhighlight %}

In a similar way to searching, much of the work is done for us. Really, all this code is doing is pulling a Spotify URI (pretty much an ID) from our Redis list (called "tracks"), storing it as the value of a Redis key (called "currently_playing"), so that we can display which track is playing, and then actually plays the track (using Hallon). Once the track has finished playing, we un-set that currently playing value.

## Future Features

Really, all I've done so far, then, is built a web-interface around the functionality afforded by the `Hallon` gem (which is itself a wrapper around Spotify's API library, `libspotify`). Despite this though, it does work exactly do design. The next thing that needs doing is the ability to control the player - right now, there is no way to pause or stop the player, except by actually logging into the Redis console and clearing the list by hand. I'd also like to add some more realtime capability using Faye or Pusher, and provide browser notifications of playing tracks.

## Conclusion

This has ended up a bit more long-winded than I meant it to be, but has hopefully touched on the process I've gone through to build this app - in total, I've spent around 12-15 hours getting this to its current state, including writing this blog post, and altogether, it's working pretty well. In the future, I hope to write further about adding realtime notifications and features to this application, so stay tuned!




