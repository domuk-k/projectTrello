import * as header from "./header.js"
import { lazyLoader } from "./infinite-lazy.js"

let photoUrls = [];
let listItemElements = ''
const template = {
  sideMenu() {
    document.querySelector('.side-menu').innerHTML =
      `    
      <div class="main-menu-wrapper">
      <div class="main-menu-wrapper">
        <div class="main-menu-header">
          <h3>Menu</h3>
          <button class="btn-menu-close"></button>
        </div>
      </div>
      <hr>
        <ul class="menu-list">
          <li class="board-info"><i class="fas fa-star"></i>About this board</li>
          <li class="btn-bg-change"><span class="bg-squre" style="background-image: url(${header.board.background_image})"></span>Change Background</li>
          <li><i class="fas fa-star"></i>Search Cards</li>
          <li><i class="fas fa-star"></i>Stickers</li>
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
  },
  async getPhotoListItems() {
    await getPhotos();
    photoUrls.forEach((url, i) => {
      listItemElements += ` 
                  <li>
                    <img class="bg-photos-list-items lazy-img"
                    data-src="${url.thumb}" data-source="${url.custom}")>
                  </li>`
    })
    return listItemElements
  },
  // event handler
  async changeToBgMenu() {
    if (!document.querySelector('.bg-menu-wrapper')) {
      //get data and load on memory as photoUrls
      await template.getPhotoListItems();
      // 요소 만들어서 넣기
      const bgChangerPage = document.createElement('div')
      bgChangerPage.className = 'bg-menu-wrapper'
      bgChangerPage.innerHTML =
        `
        <div class="bg-menu-header-wrapper">
          <div class="bg-menu-header">
            <div class="btn-previous"></div>
            <div>Photos by <a href="http://www.unsplash.com" target="_blank">Unsplash</a></div>
          </div>
        </div>
      <ul class="bg-photos-list">
        ${listItemElements}
      </ul>
      `
      document.querySelector('.side-menu').appendChild(bgChangerPage);
    }


    document.querySelector('.btn-previous').onclick = (e) => {
      if (!e.target.matches('.btn-previous')) return;
      document.querySelector('.bg-menu-wrapper').style.display = 'none'
      document.querySelector('.main-menu-wrapper').style.display = 'block'
    }
    // pick lazy-loading target elements 
    const lazyTargets = document.querySelectorAll('.lazy-img')
    const infiTarget = document.querySelector('.infinite-trigger')
    lazyTargets.forEach(target => lazyLoader(target));
  }
}


const getPhotos = async () => {
  // const API_KEY2 = 'LMXx8kbllH0CjiUu1DD2X4kcrT_FnR_9yTjacwXC8zY'
  const API_KEY1 = 'nLiOUFEzySn2iky1ZHM9NiDoC99dDysByJVxIZ8r6YE'
  const photoCount = 30
  const queryKeyword = 'wallpaper'
  const query = `?featured=true&content_filter=high&count=${photoCount}&orientation=landscape&${queryKeyword}=wallpapers&w=1920&client_id=${API_KEY1}`
  const res = await axios(`https://api.unsplash.com/photos/random/${query}`)
  photoUrls = await res.data.map(photo => photo.urls)
}

const initSideMenu = () => {
  template.sideMenu()
}



export { photoUrls, template, initSideMenu }