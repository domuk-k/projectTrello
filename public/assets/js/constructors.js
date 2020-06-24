class Board {
  constructor(id, name) {
    this.id = id
    this.board_name = name
    this.descpition = "이것은 샘플 보드"
    this.background_image = ""
    this.is_starred = false
    this.recent_open = new Date().toISOString()
    this.background_color = "rgb(0, 121, 191)"
    this.collaborators = [
      202001,
      202002
    ]
    this.list = []
    this.activities = []
  }
}

class List {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.board_id = 1;
    this.user_id = 1;
    this.cards = [];
  }
}

class Card {
  constructor(id, content, list_id) {
    this.id = id;
    this.content = content;
    this.list_id = list_id;
    this.user_id = 1
    this.labels = ['df', 'SD'];
    this.descpition = '';
    this.members = [];
    this.date_created = new Date().toUTCString();
    this.due_date = '';
    this.sticker = [];
    this.locY = 0;
  }
}

class User {
  constructor(id, username, password) {
    this.user_id = id
    this.user_name = username
    this.password = password
  }
}
export { User, Board, List, Card }