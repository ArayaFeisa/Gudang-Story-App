import "../../../styles/landing-page.css";
import AuthModel from "../../data/auth-model.js";

const LandingView = {
  render() {
    return `
      <main id="main-content" class="landing container" tabindex="-1">
        <div class="landing-text">
          <h1>Selamat Datang di Gudang StoryMap!</h1>
          <button id="start-button" class="start-button" aria-label="Mulai menggunakan aplikasi StoryMap">
            Mulai
          </button>
        </div>
        <img src="/images/inilogo.png" alt="Logo Gudang StoryMap" class="landing-image" />
      </main>
    `;
  },

  bindEvents() {
    document.getElementById("start-button")?.addEventListener("click", () => {
      const token = AuthModel.getToken();
      if (token) {
        window.location.hash = "/home";
      } else {
        window.location.hash = "/login";
      }
    });
  },
};

export default LandingView;
