// eslint-disable-next-line import/prefer-default-export
export class Card {
  constructor(id, content, list_id) {
    this.id = `card-${id}`;
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