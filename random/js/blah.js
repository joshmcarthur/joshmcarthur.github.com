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
          self.board = $(this).data('board');
          $('#boards').slideUp();
          return self.loadCards(self.board.id);
        });
        $('#cards a').live('click', function() {
          self.card = $(this).data('card');
          console.log(card);
          $('#cards').slideUp();
          return self.loadChecklists(self.card.id);
        });
        $('#checklists a').live('click', function() {
          self.checklist = $(this).data('checklist');
          return self.showChecklist(self.checklist);
        });
        $('#checklist button#create_card').live('click', function(event) {
          event.preventDefault();
          return self.makeCard();
        });
        return $('#checklist button#cancel').live('click', function(event) {
          event.preventDefault();
          return self.loadBoards();
        });
      });
    }

    TrelloThing.prototype.loadChecklists = function(card_id) {
      return Trello.get("cards/" + card_id + "/checklists", function(checklists) {
        var list;
        list = $('#checklists');
        return $.each(checklists, function(index, checklist) {
          return list.append($('<li></li>').append($('<a></a>').data('checklist', checklist).attr('href', 'javascript:void(0)').text(checklist.name)));
        });
      });
    };

    TrelloThing.prototype.showChecklist = function(checklist) {
      var base, list;
      console.log(checklist);
      base = $('#checklist');
      base.append($('<h3></h3>').text("" + checklist.name + " on card '" + this.card.name + "' on board '" + this.board.name + "'"));
      list = $('<ol></ol');
      $.each(checklist.checkitems, function(index, checkitem) {
        return list.append($('<li></li>').text(checkitem.name));
      });
      return base.append(list);
    };

    TrelloThing.prototype.makeCard = function() {
      var card_name, description, list_id;
      card_name = this.checklist.name;
      list_id = this.card.idList;
      return description = "";
    };

    TrelloThing.prototype.loadCards = function(board_id) {
      var _this = this;
      return Trello.get("boards/" + board_id + "/cards", function(cards) {
        var list;
        list = $('#cards');
        return $.each(cards, function(index, card) {
          return list.append($('<li></li>').append($('<a></a>').data('card', card).attr('href', 'javascript:void(0)').text(card.name)));
        });
      });
    };

    TrelloThing.prototype.loadBoards = function() {
      var _this = this;
      $('#login').hide();
      $('#boards').show();
      $('#cards').show();
      $('#checklists').show();
      return Trello.get("members/me/boards", function(boards) {
        var list;
        list = $('#boards');
        return $.each(boards, function(index, board) {
          return list.append($('<li></li>').append($('<a></a>').data('board', board).attr('href', 'javascript:void(0)').text(board.name)));
        });
      });
    };

    return TrelloThing;

  })();

  window.TrelloThing = TrelloThing;

}).call(this);
