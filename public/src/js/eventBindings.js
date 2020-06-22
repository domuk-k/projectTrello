// eslint-disable-next-line import/prefer-default-export
export const eventBindings = () => {
  document.body.onclick = ({
    target
  }) => {
    if (!target.matches('.menu')) return;
    target.parentNode.classList.toggle('active')
  }
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
};