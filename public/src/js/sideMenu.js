const template = {
  sideMenu() {
    document.querySelector('.side-menu').innerHTML =
      `    
      <div class="menu-header">
        <h3>Menu</h3>
        <button class="btn-menu-close fas fa-times"></button>
      </div>
      <hr>
        <ul class="menu-list">
          <li class="board-info"><i class="fas fa-star"></i>About this board</li>
          <li><i class="fas fa-star"></i>change Background</li>
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
  }
}

export const initSideMenu = () => {
  template.sideMenu()
}