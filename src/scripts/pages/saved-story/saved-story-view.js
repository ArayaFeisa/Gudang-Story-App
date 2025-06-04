import "../../../styles/saved-story-page.css";
import LoadingPopupPresenter from "../../utils/loading-popup-presenter.js";

const SavedStoryView = {
  render() {
    return `
      <main id="main-content" class="container" tabindex="-1">
        <h2>Saved Stories (Offline)</h2>
        <div id="saved-story-list" class="story-list"></div>
      </main>
    `;
  },

  renderStories(stories) {
    const container = document.getElementById("saved-story-list");

    if (!stories.length) {
      container.innerHTML = `<p>Tidak ada story yang disimpan offline.</p>`;
      return;
    }

    container.innerHTML = stories
      .map(
        (story) => `
        <div class="story-item" data-id="${story.id}">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-img" />
          <div class="story-content">
            <h4>${story.name}</h4>
            <p>${story.description}</p>
            <small>${new Date(story.createdAt).toLocaleString()}</small>
            <button class="delete-button" aria-label="Hapus Story">Hapus</button>
          </div>
        </div>
      `,
      )
      .join("");

    container.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const storyElement = event.target.closest(".story-item");
        const id = storyElement.dataset.id;

        try {
          LoadingPopupPresenter.showLoading("Menghapus story...");
          await this.onDeleteClick(id);
          LoadingPopupPresenter.updateMessage("Story berhasil dihapus!");
        } catch (error) {
          console.error("Gagal menghapus story:", error);
          LoadingPopupPresenter.updateMessage("Gagal menghapus story.");
        } finally {
          setTimeout(() => LoadingPopupPresenter.hide(), 2000);
        }
      });
    });
  },

  showErrorMessage(message = "Gagal memuat data.") {
    const container = document.getElementById("saved-story-list");
    container.innerHTML = `<p>${message}</p>`;
  },

  setDeleteHandler(callback) {
    this.onDeleteClick = callback;
  },
};

export default SavedStoryView;
