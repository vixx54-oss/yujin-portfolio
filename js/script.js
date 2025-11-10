document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(
    DrawSVGPlugin,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin
  );

  // =============================== 감 로더 클릭 시 맨 위로 스크롤
  window.scrollToTop = function () {
    gsap.to(window, {
      duration: 0.3,
      scrollTo: { y: 0, autoKill: false },
      ease: "power2.out",
    });
  };

  // =============================== 커스텀 커서
  const cursor = document.querySelector(".custom-cursor");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // 호버 가능한 요소들
  const hoverElements = document.querySelectorAll(
    "a, button, .plus, .swiper-slide, .persimmon-loader"
  );

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });

  //=============================== 패스 가져오기
  const paths = document.querySelectorAll(".template");

  const tl = gsap.timeline({
    onStart: () => {
      // 애니메이션 다 끝난 후 shake 효과 주기
      paths.forEach((path) => path.classList.add("shake-bottom"));
    },
  });
  // 초기 상태 0%
  gsap.set(paths, { drawSVG: "100%" });

  // 순서대로 그리기 100%
  tl.from(paths, {
    drawSVG: "0%",
    delay: 0.6,
    duration: 0.6 /* 감 그려지는 시간 */,
    stagger: 0.3,
    ease: "power1.inOut",
    repeat: "-1",
  });
  tl.from(
    paths,
    {
      delay: 0.3,
      duration: 2.5,
      ease: "bounce.out",
      repeat: "-1",
    },
    "<"
  );

  // =========================== 네비바 js
  let smoother; // 전역 변수로 선언
  try {
    if (
      typeof ScrollSmoother !== "undefined" &&
      document.querySelector("#smooth-wrapper") &&
      document.querySelector("#smooth-content")
    ) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 0.8, // 1.3 → 0.8로 줄여서 덜 미끄럽게
        effects: true,
      });
    }
  } catch (e) {
    console.warn("ScrollSmoother init failed:", e);
  }
  const nav = document.querySelector(".nav");
  const persimmonLoader = document.querySelector(".persimmon-loader");
  const aboutSection = document.getElementById("about");
  let lastScrollY = window.scrollY;

  // 초기에 nav와 감 로더 숨기기
  nav.style.transform = "translateY(-100%)";

  window.addEventListener("scroll", function () {
    const aboutTop = aboutSection.offsetTop;
    const currentScrollY = window.scrollY;

    // about 섹션 이전에는 nav와 감 로더 숨기기
    if (currentScrollY < aboutTop - 100) {
      nav.style.transform = "translateY(-100%)";
      persimmonLoader.classList.remove("show");
      return;
    }

    // 스크롤 방향 확인
    if (currentScrollY < lastScrollY) {
      // 위로 스크롤: nav와 감 로더 보이기
      nav.style.transform = "translateY(0)";
      nav.style.opacity = "1";
      persimmonLoader.classList.add("show");
    } else {
      // 아래로 스크롤: nav와 감 로더 숨기기
      nav.style.transform = "translateY(-100%)";
      nav.style.opacity = "0";
      persimmonLoader.classList.remove("show");
    }

    lastScrollY = currentScrollY;
  });

  // 네비게이션 링크 클릭 이벤트
  const navLinks = document.querySelectorAll(
    ".nav a[href^='#'], .nav a[href='#hero']"
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const targetY = targetSection.offsetTop;

        if (smoother) {
          // ScrollSmoother가 있으면 사용
          smoother.scrollTo(targetY, false);
        } else {
          // ScrollSmoother가 없으면 GSAP ScrollToPlugin 사용
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: targetY },
            ease: "power2.out",
          });
        }
      }
    });
  });

  // =====================================*** UI/UX 카드 애니메이션 ***
  // 여러 요소의 동작을 만들기 위해 타임라인 생성
  const uxCardTL = gsap.timeline({
    defaults: { duration: 1, ease: "power2.inOut" },
  });

  const uxCardTitle = [
    {
      title: "Seoul Jangsoo Makgeolli Redesign",
      desc: "서울 장수막걸리 리디자인",
    },
    { title: "Jeju Beer Redesign", desc: "제주맥주 리디자인" },
    { title: "Habit Forming App", desc: "습관 형성 어플" },
  ];
  const uxCardInfo = document.querySelector(".head-info");
  const uxCardInfoTitle = uxCardInfo.querySelector("h4");
  const uxCardInfoDesc = uxCardInfo.querySelector("h5");

  // 카드의 애니메이션이 똑같으니까, 한 번에!
  const uxCards = gsap.utils.toArray("#uiux ul li");
  uxCards.forEach((card, index) => {
    // set()은 즉시 실행되므로, 이 시점이 첫 번째 from() 애니메이션의 시작 지점이 됩니다.
    uxCardTL.set(
      [uxCardInfoTitle, uxCardInfoDesc],
      {
        // GSAP의 기능 기반 값(function-based value)을 사용하여 h4와 h5를 구분하여 텍스트 설정
        innerText: (i, target) => {
          return target === uxCardInfoTitle
            ? uxCardTitle[index].title
            : uxCardTitle[index].desc;
        },
      },
      "+=0.5"
    );
    uxCardTL.from(card, { rotateX: "-180deg" });
    uxCardTL.from(card, { y: 900 }, "-=0.7");

    // 이전 카드 페이드 아웃 (첫 번째 카드 제외)
    if (index > 0) {
      uxCardTL.to(uxCards[index - 1], { autoAlpha: 0, duration: 0.5 }, "-=0.3");
    }
  });
  // 3초의 지연시간 추가
  uxCardTL.to({}, { duration: 0.5 });
  // console.log(uxCardTL.duration());

  // 스크롤과 연동, 독립형으로 구현
  ScrollTrigger.create({
    trigger: ".uiux-wrap",
    start: "top 0%",
    // +=: start 지점을 기준으로 상대적인 거리를 추가
    end: `+=${uxCardTL.duration() * 900}`,
    // markers: true,
    pin: true, // 영역 고정
    scrub: 1,

    // 타임라인과 연동
    animation: uxCardTL,
  });

  // =====================================*** craft 가로 스크롤 ***
  const horizonScroll = document.querySelector("#craft .craft-wrap ul");

  //타임라인 설정
  const horizonTL = gsap.timeline({
    defaults: { ease: "none" },
  });

  // 지연시간 추가
  horizonTL.to({}, { duration: 1 });

  // 첫 번째 사진부터 뷰포트 기준으로 보이도록 설정
  horizonTL.fromTo(
    horizonScroll,
    {
      x: () => {
        // 첫 번째 이미지가 뷰포트 중앙에 오도록 계산
        const viewportWidth = window.innerWidth;
        const firstImageWidth = -800; // CSS에서 설정한 이미지 너비
        const padding = parseInt(getComputedStyle(horizonScroll).paddingLeft);
        return -(padding - (viewportWidth - firstImageWidth) / 2);
      },
    },
    {
      x: () => {
        // 마지막까지 스크롤되도록 계산 (여백 줄임)
        const viewportWidth = window.innerWidth;
        const totalWidth = horizonScroll.offsetWidth;
        const padding = parseInt(getComputedStyle(horizonScroll).paddingLeft);
        // 여백을 줄이기 위해 200px 정도 덜 스크롤
        return -(totalWidth - viewportWidth + padding - 1000);
      },
      duration: 3,
    }
  );

  // 지연시간 추가
  horizonTL.to({}, { duration: 3 });

  //스크롤 연동: 독립형
  ScrollTrigger.create({
    trigger: "#craft .living",
    start: "top 0",
    end: () => `+=${horizonTL.duration() * 900}`,
    // markers: true,
    pin: true,
    scrub: 1,
    animation: horizonTL,
  });

  // =====================================*** character 세로 스크롤 2개 ***
  // AI 카드 타임라인
  const aicardTL = gsap.timeline({
    defaults: { duration: 1, ease: "power2.inOut" },
  });

  const aicards = gsap.utils.toArray("#character .ai .ai-about > li");
  aicards.forEach((aicard, index) => {
    aicardTL.from(aicard, { autoAlpha: 0, rotateX: "-180deg" });
    aicardTL.from(aicard, { y: 900 }, "-=0.7");
  });

  aicardTL.to({}, { duration: 0.5 });

  // AI 스크롤 트리거
  ScrollTrigger.create({
    trigger: "#character .project.ai",
    start: "top top",
    end: `+=${aicardTL.duration() * 900}`,
    // markers: true,
    pin: true,
    pinSpacing: true, // ✅ 추가! - pin 영역만큼 공간 확보
    scrub: 1,
    animation: aicardTL,
  });

  // MAFRA 카드 타임라인
  const macardTL = gsap.timeline({
    defaults: { duration: 1, ease: "power2.inOut" },
  });

  const macards = gsap.utils.toArray("#character .mafra .mafra-about > li");
  macards.forEach((macard, index) => {
    macardTL.from(macard, { autoAlpha: 0, rotateX: "-180deg" });
    macardTL.from(macard, { y: 900 }, "-=0.7");
  });

  macardTL.to({}, { duration: 0.5 });

  // MAFRA 스크롤 트리거
  ScrollTrigger.create({
    trigger: "#character .project.mafra",
    start: "top top",
    end: `+=${macardTL.duration() * 900}`,
    // markers: true,
    pin: true,
    pinSpacing: true, // ✅ 추가! - pin 영역만큼 공간 확보
    scrub: 1,
    animation: macardTL,
  });

  // =====================================*** banner 마퀴효과 ***
  const topSwiper = new Swiper("#banner .banner-list", {
    loop: true,
    autoplay: {
      delay: 0,
      pauseOnMouseEnter: false, // 마우스 호버 시에도 계속 재생
      disableOnInteraction: false,
      waitForTransition: true, // 트랜지션이 끝날 때까지 대기
    },
    speed: 5000,
    effect: "slide", //slide,fade,cube,flip,coverflow

    //캐러셀 - 반응형
    slidesPerView: "auto", //자동으로 슬라이드 갯수 계산
    spaceBetween: 50, //슬라이드 사이 간격

    // 마우스 휠 스크롤 방지
    mousewheel: false,
    allowTouchMove: false, // 터치/드래그 방지

    // 슬라이드가 잘리지 않도록
    watchOverflow: true,
    centeredSlides: false,

    // 반응형 breakpoints
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 25,
      },
      1440: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    },

    // Pagination
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: ".slider-btns .btn.next",
      prevEl: ".slider-btns .btn.prev",
    },
  });

  // 맨 처음/맨 끝 버튼 기능
  const firstBtn = document.querySelector(".banner-btn.first");
  const lastBtn = document.querySelector(".banner-btn.last");

  if (firstBtn) {
    firstBtn.addEventListener("click", () => {
      topSwiper.slideToLoop(0, 500); // 맨 처음 슬라이드로 이동 (0.5초 애니메이션)
    });
  }

  if (lastBtn) {
    lastBtn.addEventListener("click", () => {
      // 실제 슬라이드 개수 가져오기 (li 개수)
      const totalSlides = document.querySelectorAll(
        "#banner .swiper-slide:not(.swiper-slide-duplicate)"
      ).length;
      topSwiper.slideToLoop(totalSlides - 1, 500); // 맨 마지막 슬라이드로 이동 (0.5초 애니메이션)
    });
  }

  // =====================================*** 자유로운 스크롤 ***
  // 섹션 스크롤 기능을 비활성화하고 자유롭게 스크롤 가능하게 함

  // 기존 섹션별 스크롤 대신 자연스러운 스크롤 허용
});
