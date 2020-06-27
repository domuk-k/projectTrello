// state
let state = {
  user: {},
  boards: [],
  defaultBoardId: 1,
  defaultBoard: {},
  currentBoard: {},
  activities: [],
};
console.log(state);
// DOM picks
const $header = document.querySelector('header');

const template = {
  init() {
    $header.innerHTML = `<div class="bg-container"></div>
        <section class="main-header"></section>
        <section class="sub-header"></section>
      `;
    this.background();
    this.header();
    this.subHeader();
  },
  background() {
    const $bgContainer = document.querySelector('.bg-container');
    console.log(state);
    let background = state.currentBoard.background_image
      ? `background-image:url(${state.currentBoard.background_image})`
      : `background-color:${state.currentBoard.background_color}`;
    $bgContainer.innerHTML = `
      <div class="board-bg" style=${background}></div>
      <div class="board-bg shadow-overlay"></div>
      `;
  },
  header() {
    const $header = document.querySelector('.main-header');
    $header.innerHTML = ` <div class="header-left">
          <button class="btn-home fas fa-home"></button>
          <button class="btn-boards-selection">Boards</button>
          <div class="modal-boards-selection">
            <div class="board-search-input-container">
            <input type="text" placeholder="Find boards by name">
            <button class="btn-search-close"></button>
            </div>
            <div class="starred-boards-list">
            <i class="far fa-star"></i>
            <span>STARRED BOARDS</span> 
            <div class="starred-boards-loaded"></div>
            </div>
            <div class="recent-boards-list">
            <i class="far fa-clock"></i>
            <span>RECENT BOARDS</span> 
            <div class="recent-boards-loaded"></div>
            </div>
            <div class="personal-boards-list">
            <i class="far fa-clipboard"></i>
            <span>PERSONNAL BOARDS</span>
            <div class="personnal-boards-loaded"></div>
            </div>
          </div>
          <div class="card-search">
            <input class="card-search-input" type="text">
            <i class="fas fa-search"></i>
          </div>
        </div> 
          <div class="header-logo"></div>
          <div class="header-right">
            <button class="btn-create-board fas fa-plus"></button>
            <div class="board-creation-modal-background">
            <div class="board-creation-wrapper">
              <div class="board-creation-modal">
                <input class="board-setting"/>
              </div>
              <div class="creation-modal-buttons">
                <button class="button-create-board">Create</button>
                <button class="cancel-modal">　</button>
              </div>
            </div>
          </div>
            <section class="my-profile" style="display:inline">
              <button class="btn-my-profile-icon">${state.user.last_name
                .match(/[A-Z]/g)
                .join('')}</button>
              <div class="my-cards"></div>
            </section>
          </div>
    `;
  },
  subHeader() {
    document.querySelector(
      '.sub-header',
    ).innerHTML = ` <div class="sub-header-left">    
        <span class="board-name">${state.currentBoard.board_name}</span>
        <textarea class="board-name-input" maxlength=12>${
          state.currentBoard.board_name
        }</textarea>
        <div class="btn-favorite favorite 
        ${state.currentBoard.is_starred ? 'fas fa-star' : 'far fa-star'}"></div>
        <button class="btn-invite">Invite</button>
      </div>
      <div class="sub-header-right">
        <button class="btn-menu-show">Show Menu</button>
        <nav id="scroll-area" class="side-menu"></nav>
      </div>
    `;
  },
};

const render = () => {
  template.init();
};

//1번 유저기준으로 보드배열과 디폴트로 표시할 보드 설정
const getBoard = async () => {
  let defaultUser = 1;
  const res = await axios.get(`/users/${defaultUser}`);
  const _user = await res.data;
  state.user = _user;
  state.boards = _user.boards;
  state.defaultBoard = _user.boards[state.defaultBoardId - 1];
  state.currentBoard = state.defaultBoard;
};

const initBoard = async () => {
  await getBoard();
  render();
};
export { initBoard, state, template };
