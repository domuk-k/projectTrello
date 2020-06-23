let options = {
  root: document.querySelector('#scroll-area'),
  // rootMargin: '0px', // default 0px
  threshold: 1.0 // default 1.0
}
// lazy loading
const lazyLoader = (target) => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target; // 이미지 엘리멘트를 가져옵니다.
        lazyImage.src = lazyImage.dataset.src
        lazyImage.classList.add("fade");
        observer.disconnect();
      }
    });
  }, options);
  imageObserver.observe(target);
};

// infinite scroll
const infinitation = () => {
  const imageObserver = new IntersectionObserver((entries, observer) => {

  })
}

export { lazyLoader, infinitation }