import { template } from "./sideMenu.js"
import * as headerTemplate from "./header.js"

let isSlideOn = false;
let slideMode = 'main'

export const bindEvents = () => {
  // 메뉴 버튼
  document.querySelector('.btn-menu').onclick = eventHandlers.showSideMenu
  // 사이드 메뉴 중 끄는 버튼
  document.querySelector('.btn-menu-close').onclick = eventHandlers.closeSideMenu
  // 사이드 메뉴 중 배경화면 선택화면으로 버튼
  document.querySelector('.btn-bg-change').onclick = eventHandlers.bgChanger
  // 보드 이름 수정
  document.querySelector('.board-name').onclick = eventHandlers.showInputofBoardname;
  document.querySelector('.board-name-input').onkeydown = eventHandlers.renameBoard;
  // 글로벌 카드 검색 인풋
  document.querySelector('.card-search-input').onclick = eventHandlers.drawSearchInput;
  document.querySelector('.card-search-input').onkeydown = eventHandlers.drawSearchInput;
  document.querySelector('.card-search-input').onblur = eventHandlers.getback;

  // 사이드 메뉴 중 배경화면 선택화면 나가기 버튼
};

const eventHandlers = {
  showSideMenu({ target }) {
    isSlideOn = true;
    slideMode = 'main'
    target.parentNode.classList.add('active')
    target.style.display = "none"
  },
  closeSideMenu({ target }) {
    isSlideOn = false;
    document.querySelector('.sub-header-right').classList.remove('active')
    document.querySelector('.btn-menu').style.display = "inline-block";
  },
  showInputofBoardname({ target }) {
    target.style.display = "none"
    const input = target.nextElementSibling
    input.style.display = "inline-block"
    input.select();
  },
  renameBoard(e) {
    if (e.keyCode !== 13) return;
    console.log(e.target)
    const span = e.target.previousElementSibling
    span.textContent = e.target.value
    span.style.display = "inline-block"

    e.target.style.display = "none"
  },
  getback(e) {
    headerTemplate.template.header()
    document.querySelector('.card-search-input').onclick = eventHandlers.drawSearchInput;
    document.querySelector('.card-search-input').onkeydown = eventHandlers.drawSearchInput;
    document.querySelector('.card-search-input').onblur = eventHandlers.asdf;
  },
  drawSearchInput(e) {
    if (!e.keyCode === 27) return;
    e.target.parentElement.style.backgroundColor = 'white'
    e.target.style.width = '190px'
    e.target.style.color = 'black'
    e.target.firstElementChild.style.width = '170px'
  },
  bgChanger() {
    slideMode = 'bgChange'
    template.bgChanger()

  }
}

