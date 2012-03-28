(function() {
  var TrelloThing;

  TrelloThing = (function() {

    function TrelloThing() {
      var _this = this;
      $(document).ready(function() {
        return $('#login a').click(function() {
          return Trello.authorize({
            type: 'popup',
            success: _this.loadBoards
          });
        });
      });
    }

    TrelloThing.prototype.loadBoards = function() {
      var _this = this;
      return Trello.get("members/me/boards", function(boards) {
        var list;
        list = $('#boards');
        return $.each(boards, function(index, board) {
          return list.append($('<li></li>').append($('<a></a>').attr('data-board-id', board.id).text(board.name)));
        });
      });
    };

    return TrelloThing;

  })();

  window.TrelloThing = TrelloThing;

}).call(this);
