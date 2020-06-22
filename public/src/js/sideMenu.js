import * as header from "./header.js"
export let urls = [];

export const template = {
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
          <li class="btn-bg-change"><span class="bg-squre"></span>change Background</li>
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
  async changeToBgMenu() {
    if (!document.querySelector('.bg-menu-wrapper')) {
      await getPhotos();
      // 요소 만들어서 넣기
      let html = ''
      urls.forEach(url => {
        html += `<span class="bg-photos-list-items" style="background-image: url(${url.thumb})" data-src="${url.custom}")></span>`
      })

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
      <div class="bg-photos-list">
        ${html}
      </div>
      `
      document.querySelector('.side-menu').appendChild(bgChangerPage);
    }

    document.querySelector('.btn-previous').onclick = (e) => {
      if (!e.target.matches('.btn-previous')) return;
      document.querySelector('.bg-menu-wrapper').style.display = 'none'
      document.querySelector('.main-menu-wrapper').style.display = 'block'
      //
    }
  }
}

const API_KEY2 = 'LMXx8kbllH0CjiUu1DD2X4kcrT_FnR_9yTjacwXC8zY'
const API_KEY1 = 'nLiOUFEzySn2iky1ZHM9NiDoC99dDysByJVxIZ8r6YE'

const getPhotos = async () => {
  const res = await axios(`https://api.unsplash.com/photos/random/?count=30&orientation=landscape&query=night&w=2048&client_id=${API_KEY1}`)
  urls = await res.data.map(photo => photo.urls)
}

export const initSideMenu = () => {
  template.sideMenu()
}