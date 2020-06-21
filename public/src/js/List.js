// eslint-disable-next-line import/prefer-default-export
export class List {
  constructor(id, name, board_id, user_id = 2020001) {
    this.id = id;
    this.name = name;
    this.board_id = board_id;
    this.user_id = user_id;
  }
}
