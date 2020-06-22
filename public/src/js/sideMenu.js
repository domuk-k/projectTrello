export let thumbnails = [];

export const template = {
  sideMenu() {
    document.querySelector('.side-menu').innerHTML =
      `    
      <div class="menu-wrapper">
        <div class="menu-header">
          <h3>Menu</h3>
          <button class="btn-menu-close fas fa-times"></button>
        </div>
      </div>
      <hr>
        <ul class="menu-list">
          <li class="board-info"><i class="fas fa-star"></i>About this board</li>
          <li class="btn-bg-change"><i class="fas fa-star"></i>change Background</li>
          <li><i class="fas fa-star"></i>Search Cards</li>
          <li><i class="fas fa-star"></i>Stickers</li>
          <li><i class="fas fa-star"></i>More</li>
        </ul>
      <hr>
        <i class="list-icon fas fa-list"></i>
        <h3 class="activity-header">Activity</h3>
        <ul class="activity-logs">
        </ul>
        `
  },
  bgChanger() {
    let html = ''
    thumbnails.forEach(thumbnail => {
      html += `<span class="bg-photos-list-items" style="background-image: url(${thumbnail})"></span>`
    })

    document.querySelector('.side-menu').innerHTML =
      `
      <div class="menu-wrapper">
        <div class="menu-header-bg-change">
          <button class="btn-previous fas fa-chevron-left"></button>
          <h3 class="menu-header">Photos by <a href="http://www.unsplash.com" target="_blank">Unsplash</a></h3>
          <button class="btn-menu-close fas fa-times"></button>
        </div>
      </div>
    <div class="bg-photos-list">
      ${html}
    </div>
    `
  }
}

const API_KEY = 'nLiOUFEzySn2iky1ZHM9NiDoC99dDysByJVxIZ8r6YE'
const getPhotos = async () => {
  const res = await axios(`https://api.unsplash.com/photos/random/?count=30&query=mountains&w=2048&client_id=${API_KEY}`)
  thumbnails = await res.data.map(photo => photo.urls.thumb)
}
getPhotos();

export const initSideMenu = () => {
  template.sideMenu()
}