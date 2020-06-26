class Board {
  constructor(id, name) {
    this.id = id
    this.board_name = name
    this.descpition = "이것은 샘플 보드"
    this.background_color = ""
    this.background_image = this.randomImage()
    this.background_color = "rgb(0, 121, 191)"
    this.is_starred = false
    this.recent_open = new Date()
    this.collaborators = [
      202001,
      202002
    ]
<<<<<<< HEAD
    this.lists = []
=======
    this.lists = [
      { id: 1, name: 'to do', cards: [] },
      { id: 2, name: 'doing', cards: [] },
      { id: 3, name: 'done', cards: [] }
    ]
>>>>>>> fabfb6b25533fed3c0a54d94256f11be80a60a63
    this.activities = []
  }
  async randomImage() {
    const API_KEY2 = 'LMXx8kbllH0CjiUu1DD2X4kcrT_FnR_9yTjacwXC8zY'
    const query = `?featured=true&content_filter=high&orientation=landscape&w=1920&client_id=${API_KEY2}`
    const res = await axios(`https://api.unsplash.com/photos/random/${query}`)
    return `${res.data.urls.custom}`
  }
}

class List {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.cards = [];
  }
}

class Card {
  constructor(id, cardName, list_id) {
    this.id = id;
    this.card_name = cardName;
    this.list_id = list_id;
    this.labels = ['df', 'SD'];
    this.description = 'Add a more detailed description';
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