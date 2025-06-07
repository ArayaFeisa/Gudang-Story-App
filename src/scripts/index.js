import "../styles/styles.css";
import App from "./pages/app";
import AuthModel from "./data/auth-model.js";
import Api from "./data/api.js";
import LoadingPopupPresenter from "./utils/loading-popup-presenter.js";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  const logoutButton = document.querySelector("#logout-button");
  const logoutItem = document.querySelector("#logout-item");
  const skipLink = document.querySelector(".skip-to-content");
  const mainContent = document.querySelector("#main-content");
  const pushSubBtn = document.getElementById("push-subscription-btn");

  const toggleLogoutButton = () => {
    const token = AuthModel.getToken();
    logoutItem.style.display = token ? "block" : "none";
  };

  const handleSkipToContent = () => {
    if (!skipLink || !mainContent) return;

    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
      mainContent.focus();
      skipLink.blur();
      mainContent.classList.add("highlight-focus");
      setTimeout(() => {
        mainContent.classList.remove("highlight-focus");
      }, 2000);
    });
  };

  const renderWithTransition = async () => {
    if (document.startViewTransition && mainContent) {
      await document.startViewTransition(async () => {
        await app.renderPage();
        toggleLogoutButton();
      });
    } else {
      await app.renderPage();
      toggleLogoutButton();
    }
  };

  logoutButton?.addEventListener("click", () => {
    AuthModel.removeToken();
    toggleLogoutButton();
    window.location.hash = "/login";
  });

  handleSkipToContent();
  await renderWithTransition();

  window.addEventListener("hashchange", async () => {
    await renderWithTransition();
  });

  // Push Notification
  if ("serviceWorker" in navigator && "PushManager" in window) {
    window.addEventListener("load", async () => {
      try {
        const registration =
          await navigator.serviceWorker.register("/service-worker.js");
        console.log("Service Worker registered:", registration);

        const updatePushButton = async () => {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            pushSubBtn.textContent = "Unsubscribe Notifikasi";
          } else {
            pushSubBtn.textContent = "Subscribe Notifikasi";
          }
        };

        updatePushButton();

        pushSubBtn?.addEventListener("click", async () => {
          const subscription = await registration.pushManager.getSubscription();

          if (subscription) {
            LoadingPopupPresenter.showLoading(
              "Memproses berhenti langganan...",
            );
            try {
              await subscription.unsubscribe();
              console.log("Unsubscribed dari push server");

              const token = AuthModel.getToken();
              if (token) {
                await Api.unsubscribeNotification(subscription, token);
                console.log("Notifikasi unsubscribed di server");
              }

              pushSubBtn.textContent = "Subscribe Notifikasi";
              LoadingPopupPresenter.updateMessage("Unsub... See you!");
            } catch (error) {
              console.error(error);
              LoadingPopupPresenter.updateMessage("Ups! Gagal unsubscribe.");
            } finally {
              setTimeout(() => LoadingPopupPresenter.hide(), 2000);
            }
          } else {
            LoadingPopupPresenter.showLoading(
              "Memproses langganan notifikasi...",
            );

            try {
              const permission = await Notification.requestPermission();
              if (permission !== "granted") {
                alert("Izin push notification ditolak.");
                LoadingPopupPresenter.hide();
                return;
              }

              const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",
                ),
              });
              console.log("Push subscription baru:", newSubscription);

              const token = AuthModel.getToken();
              if (token) {
                await Api.subscribeNotification(newSubscription, token);
                console.log("Subscription dikirim ke server");
              }

              pushSubBtn.textContent = "Unsubscribe Notifikasi";
              LoadingPopupPresenter.updateMessage(
                "Subscribe berhasil! Yeay 🎉",
              );
            } catch (error) {
              console.error(error);
              LoadingPopupPresenter.updateMessage("Ups! Gagal subscribe.");
            } finally {
              setTimeout(() => LoadingPopupPresenter.hide(), 2000);
            }
          }
        });
      } catch (err) {
        console.error("Error handling push subscription:", err);
      }
    });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
});
