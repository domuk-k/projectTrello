import * as boardSideMenu from "./board_side_menu.js"
import * as mainCanvas from "./mainCanvas.js"
import { Board } from './constructors.js'
let tabMode = "main"
let photoUrls = [];
const $ = (target) => document.querySelector(target)
export const bindEvents = () => {
  // 메인 헤더
  // 보드 선택 모달 띄우기
  $('.btn-boards-selection').onclick = handlers.showBoards
  $('.btn-search-close').onclick = handlers.showBoards
  // 즐겨찾기
  $('.btn-favorite').onclick = handlers.toggleStar
  // 글로벌 카드 검색 인풋 //클래스로만 구현하자..
  $('.card-search-input').onclick = handlers.openSearchInput
  $('.card-search-input').onblur = handlers.closeSearchInput
  // 보드 추가
  $('.btn-create-board').onclick = handlers.openBoardCreationModal
  // 보드 추가 모달 닫기
  $('.button-create-board').onclick = handlers.createNewBoard
  $('.cancel-modal').onclick = handlers.closeBoardCreationModal
  $('.board-creation-modal-background').onclick = handlers.closeBoardCreationModal
  // 보드 추가 인풋
  $('.board-setting').onkeydown = handlers.checkIfblank
  // 서브 헤더
  // 보드 이름 수정
  $('.board-name').onclick = handlers.startSettingBoardName
  $('.board-name-input').onblur = handlers.endSettingBoardName
  $('.board-name-input').onkeydown = handlers.endSettingBoardName
  // 보드 설명 수정
  $('.board-description-input').onclick = handlers.startSettingBoardDesc
  $('.board-description-input').onclick = handlers.endSettingBoardDesc
  // 사이드 메뉴
  $('.btn-menu-show').onclick = handlers.mainTab
  $('.side-menu').onblur = handlers.closeSideMenu
  // 사이드 메뉴 중 끄는 버튼
  $('.btn-menu-close').onclick = handlers.closeSideMenu
  // 사이드 메뉴 중 배경화면 탭 보기
  $('.btn-bg-tab').onclick = handlers.bgTab
  // 사이드 메뉴 중 돌아가기 버튼
  $('.btn-bg-previous').onclick = handlers.mainTab
  $('.btn-about-previous').onclick = handlers.mainTab
  $('.bg-photos-list').onclick = handlers.setBgImage
  // 배경화면 변경 탭
  // 보드 설정 탭
  $('.btn-info-tab').onclick = handlers.aboutTab
  // 스티커 탭
  // 모어 탭
}
const handlers = {
  async showBoards() {
    $('.modal-boards-selection').classList.toggle('selection-active')
    // stuff inside the modal
    const res = await axios.get('/boards');
    const allBoards = res.data;
    const recentBoard = allBoards.sort((board1, board2) => board1.recent_open < board2.recent_open)[0]
    let personalBoardsElm = ''
    let starredBoardsElm = ''
    let recentBoardElm = `<div class="board-result-item" data-board-id="${recentBoard.id}"><span class="bg-squre modal-icon" style="background-image:url(${recentBoard.background_image})"></span><span class="board-li-elms">${recentBoard.board_name}</span></div>`
    allBoards.forEach(board => {
      personalBoardsElm += `<div class="board-result-item" data-board-id="${board.id}"><span class="bg-squre modal-icon" style="background-image:url(${board.background_image})"></span><span class="board-li-elms">${board.board_name}</span></div>`
      if (board.is_starred) starredBoardsElm += `<div class="board-result-item" data-board-id="${board.id}"><span class="bg-squre modal-icon" style="background-image:url(${board.background_image})"></span><span class="board-li-elms">${board.board_name}</span></div>`
    })
    $('.personnal-boards-loaded').innerHTML = `${personalBoardsElm} `
    $('.starred-boards-loaded').innerHTML = `${starredBoardsElm} `
    $('.recent-boards-loaded').innerHTML = `${recentBoardElm} `
  },
  async toggleStar({ target }) {
    target.classList.toggle('far')
    target.classList.toggle('fas')
    const latestStateRes = await axios.get(`/boards/${state.currentBoard.id}`)
    const latestBoard = latestStateRes.data
    axios.patch(`/boards/${state.currentBoard.id}/star`, { is_starred: !latestBoard.is_starred })
    refreshActivityLog({
      name: state.user.full_name,
      act: "보드를 즐겨찾기를 변경",
    })
  },
  openSearchInput({ target }) {
    target.parentElement.classList.add('search-active')
  },
  closeSearchInput({ target }) {
    target.parentElement.classList.remove('search-active')
    target.value = ''
  },
  openBoardCreationModal({ target }) {
    $('.board-creation-modal-background').classList.add('creation-active')
  },
  closeBoardCreationModal({ target }) {
    if (!(target.matches('.board-creation-modal-background') || target.matches('.cancel-modal'))) return;
    $('.board-creation-modal-background').classList.remove('creation-active')
  },
  checkIfblank({ target }) {
    if (target.value) { $('.button-create-board').classList.add('active') }
    else {
      $('.button-create-board').classList.remove('active')
    }
  },
  async createNewBoard() {
    if (!$('.board-setting').value.trim()) return;
    const newBoard = new Board(Math.max(...state.boards.map(board => board.id), 0) + 1, `${$('.board-setting').value}`)
    state.boards.push(newBoard)
    state.currentBoard = newBoard
    $('.board-creation-modal-background').classList.remove('creation-active')
    await axios.post('/boards', newBoard)
  },
  startSettingBoardName({ target }) {
    target.parentElement.classList.add('board-name-active')
    target.nextElementSibling.select();
  },
  async endSettingBoardName(e) {
    if (!e.key) e.target.parentElement.classList.remove('board-name-active')
    if (e.keyCode !== 13) return;
    const nameBlock = e.target.previousElementSibling
    nameBlock.textContent = e.target.value
    e.target.parentElement.classList.remove('board-name-active')
    await refreshActivityLog({
      name: state.user.full_name,
      act: '보드의 이름을 변경',
      value: e.target.value,
      recent_value: state.currentBoard.board_name
    })
    await axios.patch(`/boards/${state.defaultBoardId}/board_name`, { board_name: e.target.value })