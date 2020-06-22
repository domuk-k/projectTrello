
// state
export let board = [];
let lists = [];
let cards = [];

// DOM picks
const $header = document.querySelector('.main-header');
const $boardBg = document.querySelector('.board-bg');

export const template = {
  background() {
    if (!$boardBg.style.backgroundImage) $boardBg.style.backgroundColor = board.backgrounds.color;
    $boardBg.style.backgroundImage = `url(${board.backgrounds.image})`
  },
  header() {
    $header.innerHTML =
      `<div class="header-left">
          <button class="btn-home fas fa-home"></button>
          <button class="btn-board-selection">Boards</button>

          <div class="card-search">
           <input class="card-search-input" type="text">
            <i class="fas fa-search"></i>
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
  }
}

const render = () => {
  template.background()
  template.header()
  template.subHeader()
}

async function getBoard() {
  const res = await axios.get('/board/');
  const _boards = await res.data;
  board = _boards
}
// async function getCards() {
//   const res = await axios.get('/cards/');
//   const _cards = await res.data;
//   cards = _cards
// }
export const initHeader = async () => {
  await getBoard();
  render();
}
