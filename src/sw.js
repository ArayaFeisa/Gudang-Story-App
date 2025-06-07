import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim } from "workbox-core";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  /\.(?:css|js)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  }),
);

registerRoute(
  /^https:\/\/(api\.example\.com|another\.api\.com)/,
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 10,
    plugins: [new ExpirationPlugin({ maxEntries: 30 })],
  }),
);

// Push Notification Handler
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Push Notification", body: event.data.text() };
    }
  }

  const title = data.title || "Push Notification";
  const options = {
    body: data.body || "You have a new notification!",
    icon: "/images/inilogo.png",
    badge: "/images/inilogo.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "TEST_PUSH") return;

  const title = data.title || "Push Notification";
  const options = {
    body: data.body || "You have a new notification!",
    icon: "/images/inilogo.png",
    badge: "/images/inilogo.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.skipWaiting();
clientsClaim();
