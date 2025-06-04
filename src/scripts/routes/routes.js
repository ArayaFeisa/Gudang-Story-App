import LandingPage from "../pages/landing/index.js";
import LoginPage from "../pages/login/index.js";
import SignupPage from "../pages/signup/index.js";
import HomePage from "../pages/home/index.js";
import AddStoryPage from "../pages/add-story/index.js";
import AboutPage from "../pages/about/index.js";
import SavedStory from "../pages/saved-story/index.js";
import NotFoundPresenter from "../pages/not-found/not-found-presenter.js";

const routes = {
  "/": LandingPage,
  "/login": LoginPage,
  "/signup": SignupPage,
  "/home": HomePage,
  "/about": AboutPage,
  "/add-story": AddStoryPage,
  "/saved": SavedStory,
  "*": NotFoundPresenter,
};

export default routes;
