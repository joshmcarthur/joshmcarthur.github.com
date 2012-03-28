class TrelloThing
  constructor: ->
    $(document).ready =>
      $('#login a').click =>
        Trello.authorize(
          type: 'popup'
          success: this.loadBoards
        )

      self = this
      $('#boards a').live 'click', ->
        self.board_id = $(this).attr('data-board-id')
        self.loadCards(self.board_id)

      $('#cards a').live 'click', ->
        self.card_id = $(this).attr('data-card-id')
        self.loadChecklists(self.card_id)

  loadChecklists: (card_id) ->
    Trello.get "cards/#{card_id}/checklists", (checklists) ->
      list = $('#checklists')
      $.each checklists, (index, checklist) ->
        list.append $('<li></li>').append( $('<a></a>').data('checklist', checklist).attr('href', 'javascript:void(0)').text(checklist.name))

  loadCards: (board_id) ->
    Trello.get "boards/#{board_id}/cards", (cards) =>
      list = $('#cards')
      $.each cards, (index, card) =>
        list.append $('<li></li>').append( $('<a></a>').attr('data-card-id', card.id).attr('href', 'javascript:void(0)').text(card.name))

  loadBoards: ->
    Trello.get "members/me/boards", (boards) =>
      list = $('#boards')
      $.each boards, (index, board) =>
        list.append $('<li></li>').append($('<a></a>').attr('data-board-id', board.id).attr('href', 'javascript:void(0)').text(board.name))


window.TrelloThing = TrelloThing


