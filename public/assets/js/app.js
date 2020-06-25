import { state, initBoard } from "./board.js"
import { initSideMenu } from "./board_side_menu.js"
import { initMain } from "./mainCanvas.js"
import { bindEvents } from "./event_bindings.js"


window.onload = async () => {
  await initBoard();
  await initSideMenu();
  await initMain();
  bindEvents();
  document.querySelector('.modal-boards-selection').onclick = switchBoard
}

const switchBoard = async ({ target }) => {
  if (!target.matches('.board-result-item')) return;
  state.defaultBoardId = target.dataset.boardId
  state.currentBoard = state.boards.find(board => board.id === +target.dataset.boardId)
  await initBoard();
  await initSideMenu();
  await initMain();
  bindEvents();
  document.querySelector('.modal-boards-selection').onclick = switchBoard
}

