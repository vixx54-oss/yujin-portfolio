document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(
    DrawSVGPlugin,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin
  );

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
