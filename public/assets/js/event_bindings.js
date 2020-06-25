import { lazyLoader, inifiniteObserver } from './infinite-lazy.js'
import { initBoard, state, template } from './board.js'
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
    state.currentBoard.board_name = e.target.value
  },
  startSettingBoardDesc(e) {
    e.target.classList.add('description-active')
    // $('.save-description').add('btn-active')
    // $('.cancel-description').add('btn-active')
  },
  endSettingBoardDesc(e) {
    if (e.keyCode !== 13) return;
    e.target.classList.remove('description-active')
    // $('.save-description').remove('btn-active')
    // $('.cancel-description').remove('btn-active')
  },
  mainTab(e) {
    tabMode = "main"
    $('.sub-header-right').classList.add('side-menu-active')
    document.querySelector('.tab-wrapper-active').classList.remove('tab-wrapper-active')
    $('.main-tab-wrapper').classList.add('tab-wrapper-active')
  },
  closeSideMenu() {
    $('.sub-header-right').classList.remove('side-menu-active')
  },
  async bgTab(e) {
    tabMode = "bg-change"
    console.log('dfd??')
    document.querySelector('.tab-wrapper-active').classList.remove('tab-wrapper-active')
    $('.bg-tab-wrapper').classList.add('tab-wrapper-active')
    await attachPhotoUrlsAndLazyLoad()
  },
  setBgImage({ target }) {
    if (!target.matches('.bg-photos-list-items')) return;
    state.currentBoard.background_image = target.dataset.source
    template.background()
    document.querySelector('.bg-squre').style.backgroundImage = `url(${target.dataset.src})`
    axios.patch(`/boards/${state.currentBoard.id}`, { background_image: target.dataset.source })
    refreshActivityLog({
      name: state.user.full_name,
      act: "보드의 배경사진을 변경",
    })
  },
  aboutTab() {
    document.querySelector('.tab-wrapper-active').classList.remove('tab-wrapper-active')
    $('.about-tab-wrapper').classList.add('tab-wrapper-active')
  }
}

const refreshActivityLog = async (payload) => {
  await axios.post(`/boards/${state.currentBoard.id}/activities`, payload)
  state.activities = [...state.activities, payload]

  let activitiesLogElms = ''
  state.activities.forEach(datum => {
    activitiesLogElms += `<li><span class="log-name">${datum.name}님이 </span>
                              <span class="log-act">${datum.act}</span>했습니다.
                              <div class="log-value"> ${datum.value ? `바뀐 이름:${datum.value}` : ""} </div>
                          </li>`
  })
  console.log('??')
  $('.activity-list').innerHTML = activitiesLogElms
}

const attachPhotoUrlsAndLazyLoad = async () => {
  // bgTab이 열릴 때 요청해서 data-src에 담아준다.
  if (!photoUrls.length) await getPhotos() // photoUrl에 재할당

  const lazyImgs = document.querySelectorAll('.lazy-img')
  photoUrls.forEach((photoUrl, photoIndex) => {
    lazyImgs.forEach((img, imgIndex) => {
      if (photoIndex !== imgIndex) return;
      img.dataset.src = photoUrl.thumb
      img.dataset.source = photoUrl.custom
    })
  })
  lazyImgs.forEach(target => lazyLoader(target));

  $('.infinite-trigger').onload = attachInfiniteObserver
}


const attachInfiniteObserver = async () => {
  inifiniteObserver.observe($('.infinite-trigger'))

}

const getPhotos = async () => {
  const API_KEY2 = 'LMXx8kbllH0CjiUu1DD2X4kcrT_FnR_9yTjacwXC8zY'
  const API_KEY1 = 'nLiOUFEzySn2iky1ZHM9NiDoC99dDysByJVxIZ8r6YE'
  const photoCount = 30
  const queryKeyword = 'wallpaper'
  const query = `?featured=true&content_filter=high&count=${photoCount}&orientation=landscape&${queryKeyword}=wallpapers&w=1920&client_id=${API_KEY1}`
  const res = await axios(`https://api.unsplash.com/photos/random/${query}`)
  photoUrls = res.data.map(photo => photo.urls)
}

export { attachPhotoUrlsAndLazyLoad, getPhotos, refreshActivityLog, photoUrls }