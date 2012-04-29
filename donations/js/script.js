/* Author: @sudojosh

*/

$(function() {
  startSpin($("#donations")[0])
  $.getJSON(
    'http://search.twitter.com/search.json?q=from:sudojosh%20donation&callback=?',
    function(donation_tweets) {
      stopSpin();
      donation_tweets = processDonations(donation_tweets.results);
      $('#donations').html(
        Mustache.render($('#template-donations').html(), {donations: donation_tweets})
      )
    }
  );
});

var processDonations = function(tweets) {
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
    var created_at = new Date(tweet.created_at)
    tweet.formattedDate = created_at.getDate() + " " + monthNames[created_at.getMonth()] + " " + created_at.getFullYear();
    tweet.amount = tweet.text.match(/\$(\d+)/)[1];
  });

  return tweets;
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







