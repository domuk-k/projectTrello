// import state
import { state } from "./board.js"
//State

const renderSideMenu = {
  initTab() {
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
          <li><span class="sticker"></span>Stickers</li>
          <li><i class="fas fa-cog"></i>More</li>
        </ul>
        <hr>
        <div class="activity-wrapper">
          <i class="list-icon fas fa-list"></i>
          <h3 class="activity-header">Activity</h3>
          <ul class="activity-list">
          </ul>
        </div>
      </div>
      `
    this.refreshLogs();
    this.bgSettingTab();
    this.aboutBoardTab();
  },
  refreshLogs() {
    let activitiesElms = ''
    state.currentBoard.activities.forEach(activity => {
      activitiesElms += `<li class="activity-item">${activity.act}:${activity.name}</li>`
    })
    document.querySelector('.activity-list').innerHTML = activitiesElms
  },
  bgSettingTab() {
    //요소 만들기
    const bgTab = document.createElement('div')
    bgTab.className = 'bg-tab-wrapper'

    bgTab.innerHTML =
      `
      <div class="bg-tab-header">
        <div class="btn-bg-previous"></div>
        <span class="bg-source">Photos by <a href="http://www.unsplash.com" target="_blank">Unsplash</a></span>
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
        <h3>About This Board</h3>
      </div>
      <hr>
      <h4><span class="fas fa-user-circle"></span>Made by</h4>
      <div class="board-user">${state.user.last_name} ${state.user.first_name}</div>
      <h4><span class="fas fa-align-left"></span>Description</h4>
      <div class="board-description">
      ${state.currentBoard.description}
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


export { initSideMenu, getLIelems }