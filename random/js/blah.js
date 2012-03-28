(function() {
  var TrelloThing;

  TrelloThing = (function() {

    function TrelloThing() {
      var _this = this;
      $(document).ready(function() {
        var self;
        $('#login a').click(function() {
          return Trello.authorize({
            type: 'popup',
            success: _this.loadBoards
          });
        });
        self = _this;
        $('#boards a').live('click', function() {
          self.board_id = $(this).attr('data-board-id');
          return self.loadCards(self.board_id);
        });
        return $('#cards a').live('click', function() {
          self.card_id = $(this).attr('data-card-id');
          return self.loadChecklists(self.card_id);
        });
      });
    }

    TrelloThing.prototype.loadChecklists = function(card_id) {
      return console.log(card_id);
    };

    TrelloThing.prototype.loadCards = function(board_id) {
      var _this = this;
      return Trello.get("boards/" + board_id + "/cards", function(cards) {
        var list;
        list = $('#cards');
        return $.each(cards, function(index, card) {
          return list.append($('<li></li>').append($('<a></a>').attr('data-card-id', card.id).attr('href', 'javascript:void(0)').text(card.name)));
        });
      });
    };

    TrelloThing.prototype.loadBoards = function() {
      var _this = this;
      return Trello.get("members/me/boards", function(boards) {
        var list;
        list = $('#boards');
        return $.each(boards, function(index, board) {
          return list.append($('<li></li>').append($('<a></a>').attr('data-board-id', board.id).attr('href', 'javascript:void(0)').text(board.name)));
        });
      });
    };

    return TrelloThing;

  })();

  window.TrelloThing = TrelloThing;

}).call(this);
