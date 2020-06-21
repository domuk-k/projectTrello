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


