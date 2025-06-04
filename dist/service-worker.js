if (!self.define) {
  let e,
    n = {};
  const i = (i, s) => (
    (i = new URL(i + ".js", s).href),
    n[i] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = n), document.head.appendChild(e);
        } else (e = i), importScripts(i), n();
      }).then(() => {
        let e = n[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, a) => {
    const r =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (n[r]) return;
    let c = {};
    const o = (e) => i(e, r),
      l = { module: { uri: r }, exports: c, require: o };
    n[r] = Promise.all(s.map((e) => l[e] || o(e))).then((e) => (a(...e), c));
  };
}
define(["./workbox-e8acb423"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "2b3e1faf89f94a483539.png", revision: null },
        { url: "416d91365b44e4b4f477.png", revision: null },
        { url: "680f69f3c2e6b90c1812.png", revision: null },
        { url: "8f2c4d11474275fbc161.png", revision: null },
        { url: "a0c6cc1401c107b501ef.png", revision: null },
        { url: "app.bundle.js", revision: "4b8485dbfd5941bccea72356294d77c2" },
        {
          url: "app.bundle.js.LICENSE.txt",
          revision: "02b30a124d6d1bf13bfdc096f2b62c6e",
        },
        { url: "app.css", revision: "88e7aaed81caf31badfbc736f29e3bfe" },
        { url: "favicon.png", revision: "21a0a0a9b1fdb78eae4c9d97f7e90078" },
        {
          url: "images/inilogo.png",
          revision: "529d922d85043160a6dc12acdb751250",
        },
        {
          url: "images/logo.png",
          revision: "ac73f380ba0147f4fa5951dfaba2a665",
        },
        {
          url: "images/pmpm.jpg",
          revision: "ec543d3bd784f14471c11eba8f5a8050",
        },
        {
          url: "images/screenshot-dekstop.png",
          revision: "1f7376ba30e30631718aa1d429c4a590",
        },
        {
          url: "images/screenshot-mobile.png",
          revision: "bcddbe3a3a1ad3d446a168e940721ad7",
        },
        { url: "index.html", revision: "71be245986a624e43e5efeb32627363d" },
        { url: "manifest.json", revision: "a547a74364de3db632bd8597578fc82d" },
      ],
      {},
    ),
    e.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      new e.CacheFirst({
        cacheName: "images",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|js)$/,
      new e.StaleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/(api\.example\.com|another\.api\.com)/,
      new e.NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 30 })],
      }),
      "GET",
    );
});
