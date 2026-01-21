document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(
    DrawSVGPlugin,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
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
    "a, button, .plus, .swiper-slide, .persimmon-loader",
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
    "<",
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
    ".nav a[href^='#'], .nav a[href='#hero']",
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
      "+=0.5",
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
    start: "top -3%",
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
        return -(totalWidth - viewportWidth + padding - 1700);
      },
      duration: 3,
    },
  );

  // 지연시간 추가
  horizonTL.to({}, { duration: 3 });

  //스크롤 연동: 독립형
  ScrollTrigger.create({
    trigger: "#craft .living",
    start: "top -3%",
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
    start: "top -3%",
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
    start: "top -3%",
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
    allowTouchMove: true, // 터치/드래그 허용하되 클릭은 가능하도록

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

    // 클릭 이벤트를 허용
    preventClicks: false,
    preventClicksPropagation: false,
    simulateTouch: true,
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
        "#banner .swiper-slide:not(.swiper-slide-duplicate)",
      ).length;
      topSwiper.slideToLoop(totalSlides - 1, 500); // 맨 마지막 슬라이드로 이동 (0.5초 애니메이션)
    });
  }

  // =====================================*** 배너 모달창 기능 ***

  // 모달 열기 함수
  window.openBannerModal = function (img) {
    console.log("openBannerModal function called with:", img);

    const modal = document.getElementById("bannerModal");
    const modalImg = document.getElementById("modalImg");

    console.log("Modal elements found:", {
      modal: !!modal,
      modalImg: !!modalImg,
    });

    if (modal && modalImg) {
      console.log("Opening modal with image:", img);

      // 이미지 로드 에러 처리
      modalImg.onerror = function () {
        console.warn("Modal image failed to load:", img);
        // 이미지 로드 실패 시 기본 배너 이미지로 대체
        const fallbackImg = img.replace("banner-detail-", "banner-");
        this.src = fallbackImg;
        console.log("Using fallback image:", fallbackImg);
      };

      modalImg.onload = function () {
        console.log("Modal image loaded successfully:", img);
      };

      modalImg.src = img;
      modalImg.alt = "배너 상세 이미지";

      // 배너 스와이퍼 일시정지
      if (topSwiper && topSwiper.autoplay) {
        topSwiper.autoplay.stop();
        console.log("Banner swiper autoplay stopped");
      }

      // 스크롤 완전 차단
      modal.classList.add("active");
      document.body.classList.add("modal-open");
      document.documentElement.classList.add("modal-open");
      disableScroll();

      console.log("Modal opened and scroll disabled");
    } else {
      console.error("Modal elements not found:", { modal, modalImg });
    }
  };

  // 모달 닫기 함수
  window.closeBannerModal = function () {
    const modal = document.getElementById("bannerModal");
    if (modal) {
      // 배너 스와이퍼 재시작
      if (topSwiper && topSwiper.autoplay) {
        topSwiper.autoplay.start();
        console.log("Banner swiper autoplay restarted");
      }

      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
      enableScroll();

      console.log("Modal closed");
    }
  };

  // 스크롤 이벤트 차단 함수들
  function preventScroll(e) {
    // 모달 내부에서는 스크롤 허용
    const bannerModal = document.getElementById("bannerModal");
    const uiuxModal = document.getElementById("uiuxModal");

    if (
      bannerModal &&
      bannerModal.classList.contains("active") &&
      e.target.closest(".banner-modal .modal-content")
    ) {
      return; // 배너 모달 내부에서는 기본 동작 허용
    }

    if (
      uiuxModal &&
      uiuxModal.classList.contains("active") &&
      e.target.closest(".uiux-modal .modal-content")
    ) {
      return; // UI/UX 모달 내부에서는 기본 동작 허용
    }

    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  function disableScroll() {
    // 마우스 휠 차단
    window.addEventListener("wheel", preventScroll, { passive: false });
    // 터치 이동 차단
    window.addEventListener("touchmove", preventScroll, { passive: false });
    // 키보드 스크롤 차단
    window.addEventListener("keydown", function (e) {
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    });
  }

  function enableScroll() {
    // 이벤트 리스너 제거
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
  }

  // 모달 이벤트 리스너 설정
  function initBannerModal() {
    const modal = document.getElementById("bannerModal");

    if (!modal) {
      console.error("Banner modal not found!");
      return;
    }

    // ESC 키로 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        window.closeBannerModal();
      }
    });

    console.log("Banner modal initialized successfully!");
  }

  // 모달 초기화
  initBannerModal();

  // 테스트 함수 - 콘솔에서 호출 가능
  window.testModal = function () {
    console.log("Testing modal...");
    const modal = document.getElementById("bannerModal");
    if (modal) {
      modal.classList.add("active");
      console.log("Modal should be visible now");
    } else {
      console.error("Modal not found!");
    }
  };

  // =====================================*** UI/UX 모달창 기능 ***

  // UI/UX 모달 열기 함수
  window.openUiuxModal = function (img) {
    console.log("openUiuxModal function called with:", img);

    const modal = document.getElementById("uiuxModal");
    const modalImg = document.getElementById("uiuxModalImg");

    console.log("UI/UX Modal elements found:", {
      modal: !!modal,
      modalImg: !!modalImg,
    });

    if (modal && modalImg) {
      console.log("Opening UI/UX modal with image:", img);

      // 이미지 로드 에러 처리
      modalImg.onerror = function () {
        console.warn("UI/UX Modal image failed to load:", img);
      };

      modalImg.onload = function () {
        console.log("UI/UX Modal image loaded successfully:", img);
      };

      modalImg.src = img;
      modalImg.alt = "UI/UX 모달 이미지";

      // 스크롤 완전 차단
      modal.classList.add("active");
      document.body.classList.add("modal-open");
      document.documentElement.classList.add("modal-open");
      disableScroll();

      console.log("UI/UX Modal opened and scroll disabled");
    } else {
      console.error("UI/UX Modal elements not found:", { modal, modalImg });
    }
  };

  // UI/UX 모달 닫기 함수
  window.closeUiuxModal = function () {
    const modal = document.getElementById("uiuxModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
      enableScroll();

      console.log("UI/UX Modal closed");
    }
  };

  // UI/UX 모달 이벤트 리스너 설정
  function initUiuxModal() {
    const modal = document.getElementById("uiuxModal");

    if (!modal) {
      console.error("UI/UX modal not found!");
      return;
    }

    // ESC 키로 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        window.closeUiuxModal();
      }
    });

    console.log("UI/UX modal initialized successfully!");
  }

  // UI/UX 모달 초기화
  initUiuxModal();

  // 페이지 로드 완료 후 모달 기능 확인
  console.log("Banner modal functions loaded successfully!");
  console.log("Available functions:", {
    openBannerModal: typeof window.openBannerModal,
    closeBannerModal: typeof window.closeBannerModal,
    openUiuxModal: typeof window.openUiuxModal,
    closeUiuxModal: typeof window.closeUiuxModal,
  });

  // =====================================*** 특정 섹션에서만 떠다니는 텍스트 표시 ***
  function initFloatingText() {
    const globalFloatingText = document.querySelector(".global-floating-text");
    if (!globalFloatingText) return;

    const targetSections = ["uiux", "craft", "character"];

    function showFloatingText() {
      try {
        globalFloatingText.style.display = "block";
        globalFloatingText.style.opacity = "1";
      } catch (error) {
        console.warn("Error showing floating text:", error);
      }
    }

    function hideFloatingText() {
      try {
        globalFloatingText.style.opacity = "0";
        setTimeout(() => {
          if (globalFloatingText && globalFloatingText.style.opacity === "0") {
            globalFloatingText.style.display = "none";
          }
        }, 300);
      } catch (error) {
        console.warn("Error hiding floating text:", error);
      }
    }

    function checkFloatingTextVisibility() {
      try {
        let shouldShowText = false;

        // 스크롤 트리거 영역들의 설정 (실제 코드의 start 값과 동일하게)
        const scrollTriggerAreas = [
          {
            triggerSelector: ".uiux-wrap",
            startOffset: -0.05, // "top -5%" = -5%
          },
          {
            triggerSelector: "#craft .living",
            startOffset: -0.05, // "top -5" = 약 -5px (거의 0%와 같음)
          },
          {
            triggerSelector: "#character .project.ai",
            startOffset: -0.03, // "top -3%" = -3%
          },
          {
            triggerSelector: "#character .project.mafra",
            startOffset: -0.03, // "top -3%" = -3%
          },
        ];

        const windowHeight = window.innerHeight;
        const currentScrollY = window.pageYOffset;

        // 각 스크롤 트리거 영역 확인
        scrollTriggerAreas.forEach((area) => {
          const element = document.querySelector(area.triggerSelector);
          if (element) {
            const elementRect = element.getBoundingClientRect();
            const elementTop = elementRect.top + currentScrollY;

            // 스크롤 트리거 시작 지점 계산
            const triggerStartY = elementTop + windowHeight * area.startOffset;

            // 떠다니는 텍스트 표시 영역의 끝 지점을 상대적 거리의 절반으로 설정
            // 각 ScrollTrigger의 상대적 거리를 450px로 계산 (duration * 900 / 3)
            const floatingTextEndY = triggerStartY + 100;

            // 현재 스크롤 위치가 트리거 시작점과 축소된 끝점 사이에 있으면 텍스트 표시
            if (
              currentScrollY >= triggerStartY &&
              currentScrollY <= floatingTextEndY
            ) {
              shouldShowText = true;
            }
          }
        });

        // 제외할 섹션도 체크 (텍스타일)
        const textileSection = document.getElementById("textile");
        if (textileSection) {
          const rect = textileSection.getBoundingClientRect();
          // 텍스타일 섹션이 뷰포트에 보이면 텍스트 숨김
          if (rect.top < windowHeight && rect.bottom > 0) {
            shouldShowText = false;
          }
        }

        // 텍스트 표시/숨김
        if (shouldShowText) {
          showFloatingText();
        } else {
          hideFloatingText();
        }
      } catch (error) {
        console.warn("Error checking floating text visibility:", error);
      }
    }

    function handleScroll() {
      checkFloatingTextVisibility();
    }

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 리사이즈 이벤트도 추가 (뷰포트 크기 변경 시)
    window.addEventListener("resize", handleScroll, { passive: true });

    // 페이지 로드 시 초기 확인
    setTimeout(() => {
      checkFloatingTextVisibility();
    }, 100);
  }

  // DOM이 로드된 후 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFloatingText);
  } else {
    initFloatingText();
  }

  // =====================================*** 자유로운 스크롤 ***
  // 섹션 스크롤 기능을 비활성화하고 자유롭게 스크롤 가능하게 함

  // 기존 섹션별 스크롤 대신 자연스러운 스크롤 허용
});

// modal-content에 마우스 휠 강제 적용
document.querySelector(".modal-content").addEventListener("wheel", (e) => {
  e.stopPropagation(); // 부모로 이벤트 전달 막기
});
