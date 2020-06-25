const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
// db.json를 조작하기 위해 lowdb를 사용
// https://github.com/typicode/lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser)
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cors());
// Add custom routes before JSON Server router

// const users = db.get(`users`).value();
// const userIndex = users.findIndex(user => user.id === req.body.user_id);
// const boards = db.get(`users[${userIndex}].boards`).value();
// const boardIndex = boards.findIndex(board => board.id === req.body.board_id);
// const lists = db.get(`users[${userIndex}].boards[${boardIndex}].lists`).value();
// const listIndex = lists.findIndex(list => list.id === req.body.list_id);
// const cards = db.get(`users[${userIndex}].boards[${boardIndex}].lists[${cardIndex}]`).value();
// const cardIndex = cards.findIndex(card => card.id === req.body.card_id);

// GET
// get users
server.get('/users/:user_id', (req, res) => {
  res.send(
    db.get('users[0]')
      .value()
  )
})
// get boards
server.get('/boards', (req, res) => {
  res.send(
    db.get('users[0].boards')
      .value()
  )
})
// get a board
server.get('/boards/:board_id', (req, res) => {


  res.send(
    db.get(`users[0].boards[${req.params.board_id - 1}]`)
      .value()
  )
})
// get lists
server.get('/boards/:board_id/lists', (req, res) => {
  res.send(
    db.get(`users[0].boards[${req.params.board_id - 1}].lists`)
      .value()
  )
})
// get a list
server.get('/boards/:board_id/lists/:list_id', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === req.body.list_id);

  res.send(
    db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}]`)
      .value()
  )
})

// get cards
server.get('/boards/:board_id/lists/:list_id/cards', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === req.body.list_id);

  res.send(
    db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`).value()
  )
})

// get a card
server.get('/boards/:board_id/lists/:list_id/cards/:card_id', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === req.body.list_id);
  const cards = db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}]`).value();
  const cardIndex = cards.findIndex(card => card.id === req.body.card_id);

  res.send(
    db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards.[${cardIndex}]`).value()
  );
})

// get activity
server.get('/boards/:board_id/activities', (req, res) => {
  res.send(
    db.get(`users[0].boards[${req.params.board_id - 1}].activities`)
      .value()
  )
})



//POST
// push a board
server.post('/boards/', (req, res) => {
  db.get(`users[0].boards`)
    .push(req.body)
    .write()
})

// push a list
server.post('/boards/:board_id/lists', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}].lists`)
    .push(req.body)
    .last()
    .write()
  res.send(req.body)
})
// push a card
server.post('/boards/:board_id/lists/:list_id/cards', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === +req.params.list_id);

  db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`)
    .push(req.body)
    .write()

  res.send(db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value());
})
// push a card after drag
server.post('/boards/:board_id/lists/:list_id/cards/drag', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === +req.params.list_id);

  db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`)
    .push(req.body)
    .write()

  res.send(db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`).value());
})
// push lists
server.post('/boards/:board_id/lists/all', (req, res) => {
  req.body.forEach( list => {
    db.get(`users[0].boards[${req.params.board_id - 1}].lists`)
      .push(list)
      .write()
  });
  res.send(db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value());
})

// push cards
server.post('/boards/:board_id/lists/:list_id/cards/all', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === +req.params.list_id);

  req.body.forEach( card => {
    db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`)
      .push(card)
      .write()
  });
  res.send(db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value());
})
// push a activity
server.post('/boards/:board_id/activities', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}].activities`)
    .push(req.body)
    .write()
})

//PATCH
// update a board
server.patch('/boards/:board_id', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}]`)
    .assign(req.body)
    .write()
  res.send(req.body)
})
// update a board description
server.patch('/boards/:board_id/description', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}]`)
    .assign(req.body)
    .write()
})
// update a board board_name
server.patch('/boards/:board_id/board_name', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}]`)
    .assign(req.body)
    .write()
})
// update a list
server.patch('/boards/:board_id/lists/:list_id', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}]`)
    .assign(req.body)
    .write()
  res.send(req.body)
})
// update a card
server.patch('/boards/:board_id/lists/:list_id/cards/:card_id', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}].cards[${req.params.card_id - 1}]`)
    .assign(req.body)
    .write()
  res.send(req.body)
})


//DELETE
// remove a list
server.delete('/boards/:board_id/lists/:list_id', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === +req.params.list_id);

  db.get(`users[0].boards[${req.params.board_id - 1}].lists`)
    .remove(db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}]`).value())
    .write()

  res.send(db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value());
})
// remove a card
server.delete('/boards/:board_id/lists/:list_id/cards/:card_id', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === +req.params.list_id);
  const cards = db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`).value();
  const cardIndex = cards.findIndex(card => card.id === +req.params.card_id);

  db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`)
    .remove(db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards[${cardIndex}]`).value())
    .last()
    .write()

  res.send(db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value());
})
// remove a card after drag
server.delete('/boards/:board_id/lists/:list_id/cards/:card_id/drag', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === +req.params.list_id);
  const cards = db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`).value();
  const cardIndex = cards.findIndex(card => card.id === +req.params.card_id);

  res.send(db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards[${cardIndex}]`).value());
  db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards`)
    .remove(db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}].cards[${cardIndex}]`).value())
    .last()
    .write();

})
// remove lists
server.delete('/boards/:board_id/lists/all', (req, res) => {
  db.get(`users[0].boards[${req.params.board_id - 1}]`)
    .remove(db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value())
    .last()
    .write()
})
// remove cards
server.delete('/boards/:board_id/lists/:list_id/cards/all', (req, res) => {
  const lists = db.get(`users[0].boards[${req.params.board_id - 1}].lists`).value();
  const listIndex = lists.findIndex(list => list.id === +req.params.list_id);

  db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}]`)
    .remove(db.get(`users[0].boards[${req.params.board_id - 1}].lists[${listIndex}.cards]`).value())
    .last()
    .write()
})

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running')
});
