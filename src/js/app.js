<<<<<<< HEAD:src/js/app.js
import "@babel/polyfill";
import { initMain } from "./main.js"
=======
import { initMain } from "./mainCanvas.js"
>>>>>>> 53a525ac71b118d4c8e90acdbf742323d76cca11:public/src/js/app.js
import { initHeader } from "./header.js"
import { initSideMenu } from "./sideMenu.js"
import { bindEvents } from "./eventBindings.js"


window.onload = async () => {
  await initHeader();
  await initMain();
  initSideMenu();
  bindEvents();
}