
// server.js
// const cors = require('cors');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({});


// db.json를 조작하기 위해 lowdb를 사용
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// server.use(cors());

server.get('user/board', (req, res) => {
  console.log(req)
  console.log(res)
})

// .remove({ list_id: req.params.list_id })
// .write();
// Add custom routes before JSON Server router

// lowdb를 사용해서 db.json에서 completed: true인 todo를 제거

// todos를 응답


// Use default router
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running')
});