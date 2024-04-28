const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const controlLinks = document.querySelectorAll(".controls a");

let i = 0,
  j = 1,
  intervalId;

controlLinks.forEach((control) => {
  control.addEventListener("click", () => {
    clearInterval(intervalId);
    carousel.style.rotate = `-${
      (i - j + Number(control.dataset.index)) * 90
    }deg`;

    document.querySelector(".slide.active").classList.remove("active");
    const activeSlide = document.querySelector(
      `.slide:nth-child(${control.dataset.index})`
    );
    activeSlide.classList.add("active");

    document.querySelector("a.active").classList.remove("active");
    control.classList.add("active");
  });
});