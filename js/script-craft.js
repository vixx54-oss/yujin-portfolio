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

  // =============================== 네비바와 위로가기 버튼 스크롤 동작
  const nav = document.querySelector(".nav");
  const persimmonLoader = document.querySelector(".persimmon-loader");
  let lastScrollY = window.scrollY;

  // 초기에 nav와 감 로더 숨기기
  nav.style.transform = "translateY(-100%)";
  persimmonLoader.classList.remove("show");

  window.addEventListener("scroll", function () {
    const currentScrollY = window.scrollY;

    // 스크롤이 100px 미만이면 둘 다 숨기기
    if (currentScrollY < 100) {
      nav.style.transform = "translateY(-100%)";
      persimmonLoader.classList.remove("show");
      lastScrollY = currentScrollY;
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

  // =====================================*** craft 그룹 스크롤 애니메이션 ***
  const craftGroups = document.querySelectorAll(".craft-page .group");

  // 스크롤 이벤트 함수
  function handleScroll() {
    craftGroups.forEach((group) => {
      const rect = group.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 요소가 뷰포트에 들어왔을 때
      if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
        group.classList.remove("hide");
        group.classList.add("show");
      }
      // 요소가 뷰포트를 벗어났을 때
      else {
        group.classList.remove("show");
        group.classList.add("hide");
      }
    });
  }

  // 스크롤 이벤트 리스너 등록
  window.addEventListener("scroll", handleScroll);

  // 페이지 로드 시 한 번 실행
  handleScroll();
});
