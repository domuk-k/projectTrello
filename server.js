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
// Add custom routes before JSON Server router////

// get 요청
server.get('/users', (req, res) => {
  res.send(db.get('users[0]').value())
})

server.get('/users/:user_id', (req, res) => {
  res.send(db.get(`users[${req.params.user_id - 1}]`).value())
})

server.get('/users/:user_id/boards', (req, res) => {
  res.send(
    db.get(`users[${req.params.user_id - 1}].boards`)
      .value()
  )
})
server.get('/users/:user_id/boards/:board_id', (req, res) => {
  res.send(
    db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}]`)
      .value()
  )
})
server.get('/users/:user_id/boards/:board_id/lists', (req, res) => {
  res.send(
    db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}].lists`)
      .value()
  )
})
server.get('/users/:user_id/boards/:board_id/lists/:list_id', (req, res) => {
  res.send(
    db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}]`)
      .value()
  )
})
server.get('/users/:user_id/boards/:board_id/lists/:list_id/cards/:card_id', (req, res) => {
  res.send(
    db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}].cards`)
      .value()
  )
})
server.get('/users/:user_id/boards/:board_id/lists/:list_id', (req, res) => {
  res.send(
    db.get(`users[${req.params.board_id - 1}].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}].cards[${req.params.card_id}]`)
      .value()
  )
})



// post
// server.get('/users', (req, res) => {
//   res.send(db.get('users').value())
// })

// server.get('/users/:user_id', (req, res) => {
//   res.send(db.get(`users[${req.params.user_id - 1}]`).value())
// })
// server.get('/users/:user_id/boards', (req, res) => {
//   res.send(
//     db.get(`users[${req.params.user_id - 1}].boards`)
//       .value()
//   )
// })
// server.get('/users/:user_id/boards/:board_id', (req, res) => {
//   res.send(
//     db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}]`)
//       .value()
//   )
// })
// server.get('/users/:user_id/boards/:board_id/lists', (req, res) => {
//   res.send(
//     db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}].lists`)
//       .value()
//   )
// })
// server.get('/users/:user_id/boards/:board_id/lists/:list_id', (req, res) => {
//   res.send(
//     db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}]`)
//       .value()
//   )
// })
// server.get('/users/:user_id/boards/:board_id/lists/:list_id/cards/:card_id', (req, res) => {
//   res.send(
//     db.get(`users[${req.params.user_id - 1}].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}].cards`)
//       .value()
//   )
// })
// server.get('/users/:user_id/boards/:board_id/lists/:list_id', (req, res) => {
//   res.send(
//     db.get(`users[${req.params.board_id - 1}].boards[${req.params.board_id - 1}].lists[${req.params.list_id - 1}].cards[${req.params.card_id}]`)
//       .value()
//   )
// })


// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running')
});
