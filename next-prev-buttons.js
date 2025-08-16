document.querySelectorAll(".wrapper").forEach((container) => {
  // loop through all slider .wrappers
  console.clear();

  const colors = [
    "#24478f",
    "#cc0000",
    "#663300",
    "#006600",
    "#cc5200",
    "#6b00b3"
  ];
  const sliders = gsap.utils.toArray(".slider", container); // scope to current .wrapper
  const slidesArray = sliders.map((slider) =>
    gsap.utils.toArray(".slide", slider)
  );
  const next = container.querySelector("#next-month"); // scope to current .wrapper
  const prev = container.querySelector("#prev-month"); // scope to current .wrapper
  let currentIndex = 0;
  let isTweening = false;

  slidesArray.forEach((slides) => {
    slides.forEach((slide, i) => {
      gsap.set(slide, {
        backgroundColor: colors[i],
        xPercent: i > 0 && 100
      });
    });
  });

  const gotoSlide = (value) => {
    if (isTweening) return;
    isTweening = true;
    const first = slidesArray[0];
    const currentSlides = [];
    const nextSlides = [];
    slidesArray.forEach((slides) => currentSlides.push(slides[currentIndex]));
    if (first[currentIndex + value]) {
      currentIndex += value;
    } else {
      currentIndex = value > 0 ? 0 : first.length - 1;
    }
    slidesArray.forEach((slides) => nextSlides.push(slides[currentIndex]));
    if (value > 0) {
      gsap.set(nextSlides, { xPercent: 100 });
      gsap.to(currentSlides, {
        xPercent: -100,
        onComplete: () => (isTweening = false)
      });
    } else {
      gsap.set(nextSlides, { xPercent: -100 });
      gsap.to(currentSlides, {
        xPercent: 100,
        onComplete: () => (isTweening = false)
      });
    }
    gsap.to(nextSlides, { xPercent: 0 });
  };

  next.addEventListener("click", () => gotoSlide(1));
  prev.addEventListener("click", () => 
gotoSlide(-1));
});
