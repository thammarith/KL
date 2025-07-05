/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-c6a197bf'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "apple-touch-icon.png",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "assets/index-BDXyM1e4.css",
    "revision": null
  }, {
    "url": "assets/index-DeSxwOwU.js",
    "revision": null
  }, {
    "url": "assets/react-CHdo91hT.svg",
    "revision": null
  }, {
    "url": "favicon.ico",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "icon.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "index.html",
    "revision": "8da7ec83c732afe39ec71d5f0f9e100a"
  }, {
    "url": "offline.html",
    "revision": "a3fcb36a8aad20fb38585c81d55bc65e"
  }, {
    "url": "pwa-192x192.png",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "pwa-icon.svg",
    "revision": "c9a4d5191e5f83198680402b003b00dc"
  }, {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "vite.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "favicon.ico",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "pwa-192x192.png",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "manifest.webmanifest",
    "revision": "85df29422ec0cef2c3043e5870a2fa16"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/KL/offline.html"), {
    denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/]
  }));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), {
      cacheKeyWillBeUsed: async ({
        request
      }) => {
        return `${request.url}?v=1`;
      }
    }]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    })]
  }), 'GET');

}));
