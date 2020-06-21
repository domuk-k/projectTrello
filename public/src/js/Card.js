export class Card {
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