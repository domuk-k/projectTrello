// import state
import { state } from "./board.js"
//State

const renderSideMenu = {
  async initTab() {
    let activitiesLogElms = ''
    state.activities.forEach(datum => {
      activitiesLogElms += `<li><span class="log-name">${datum.name}님이 </span>
                                <span class="log-act">${datum.act}</span>했습니다.
                                <div class="log-value"> ${datum.value ? `바뀐 이름:${datum.value}` : ""} </div>
                            </li>`
    })
    document.querySelector('.side-menu').innerHTML =
      `
      <div class="main-tab-wrapper tab-wrapper-active">
        <div class="main-tab-header">
          <h3>Menu</h3>
          <button class="btn-menu-close"></button>
        </div>
        <hr>
        <ul class="menu-list">
          <li class="btn-info-tab">
            <i class="far fa-address-card"></i>
            About this board
          </li>
          <li class="btn-bg-tab"><span class="bg-squre" style="background-image: url(${state.currentBoard.background_image})"></span>Change Background</li>
          <li><span class="i-sticker"></span>Stickers</li>
          <li><i class="fas fa-cog"></i>More</li>
        </ul>
        <hr>
        <div class="activity-wrapper">
          <i class="list-icon fas fa-list"></i>
          <h3 class="activity-header">Activity</h3>
          <ul class="activity-list">
          ${activitiesLogElms}
          </ul>
        </div>
      </div>
      `
    this.bgSettingTab();
    this.aboutBoardTab();
  },

  bgSettingTab() {
    //요소 만들기
    const bgTab = document.createElement('div')
    bgTab.className = 'bg-tab-wrapper'

    bgTab.innerHTML =
      `
      <div class="bg-tab-header">
        <div class="btn-bg-previous"></div>
        <span class="bg-tab-title">Photos by <a href="http://www.unsplash.com" target="_blank">Unsplash</a></span>
      </div>
      <ul class="bg-photos-list">
        ${getLIelems()}
      </ul>
      `
    document.querySelector('.side-menu').appendChild(bgTab);
  },
  aboutBoardTab() {
    const aboutTab = document.createElement('div')
    aboutTab.className = 'about-tab-wrapper'
    aboutTab.innerHTML =
      `
      <div class="about-tab-header">
        <div class="btn-about-previous"></div>
        <span class="about-tab-title">About This Board</span>
      </div>
      <hr>
      <span class="about-tab-sub-title-made-by"><i class="fas fa-user-circle"></i>Made by</span>
      <div class="board-user">${state.user.last_name} ${state.user.first_name}</div>
      <span class="about-tab-sub-title-description"><i class="fas fa-align-left"></i>Description</span>
      <div class="board-description">
        <textarea class="board-description-input">
        ${state.currentBoard.description}
        </textarea>
        <div class="buttons-description">
          <button class="save-description">Save</button>
          <button class="cancel-description">Cancel</button>
         </div>
      </div>
      `
    document.querySelector('.side-menu').appendChild(aboutTab);
  }
}

const getLIelems = () => {
  // 노드 목록 만들기
  let listItemElements = ''
  for (let i = 0; i < 30; i++) {
    listItemElements +=
      ` 
      <li>
      <img class="bg-photos-list-items lazy-img ${i === 29 ? "infinite-trigger" : ""}"
          data-src="" data-source="")>
      </li>
      `
  }
  return listItemElements;
}

const initSideMenu = async () => {
  renderSideMenu.initTab()
}


export { initSideMenu, getLIelems, renderSideMenu }