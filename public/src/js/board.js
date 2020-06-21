export class User {
  constructor(id, username, password) {
    this.user_id = id
    this.user_name = username
    this.password = password
  }
}
export class Board {
  constructor(id, name, user_id = 2020001) {
    this.id = id
    this.name = name;
    this.user_id = user_id
    this.descpition = "이것은 샘플 보드";
    this.collaborators = [
      202001,
      202002
    ]
    this.recent_open = null
    this.is_starred = false
    this.backgrounds = {
      color: "rgb(0, 121, 191)",
      images: ""
    }
  }
}
export class List {
  constructor(id, name, board_id, user_id = 2020001) {
    this.id = id;
    this.name = name;
    this.board_id = board_id
    this.user_id = user_id
  }
}

export class Cards {
  constructor(id, name, list_id, user_id = 2020001) {
    this.id = id
    this.name = name
    this.list_id = list_id
    this.user_id = user_id
    this.labels = ["df", "SD"];
    this.descpition = ""
    this.members = [user_id]
    this.date_created = new Date().toUTCString()
    this.due_date = ''
    this.sticker = []
  }
}