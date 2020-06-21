// import { Board } from "./board.js"

// state
let board = [];
let lists = [];
let cards = [];

// DOM picks
const $header = document.querySelector('.main-header')
const $boardBg = document.querySelector('.board-bg')

const template = {
  background() {
    if (board.backgrounds.color) {
      $boardBg.style.backgroundColor = board.backgrounds.color
    } else {
      $boardBg.style.backgroundImage = `url(${board.backgrounds.image})`
    }
  },
  header() {
    $header.innerHTML =
      `<div class="header-left">
          <button class="btn-home">Home</button>
          <button class="btn-board-selection">Boards</button>

          <div class="card-search">
            <button>돋보기</button>
            <input type="text" value="카드검색">
          </div>
        </div>
        <div class="header-logo"></div>
        <div class="header-right">
          <button class="btn-create-board">+</button>
          <section class="my-profile" style="display:inline">
            <button class="btn-my-profile-icon">DW</button>
              <div class="my-cards">
                <ul style="border:1px teal solid">
                  <li>${"cards"}</li>
                  <li>${"cards"}</li>
                </ul>
            </div>
          </section>
        </div>
  `
  },
  subHeader() {
    document.querySelector('.sub-header').innerHTML =
      ` <div class="sub-header-left">    
          <input type="text" value="${board.board_name}">
          <div class="favorite far fa-star"></div>
          <button class="invite">Invite</button>
        </div>
        <div class="sub-header-right">
          <button class="btn-star">✨</button>
          <button class="invite">invite</button>
          <button class="menu">Show Menu</button>
          <nav class="side-menu"></nav>
        </div >
      `
  },
  lists() {
    let html = ''
    lists.forEach(list => {
      html += `
    <div class="list-wrapper">
      <div class="list">
        <div class="list-name">${list.list_name}</div>
        <ul class="list-container list-${list.id}">
        </ul>
        <div class="list-name-input">
          <input type="text" placeholder="insert todos">
        </div>
      </div>
    </div>
    `
    })
    document.querySelector('main').innerHTML = html
  },
  cards() {
    console.log(cards[0])
    cards.forEach(card => {
      document.querySelector(`.list-${card.list_id}`).innerHTML +=
        `
      <li>
      ${card.card_name}
      </li>
      `
    })
  },
  sideMenu() {
    document.querySelector('.side-menu').innerHTML =
      `    <div class="menu-header">Menu</div>
        <ul>
          <li>about this board</li>
          <li>change Background</li>
          <li>Search Cards</li>
          <li>Stickers</li>
          <li>More</li>
        </ul>
      <div class="activity">
        <div class="activity-header">
          Activity
        </div>
        <ul class="activity-logs">
        </ul>
      </div>`
  }

}

const render = () => {
  template.background()
  template.header()
  template.subHeader()
  template.lists()
  template.cards()
  template.sideMenu()
}


async function getBoard() {
  const res = await axios.get('/board/');
  const _boards = await res.data;
  board = _boards
  await getLists();
  await getCards();
  render();
}

async function getLists() {
  const res = await axios.get('/lists');
  lists = res.data;
}
async function getCards() {
  const res = await axios.get('/cards');
  cards = res.data;
}

window.onload = getBoard;

document.body.onclick = ({ target }) => {
  if (!target.matches('.menu')) return;
  target.parentNode.classList.toggle('active')
}

// async function removeTodo() {
//   const res = await axios.delete('/boards/2');
//   const _boards = await res.data;
//   boards = _boards
//   console.log(boards)
// }
