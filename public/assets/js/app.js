import { initBoard } from "./board.js"
import { initSideMenu } from "./board_menu.js"
import { initMain } from "./mainCanvas.js"
import { bindEvents } from "./eventBindings.js"


window.onload = async () => {
  await initBoard();
  await initSideMenu();
  await initMain();
  bindEvents();
}