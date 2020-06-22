import { Board } from "./board.js"
import { Card } from "./card.js"
// import { list } from "./List.js"
import { User } from "./user.js"

import { eventBindings } from "./eventBindings.js"
// state
let board = [];
let lists = [];
let cards = [];

// DOM picks
const $header = document.querySelector('.main-header');
const $boardBg = document.querySelector('.board-bg');

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
          <button class="btn-home fas fa-home"></button>
          <button class="btn-board-selection">Boards</button>

          <div class="card-search">
            <button class="fas fa-search"></button>
            <input type="text" value="카드검색">
          </div>
        </div>
        <div class="header-logo"></div>
        <div class="header-right">
          <button class="btn-create-board fas fa-plus"></button>
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
          <span class="board-name">${board.board_name}</span>
          <textarea class="board-name-input" maxlength=10>${board.board_name}</textarea>
          <div class="btn-favorite favorite far fa-star"></div>
          <button class="btn-invite">Invite</button>
        </div>
        <div class="sub-header-right">
          <button class="btn-menu">Show Menu</button>
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
      <div class="list-header js-list-header u-clearfix is-menu-shown">
      <div class="list-header-target js-editing-target"></div>
      <h2 class="list-header-name-assist js-list-name-assist" dir="auto">To Do</h2>
      <textarea class="list-header-name mod-list-name js-list-name-input" aria-label="To Do" spellcheck="false" dir="auto" maxlength="512" style="overflow: hidden; overflow-wrap: break-word; height: 28px;">To Do</textarea>
      <div class="list-header-extras">
      <span class="list-header-extras-subscribe js-list-subscribed hide">
      <span class="icon-sm icon-subscribe mod-quiet"></span>
      </span>
      <span class="list-header-extras-limit-badge js-list-limit-badge hide"></span>
      <a class="list-header-extras-menu dark-hover js-open-list-menu icon-sm icon-overflow-menu-horizontal" href="#">
      <div>
      </div>
      </a>
      </div>
      <p class="list-header-num-cards hide js-num-cards">6 cards</p></div>
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
      <button class="btn-menu-close">X</button>
        <ul class="menu-list">
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

window.onload = async () => {
  await getBoard();
  eventBindings();
}



// async function removeTodo() {
//   const res = await axios.delete('/boards/2');
//   const _boards = await res.data;
//   boards = _boards
//   console.log(boards)
// }
