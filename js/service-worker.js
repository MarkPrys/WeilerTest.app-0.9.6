importScripts("vendor/workbox-7.0.0/workbox-sw.js");

//==============================================================================
// Resources for precaching
//==============================================================================

let precachingResources = self.__WB_MANIFEST;
const precachingSize = precachingResources.length;
const swListener = new BroadcastChannel("swListener");

//==============================================================================
// Plugins
//==============================================================================

let precachingCount = 0;

const precacheStatPlugin = {
  cacheWillUpdate: async ({ request, response, event, state }) => {
    // Return `response`, a different `Response` object, or `null`.
    return response;
  },
  cacheDidUpdate: async ({ cacheName, request, oldResponse, newResponse, event, state }) => {
    // No return expected
    // Note: `newResponse.bodyUsed` is `true` when this is called,
    // meaning the body has already been read. If you need access to
    // the body of the fresh response, use a technique like:
    // const freshResponse = await caches.match(request, {cacheName});
  },
  cacheKeyWillBeUsed: async ({ request, mode, params, event, state }) => {
    // `request` is the `Request` object that would otherwise be used as the cache key.
    // `mode` is either 'read' or 'write'.
    // Return either a string, or a `Request` whose `url` property will be used as the cache key.
    // Returning the original `request` will make this a no-op.
    return request;
  },
  cachedResponseWillBeUsed: async ({ cacheName, request, matchOptions, cachedResponse, event, state }) => {
    // Return `cachedResponse`, a different `Response` object, or null.
    return cachedResponse;
  },
  requestWillFetch: async ({ request, event, state }) => {
    // Return `request` or a different `Request` object.
    return request;
  },
  fetchDidFail: async ({ originalRequest, request, error, event, state }) => {
    // No return expected.
    // Note: `originalRequest` is the browser's request, `request` is the
    // request after being passed through plugins with
    // `requestWillFetch` callbacks, and `error` is the exception that caused
    // the underlying `fetch()` to fail.
  },
  fetchDidSucceed: async ({ request, response, event, state }) => {
    // Return `response` to use the network response as-is,
    // or alternatively create and return a new `Response` object.
    return response;
  },
  handlerWillStart: async ({ request, event, state }) => {
    // No return expected.
    // Can set initial handler state here.
  },
  handlerWillRespond: async ({ request, response, event, state }) => {
    // Return `response` or a different `Response` object.
    return response;
  },
  handlerDidRespond: async ({ request, response, event, state }) => {
    // No return expected.
    // Can record final response details here.
  },
  handlerDidComplete: async ({ request, response, error, event, state }) => {
    // No return expected.
    // Can report any data here.
    if (event.type === "install") {
      if (error) {
        swListener.postMessage({ type: "PRECACHE_STATUS", error: error });
      } else {
        precachingCount++;
        let percent = Math.trunc((100 * precachingCount) / precachingSize);
        if (precachingCount >= precachingSize) {
          percent = 100;
        }
        swListener.postMessage({ type: "PRECACHE_STATUS", progress: percent });
      }
    }
  },
  handlerDidError: async ({ request, event, error, state }) => {
    // Return a `Response` to use as a fallback, or `null`.
    return fallbackResponse;
  },
};

//==============================================================================
// Configuration
//==============================================================================

workbox.setConfig({
  debug: true,
  modulePathPrefix: "vendor/workbox-7.0.0/",
});

workbox.precaching.addPlugins([precacheStatPlugin]);
workbox.precaching.precacheAndRoute(precachingResources, {
  ignoreURLParametersMatching: [/.*/],
});

self.addEventListener("install", (event) => {
  swListener.postMessage({ type: "APP_STATUS", message: "new version" });

  // install new service worker immediately
  skipWaiting();
});
