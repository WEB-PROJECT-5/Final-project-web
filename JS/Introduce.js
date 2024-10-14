// GIỚI THIỆU GAME HAY
var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true, /* Cho phép click vào pagination */
    },
    autoplay: {
        delay: 2000, /* Tự động chuyển sau 3 giây */
        disableOnInteraction: false, /* Không dừng khi người dùng tương tác */
      },
      loop: true, /* Vòng lặp vô hạn */
  });