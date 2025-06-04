import "../../../styles/home-page.css";
import "leaflet/dist/leaflet.css";
import StoryIDB from "../../utils/indexedDB.js";
import LoadingPopupPresenter from "../../utils/loading-popup-presenter.js";

const HomeView = {
  render() {
    return `
    <main id="main-content" class="container" tabindex="-1">
      <h2>Story Terbaru</h2>
      <div id="story-list" class="story-list"></div>
      <div id="map" style="height: 400px; margin-top: 2rem;"></div>
    </main>

    <a href="#/add-story" class="add-story-button" aria-label="Tambah Story">
      <span>＋</span>
    </a>
  `;
  },

  showUnauthorizedMessage() {
    const container = document.getElementById("main-content");
    container.innerHTML = `
      <section style="text-align: center; padding: 40px 20px;" tabindex="-1">
        <h2 style="margin-bottom: 24px; font-size: 1.5rem;">
          Untuk mengakses beranda, silakan login terlebih dahulu!
        </h2>
        <a href="#/">
          <button style="font-size: 1rem; padding: 10px 20px;">
            Kembali ke Halaman Utama
          </button>
        </a>
      </section>
    `;
  },

  renderStories(listStory) {
    const container = document.getElementById("story-list");
    container.innerHTML = "";

    listStory.forEach((story) => {
      const storyItem = document.createElement("div");
      storyItem.className = "story-item";

      storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" class="story-img" />
        <div class="story-content">
          <h4>${story.name}</h4>
          <p>${story.description}</p>
          <small>${new Date(story.createdAt).toLocaleString()}</small>
        </div>
      `;

      const saveButton = document.createElement("button");
      saveButton.textContent = "Simpan Story";
      saveButton.className = "save-button";

      saveButton.addEventListener("click", async () => {
        try {
          LoadingPopupPresenter.showLoading("Menyimpan story...");
          await new Promise((resolve) => setTimeout(resolve, 500));
          const existingStory = await StoryIDB.getStory(story.id);

          if (existingStory) {
            LoadingPopupPresenter.updateMessage(
              "Story sudah pernah disimpan sebelumnya.",
            );
          } else {
            await StoryIDB.putStory(story);
            LoadingPopupPresenter.updateMessage("Story berhasil disimpan!");
          }

          setTimeout(() => LoadingPopupPresenter.hide(), 2000);
        } catch (error) {
          console.error("Gagal memproses penyimpanan story:", error);
          LoadingPopupPresenter.updateMessage(
            "Terjadi kesalahan saat menyimpan story.",
          );
          setTimeout(() => LoadingPopupPresenter.hide(), 2000);
        }
      });

      storyItem.querySelector(".story-content").appendChild(saveButton);
      container.appendChild(storyItem);
    });
  },

  renderMap(listStory) {
    const mapContainer = document.getElementById("map");

    const L = require("leaflet");
    const markerIcon = require("leaflet/dist/images/marker-icon.png");
    const markerRetina = require("leaflet/dist/images/marker-icon-2x.png");
    const markerShadow = require("leaflet/dist/images/marker-shadow.png");

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerRetina,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    const map = L.map(mapContainer).setView([0, 0], 2);

    const streetsLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap contributors" },
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" },
    );

    const terrainLayer = L.tileLayer(
      "https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg",
      { attribution: "© Stamen Design" },
    );

    L.control
      .layers({
        Streets: streetsLayer,
        Satellite: satelliteLayer,
        Terrain: terrainLayer,
      })
      .addTo(map);

    streetsLayer.addTo(map);

    const coordinates = listStory
      .filter((s) => s.lat && s.lon)
      .map((s) => [s.lat, s.lon]);

    if (coordinates.length > 0) {
      const avgLat =
        coordinates.reduce((sum, c) => sum + c[0], 0) / coordinates.length;
      const avgLon =
        coordinates.reduce((sum, c) => sum + c[1], 0) / coordinates.length;
      map.setView([avgLat, avgLon], 10);
    }

    listStory.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(
          `<strong>${story.name}</strong><br>${story.description}`,
        );
      }
    });
  },

  showErrorMessage(message = "Gagal memuat data stories.") {
    const container = document.getElementById("story-list");
    container.innerHTML = `<p>${message}</p>`;
  },
};

export default HomeView;
