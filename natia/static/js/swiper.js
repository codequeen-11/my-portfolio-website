const swiper = new Swiper('.testimonials', {
    // slidesPerView: 5,
    loop: false,
    speed: 2000,
    slidesPerView: 1,
    spaceBetween: 25,
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: ".slider-next",
      prevEl: ".slider-prev",
    },
    breakpoints: {
      1200: {
        spaceBetween: 60,
      }
    }
});