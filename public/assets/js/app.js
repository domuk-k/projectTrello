import { initBoard } from "./board.js"
import { initSideMenu } from "./board_side_menu.js"
import { initMain } from "./mainCanvas.js"
import { bindEvents } from "./event_bindings.js"


window.onload = async () => {
  await initBoard();
  await initSideMenu();
  await initMain();
  bindEvents();
}