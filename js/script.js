document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(
    DrawSVGPlugin,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin
  );

  // =============================== 커스텀 커서
  const cursor = document.querySelector(".custom-cursor");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // 호버 가능한 요소들
  const hoverElements = document.querySelectorAll(
    "a, button, .plus, .swiper-slide"
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
    duration: 1.8,
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
  try {
    if (
      typeof ScrollSmoother !== "undefined" &&
      document.querySelector("#smooth-wrapper") &&
      document.querySelector("#smooth-content")
    ) {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.3,
        effects: true,
      });
    }
  } catch (e) {
    console.warn("ScrollSmoother init failed:", e);
  }
  const nav = document.querySelector(".nav");
  const aboutSection = document.getElementById("about");
  let lastScrollY = window.scrollY;

  // 초기에 nav 숨기기
  nav.style.transform = "translateY(-100%)";

  window.addEventListener("scroll", function () {
    const aboutTop = aboutSection.offsetTop;
    const currentScrollY = window.scrollY;

    // about 섹션 이전에는 nav 숨기기
    if (currentScrollY < aboutTop - 100) {
      nav.style.transform = "translateY(-100%)";
      return;
    }

    // 스크롤 방향 확인
    if (currentScrollY < lastScrollY) {
      // 위로 스크롤: nav 보이기
      nav.style.transform = "translateY(0)";
      nav.style.opacity = "1";
    } else {
      // 아래로 스크롤: nav 숨기기
      nav.style.transform = "translateY(-100%)";
      nav.style.opacity = "0";
    }

    lastScrollY = currentScrollY;
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
    uxCardTL.from(card, { y: 200 }, "-=0.7");

    // 이전 카드 페이드 아웃 (첫 번째 카드 제외)
    if (index > 0) {
      uxCardTL.to(uxCards[index - 1], { autoAlpha: 0, duration: 0.3 }, "-=0.3");
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
    end: `+=${uxCardTL.duration() * 400}`,
    markers: true,
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
    end: () => `+=${horizonTL.duration() * 400}`,
    markers: true,
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
    aicardTL.from(aicard, { y: 200 }, "-=0.7");
  });

  aicardTL.to({}, { duration: 0.5 });

  // AI 스크롤 트리거
  ScrollTrigger.create({
    trigger: "#character .project.ai",
    start: "top top",
    end: `+=${aicardTL.duration() * 500}`,
    markers: true,
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
    macardTL.from(macard, { y: 200 }, "-=0.7");
  });

  macardTL.to({}, { duration: 0.5 });

  // MAFRA 스크롤 트리거
  ScrollTrigger.create({
    trigger: "#character .project.mafra",
    start: "top top",
    end: `+=${macardTL.duration() * 400}`,
    markers: true,
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
      pauseOnMouseEnter: true, // 마우스 호버 시 자동재생 멈춤
      disableOnInteraction: false,
      waitForTransition: true, // 트랜지션이 끝날 때까지 대기
    },
    speed: 3000,
    effect: "slide", //slide,fade,cube,flip,coverflow

    //캐러셀
    slidesPerView: 5, //보여질 슬라이드 갯수
    spaceBetween: 0, //슬라이드 사이 간격

    // 마우스 휠 스크롤 방지
    mousewheel: false,
    allowTouchMove: false, // 터치/드래그 방지

    // Navigation arrows
    navigation: {
      nextEl: ".slider-btns .btn.next",
      prevEl: ".slider-btns .btn.prev",
    },
  });

  // =====================================*** 섹션 끝에서만 전환하는 스크롤 ***
  const sections = document.querySelectorAll("section");
  let isScrolling = false;

  window.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;

    // 현재 어느 섹션에 있는지 찾기
    let currentSection = null;
    let currentIndex = -1;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom > 100) {
        currentSection = section;
        currentIndex = index;
      }
    });

    if (!currentSection) return;

    const sectionRect = currentSection.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionBottom = sectionRect.bottom;

    // 아래로 스크롤
    if (e.deltaY > 0) {
      // 섹션의 끝에 도달했을 때만 다음 섹션으로
      if (sectionBottom <= windowHeight + 10) {
        const nextSection = sections[currentIndex + 1];
        if (nextSection) {
          e.preventDefault();
          isScrolling = true;

          // 다음 섹션으로 부드럽게 이동
          window.scrollTo({
            top: nextSection.offsetTop,
            behavior: "smooth",
          });

          setTimeout(() => {
            isScrolling = false;
          }, 800);
        }
      }
    }
    // 위로 스크롤
    else {
      // 섹션의 시작에 도달했을 때만 이전 섹션으로
      if (sectionTop >= -10) {
        const prevSection = sections[currentIndex - 1];
        if (prevSection) {
          e.preventDefault();
          isScrolling = true;

          // 이전 섹션으로 부드럽게 이동
          window.scrollTo({
            top: prevSection.offsetTop,
            behavior: "smooth",
          });

          setTimeout(() => {
            isScrolling = false;
          }, 800);
        }
      }
    }
  });
});
