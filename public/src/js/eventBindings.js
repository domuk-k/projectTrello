export const eventBindings = () => {
  // 메뉴 버튼
  document.querySelector('.btn-menu').onclick = ({ target }) => {
    target.parentNode.classList.add('active')
    target.style.display = "none"
  }
  document.querySelector('.btn-menu-close').onclick = ({ target }) => {
    target.parentNode.parentNode.classList.remove('active')
    document.querySelector('.btn-menu').style.display = "inline-block";
  }
  // 보드 이름 수정
  document.querySelector('.board-name').onclick = ({ target }) => {
    target.style.display = "none"
    const input = target.nextElementSibling
    input.style.display = "inline-block"
    input.select();
  }
  document.querySelector('.board-name-input').onkeydown = e => {
    if (e.keyCode !== 13) return;
    const span = e.target.previousElementSibling
    span.textContent = e.target.value
    span.style.display = "inline-block"

    e.target.style.display = "none"
  }
  // document.querySelector('board_name_input')
}