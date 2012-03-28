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
        self.board = $(this).data('board')
        $('#boards').slideUp()
        self.loadCards(self.board.id)

      $('#cards a').live 'click', ->
        self.card = $(this).data('card')
        console.log(self.card)
        $('#cards').slideUp()
        self.loadChecklists(self.card.id)

      $('#checklists a').live 'click', ->
        self.checklist = $(this).data('checklist')
        self.showChecklist(self.checklist)

      $('#checklist button#create_card').live 'click', (event) ->
        event.preventDefault()
        self.makeCard()

      $('#checklist button#cancel').live 'click', (event) ->
        event.preventDefault()
        self.loadBoards()

  loadChecklists: (card_id) ->
    Trello.get "cards/#{card_id}/checklists", (checklists) ->
      list = $('#checklists')
      $.each checklists, (index, checklist) ->
        list.append $('<li></li>').append( $('<a></a>').data('checklist', checklist).attr('href', 'javascript:void(0)').text(checklist.name))

  showChecklist: (checklist) ->
    console.log(checklist)
    base = $('#checklist')
    base.append($('<h3></h3>').text("#{checklist.name} on card '#{this.card.name}' on board '#{this.board.name}'"))
    list = $('<ol></ol')
    $.each checklist.checkitems, (index, checkitem) ->
      list.append($('<li></li>').text(checkitem.name))

    base.append(list)


  makeCard: ->
    card_name = this.checklist.name
    list_id = this.card.idList
    description = ""

  loadCards: (board_id) ->
    Trello.get "boards/#{board_id}/cards", (cards) =>
      list = $('#cards')
      $.each cards, (index, card) =>
        list.append $('<li></li>').append( $('<a></a>').data('card', card).attr('href', 'javascript:void(0)').text(card.name))

  loadBoards: ->
    $('#login').hide()
    $('#boards').show()
    $('#cards').show()
    $('#checklists').show()
    Trello.get "members/me/boards", (boards) =>
      list = $('#boards')
      $.each boards, (index, board) =>
        list.append $('<li></li>').append($('<a></a>').data('board', board).attr('href', 'javascript:void(0)').text(board.name))


window.TrelloThing = TrelloThing


