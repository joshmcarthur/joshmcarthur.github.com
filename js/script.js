/* Author: Josh McArthur

*/

$(document).ready(function() 
{
    load_tweets();
});

var load_tweets = function() {
    var uri = "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=sudojosh&count=10&callback=?";
    var container = $("dd#twitter-feed ul.feed.twitter");
    $.jsonp({
        'url': uri,
        'success': function(data, status) {
            container.empty();
            $.each(data, function(index, tweet) {
                console.log(tweet);
                container.prepend("<li>" + tweet.text + "</li>");
            });
         },
         'error': function(options, status) { add_twitter_widget(); }
    });
};

var add_twitter_widget = function() {
    alert('400');
}




















