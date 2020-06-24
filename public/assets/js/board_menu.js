// import state
import { currentBoard } from "./board.js"
//State
let photoUrls = [];
let tabMode = "main"

//DOM Picks



const template = {
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
          <li class="board-info">
            <i class="fas fa-document"></i>
            About this board
          </li>
          <li class="btn-bg-change"><span class="bg-squre" style="background-image: url(${currentBoard.background_image})"></span>Change Background</li>
          <li><span class="sticker"></span>Stickers</li>
          <li><i class="fas fa-star"></i>More</li>
        </ul>
        <hr>
        <div class="activity-wrapper">
          <i class="list-icon fas fa-list"></i>
          <h3 class="activity-header">Activity</h3>
          <ul class="activity-logs">
          </ul>
        </div>
      </div>
      `
    this.bgSettingTab();
    this.aboutBoardTab();
  },
  bgSettingTab() {
    //요소 만들기
    const bgChangerPage = document.createElement('div')
    bgChangerPage.className = 'bg-tab-wrapper'
    // 노드 목록 만들기
    let listItemElements = ''
    for (let i = 0; i < 30; i++) {
      listItemElements += ` 
                          <li>
                          <img class="bg-photos-list-items lazy-img"
                              data-src="" data-source="")>
                          </li>
                          `
    }

    bgChangerPage.innerHTML =
      `
      <div class="bg-tab-header">
        <div class="btn-bg-previous"></div>
        <div>Photos by <a href="http://www.unsplash.com" target="_blank">Unsplash</a></div>
      </div>
      <ul class="bg-photos-list">
        ${listItemElements}
      </ul>
      `
    document.querySelector('.side-menu').appendChild(bgChangerPage);
  },
  aboutBoardTab() {
    `
    <div class="about-tab-wrapper">
      <div class="about-tab-header">
        <div class="btn-about-previous"></div>
        <h3>About This Board</h3>
      </div>
      <hr>
      <h4><span></span>Made by</h4>
      <div class="board-user"></div>
      <h4><span></span>Description</h4>
      <div class="board-description">
      </div>
    </div>
      `
  }
}

// const bindEvents = () => { }



const render = () => {
  template.initTab()
  // bindEvents();
}

const getPhotos = async () => {
  const API_KEY2 = 'LMXx8kbllH0CjiUu1DD2X4kcrT_FnR_9yTjacwXC8zY'
  const API_KEY1 = 'nLiOUFEzySn2iky1ZHM9NiDoC99dDysByJVxIZ8r6YE'
  const photoCount = 30
  const queryKeyword = 'wallpaper'
  const query = `?featured=true&content_filter=high&count=${photoCount}&orientation=landscape&${queryKeyword}=wallpapers&w=1920&client_id=${API_KEY2}`
  const res = await axios(`https://api.unsplash.com/photos/random/${query}`)
  photoUrls = res.data.map(photo => photo.urls)
}

const initSideMenu = async () => {
  render();
}


export { initSideMenu, template }