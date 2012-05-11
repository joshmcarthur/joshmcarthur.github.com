/* Author: @sudojosh

*/

$(function() {
  startSpin($("#donations")[0])
  $.getJSON(
    'https://api.twitter.com/1/statuses/user_timeline.json?callback=?&count=200&include_entities=true&screen_name=sudojosh&include_rts=false&contributor_details=false',
    function(donation_tweets) {
      stopSpin();
      donation_tweets = processDonations(donation_tweets);
      $('#donations').html(
        Mustache.render($('#template-donations').html(), {donations: donation_tweets})
      )
    }
  );
});

var processDonations = function(tweets) {
  var processed_tweets = []
  var monthNames = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]

  $.each(tweets, function(index, tweet) {
    if (tweet.entities.hashtags.contains_hashtag("donation")) {
      var created_at = new Date(tweet.created_at)
      tweet.formattedDate = created_at.getDate() + " " + monthNames[created_at.getMonth()] + " " + created_at.getFullYear();
      tweet.amount = tweet.text.match(/\$(\d+)/)[1];
      processed_tweets.push(tweet)
    }
  });

  return processed_tweets;
}

var startSpin = function(element) {
  var opts = {
    lines: 13,
    length: 7,
    width: 4,
    radius: 10,
    rotate: 0,
    color: '#000',
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    className: 'spinner',
    zIndex: 2e9,
    top: 'auto',
    left: 'auto'
  };
  // We do actually want this to be a global variable
  spinner = new Spinner(opts).spin(element);
}

var stopSpin = function() {
  spinner.stop();
}

// From: http://css-tricks.com/snippets/javascript/javascript-array-contains/
// It's safest to use this method for all browsers, because
// Array.indexOf is not supported in IE < 9
Array.prototype.contains_hashtag = function ( needle ) {
   for (i in this) {
       if (this[i].text == needle) return true;
   }
   return false;
}





