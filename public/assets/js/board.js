// state
let boards = [];
let defaultBoardId = 1;
let currentBoard = {}



// DOM picks
const $header = document.querySelector('header');

const template = {
  init() {
    $header.innerHTML +=
      `<div class="bg-container"></div>
        <section class="main-header"></section>
        <section class="sub-header"></section>
      `
    this.background();
    this.header();
    this.subHeader()
  },
  background() {
    const $bgContainer = document.querySelector('.bg-container')
    if (!currentBoard.background_image) $bgContainer.firstElementChild.style.backgroundColor = currentBoard.background_color;
    $bgContainer.innerHTML =
      `
      <div class="board-bg" style ="background-image : url(${currentBoard.background_image})"></div>
      <div class="board-bg shadow-overlay"></div>
      `
  },
  header() {
    const $header = document.querySelector('.main-header');
    $header.innerHTML =
      ` <div class="header-left">
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
          </div>
        </section>
      </div>
    `
  },
  subHeader() {
    document.querySelector('.sub-header').innerHTML =
      ` <div class="sub-header-left">    
        <span class="board-name">${currentBoard.board_name}</span>
        <textarea class="board-name-input" maxlength=10>${currentBoard.board_name}</textarea>
        <div class="btn-favorite favorite far fa-star"></div>
        <button class="btn-invite">Invite</button>
      </div>
      <div class="sub-header-right">
        <button class="btn-menu">Show Menu</button>
        <nav id="scroll-area" class="side-menu"></nav>
      </div >
    `
  }
}

const render = () => {
  template.init()
}

//1번 유저기준으로 보드배열과 디폴트로 표시할 보드 설정
const getBoard = async () => {
  const res = await axios.get(`/users/${1}`);
  const _user = await res.data
  boards = _user.boards
  currentBoard = boards[defaultBoardId - 1]
}

const initBoard = async () => {
  await getBoard();
  render();
}

export { initBoard, currentBoard }