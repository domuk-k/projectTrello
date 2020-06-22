export const bindEvents = () => {
  // 메뉴 버튼
  document.querySelector('.btn-menu').onclick = eventHandlers.showSideMenu

  document.querySelector('.btn-menu-close').onclick = eventHandlers.closeSideMenu
  // 보드 이름 수정
  document.querySelector('.board-name').onclick = eventHandlers.showInputofBoardname
  document.querySelector('.board-name-input').onkeydown = eventHandlers.renameBoard

  document.querySelector('.card-search-input').onclick = eventHandlers.drawSearchInput
  document.querySelector('.card-search-input').onkeydown = eventHandlers.drawSearchInput
};

const eventHandlers = {
  showSideMenu({ target }) {
    target.parentNode.classList.add('active')
    target.style.display = "none"
  },
  closeSideMenu({ target }) {
    target.parentNode.parentNode.parentNode.classList.remove('active')
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
  drawSearchInput(e) {
    if (!e.keyCode === 27) return;
    e.target.parentElement.style.backgroundColor = 'white'
    e.target.style.width = '190px'
    e.target.style.color = 'black'
    e.target.firstElementChild.style.width = '170px'
  }
}

