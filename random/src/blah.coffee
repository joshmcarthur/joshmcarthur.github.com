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

  loadCards: (board_id) ->
    console.log(board_id)

  loadBoards: ->
    Trello.get "members/me/boards", (boards) =>
      list = $('#boards')
      $.each boards, (index, board) =>
        list.append $('<li></li>').append($('<a></a>').attr('data-board-id', board.id).attr('href', 'javascript:void(0)').text(board.name))


window.TrelloThing = TrelloThing


