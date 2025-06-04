import AboutView from "./about-view";
import AboutPresenter from "./about-presenter";

const AboutPage = {
  async render() {
    return AboutView.render();
  },

  async afterRender() {
    AboutPresenter.bindEvent();
  },
};

export default AboutPage;
