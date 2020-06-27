import { attachPhotoUrlsAndLazyLoad, getPhotos, photoUrls } from './event_bindings.js'
import { getLIelems } from './board_side_menu.js'

let options = {
  root: document.querySelector('#scroll-area'),
  rootMargin: '0px',
  threshold: 0.1
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

const inifiniteObserver = new IntersectionObserver(async (entry, observer) => {
  const newLIelems = document.createElement('div')
  newLIelems.innerHTML = getLIelems()
  document.querySelector('.bg-photos-list').appendChild(newLIelems)
  document.querySelector('.infinite-trigger').classList.remove('infinite-trigger')
  observer.disconnect();
  await getPhotos()
  const lazyImgs = [...document.querySelectorAll('.lazy-img')].filter(node => !node.src)
  photoUrls.forEach((photoUrl, photoIndex) => {
    lazyImgs.forEach((img, imgIndex) => {
      if (photoIndex !== imgIndex) return;
      img.dataset.src = photoUrl.thumb
      img.dataset.source = photoUrl.custom
    })
  })
  // attachPhotoUrlsAndLazyLoad()
  lazyImgs.forEach(target => lazyLoader(target));
  // 
  document.querySelector('.infinite-trigger').onload = () => {
    inifiniteObserver.observe(document.querySelector('.infinite-trigger'))
  }
}, options)



export { lazyLoader, inifiniteObserver }