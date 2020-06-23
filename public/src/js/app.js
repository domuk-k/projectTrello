import { initMain } from "./mainCanvas.js"
import { initHeader } from "./header.js"
import { initSideMenu } from "./sideMenu.js"
import { bindEvents } from "./eventBindings.js"

window.onload = async () => {
  await initHeader();
  await initMain();
  initSideMenu();
  bindEvents();
}