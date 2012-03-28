class TrelloThing
  constructor: ->
    $(document).ready =>
      $('#login a').click =>
        Trello.authorize(
          type: 'popup'
          success: this.loadBoards
        )

  loadBoards: ->
    Trello.get "members/me/boards", (boards) =>
      list = $('#boards')
      $.each boards, (index, board) =>
        list.append $('<li></li>').append($('<a></a>').attr('data-board-id', board.id).text(board.name))


window.TrelloThing = TrelloThing

