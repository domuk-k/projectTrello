import { attachPhotoUrlsAndLazyLoad } from './event_bindings.js'
import { getLIelems } from './board_side_menu.js'

let options = {
  root: document.querySelector('#scroll-area'),
  rootMargin: '0px',
  threshold: 0.4
}
// lazy loading
const lazyLoader = (target) => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target; // 이미지 엘리멘트를 가져옵니다.
        lazyImage.src = lazyImage.dataset.src
        lazyImage.classList.add("fade");
        observer.disconnect();
      }
    });
  }, options);
  imageObserver.observe(target);
}

const inifiniteObserver = new IntersectionObserver((entry, observer) => {
  const newLIelems = document.createElement('div')
  newLIelems.innerHTML = getLIelems()
  document.querySelector('.bg-photos-list').appendChild(newLIelems)
  observer.disconnect();
  document.querySelector('.infinite-trigger').classList.remove('infinite-trigger')
}, options)




export { lazyLoader, inifiniteObserver }