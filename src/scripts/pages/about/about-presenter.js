const AboutPresenter = {
  bindEvent() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const section = document.querySelector(".container");
    if (section) {
      section.style.opacity = 0;
      section.style.transform = "translateY(30px)";
      setTimeout(() => {
        section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        section.style.opacity = 1;
        section.style.transform = "translateY(0)";
      }, 100);
    }

    const skipLink = document.querySelector(".skip-to-content");
    skipLink?.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("about-container")?.focus();
    });
  },
};

export default AboutPresenter;
