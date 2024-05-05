importScripts("vendor/workbox-7.0.0/workbox-sw.js");

//==============================================================================
// Resources for precaching
//==============================================================================

let precachingResources = [{"revision":"21f3d156d935f9032a5834cbd717def4","url":"manifest.json"},{"revision":"614a7a678fa3769dd7d0ed4761583d70","url":"vendor/i18next-23.10.1/i18next.js"},{"revision":"c81801e9bcce1f91493feb2b54456373","url":"vendor/i18next-23.10.1/i18next.min.js"},{"revision":"d88c901c70bb4194b19a2c015cc96a99","url":"vendor/i18next-23.10.1/sample.html"},{"revision":"092d10e89c56008fba49f6efe9bace99","url":"vendor/icomoon-v1.0/fonts/icomoon.ttf"},{"revision":"0ea1e06fb8ad4035554cfe26ef75a9b5","url":"vendor/icomoon-v1.0/fonts/icomoon.woff"},{"revision":"70e2d9c60e4c5e12806abd4c9d034029","url":"vendor/icomoon-v1.0/style.css"},{"revision":"9aae729b6fbb52b0694b909e82760395","url":"vendor/leaflet-1.9.4/leaflet-src.esm.js"},{"revision":"4bcf77e6684509d5bd1734612c6f6c61","url":"vendor/leaflet-1.9.4/leaflet-src.js"},{"revision":"644ca28ab5b0dbf9619451d331424306","url":"vendor/leaflet-1.9.4/leaflet.css"},{"revision":"9d31fa206366e2d166b29c2eb19358c5","url":"vendor/leaflet-1.9.4/leaflet.js"},{"revision":"e6109be62f05d9a72eb0abc026f56e75","url":"vendor/leaflet-locatecontrol-0.79.0/L.Control.Locate.min.css"},{"revision":"62bb1d8d8c6536f49e0766b37c6cbf66","url":"vendor/leaflet-locatecontrol-0.79.0/L.Control.Locate.min.js"},{"revision":"c720e90524653d7423db5e29cf45cf8a","url":"vendor/leaflet-mapcentercoord-0.7/L.Control.MapCenterCoord.css"},{"revision":"afe94375422bb9a9e7dbffcc3f254adc","url":"vendor/leaflet-mapcentercoord-0.7/L.Control.MapCenterCoord.js"},{"revision":"51223a3f6642fe6440c975688ca0749b","url":"vendor/leaflet-responsive-popup-1.0.0/leaflet.responsive.popup.css"},{"revision":"7e0bfab47322af2ab1a2400f782757fb","url":"vendor/leaflet-responsive-popup-1.0.0/leaflet.responsive.popup.js"},{"revision":"90d41770c95e895668975a534a8f57d0","url":"vendor/leaflet-responsive-popup-1.0.0/leaflet.responsive.popup.rtl.css"},{"revision":"089ff5a53b91a93aaa8067833a17c344","url":"vendor/leaflet-utm-1.0.0/L.LatLng.UTM.js"},{"revision":"971e2b863ccdb5d43003cdc5f4e0d923","url":"vendor/localForage-1.10.0/localforage.min.js"},{"revision":"f653633ecc58b2c728f625bde655af08","url":"vendor/loglevel-1.9.1/loglevel.js"},{"revision":"fd1d4880c56e03b3f60776fa1048eaf1","url":"vendor/pdfjs-4.1.392/build/pdf.mjs"},{"revision":"d6788ef178cd21c038d726fc1655fd5e","url":"vendor/pdfjs-4.1.392/build/pdf.worker.mjs"},{"revision":"3fbb84836546f1918df561d986394877","url":"vendor/pdfjs-4.1.392/web/locale/de/viewer.ftl"},{"revision":"0f9b01f9f9f38b35ed7216b05e596cf5","url":"vendor/pdfjs-4.1.392/web/locale/en-GB/viewer.ftl"},{"revision":"1ee7cd3d2c3ecf5e0a5fb357b6985137","url":"vendor/pdfjs-4.1.392/web/locale/locale.json"},{"revision":"e827e67ece96aa371d0b10550645b18e","url":"vendor/pdfjs-4.1.392/web/viewer.css"},{"revision":"2e0f590bd600d997b0b7c20b911dc59c","url":"vendor/pdfjs-4.1.392/web/viewer.html"},{"revision":"5848986094b575bc0ebe4e5e6cbd8782","url":"vendor/pdfjs-4.1.392/web/viewer.mjs"},{"revision":"95304830d8f4b0061f3d4c38249a57ce","url":"vendor/pdfjs-viewer-element-2.6.3/pdfjs-viewer-element.js"},{"revision":"18eee7e7c6da6dc28f8e8c6899d5e063","url":"vendor/pmtiles-2.11.0/index.js"},{"revision":"56fa3813680e47cfdbee8574cfe252b1","url":"vendor/pwainstall-1.6.10/pwa-install.js"},{"revision":"9683c317b858d4ec9fd712cb142698cf","url":"vendor/sweetalert2-11.10.2/sweetalert2.all.min.js"},{"revision":"ad103091b77395ad02d061e01e9dda79","url":"vendor/workbox-7.0.0/workbox-core.dev.js"},{"revision":"994473cfcdc8b193deba39d69c9f0679","url":"vendor/workbox-7.0.0/workbox-core.prod.js"},{"revision":"58392a1c6e1cc73c4a56fc66280c76bf","url":"vendor/workbox-7.0.0/workbox-precaching.dev.js"},{"revision":"2b8cabf7ded7e258e972bb8cc9cf90dc","url":"vendor/workbox-7.0.0/workbox-precaching.prod.js"},{"revision":"26b12834f6196f639e1c065e378df6d6","url":"vendor/workbox-7.0.0/workbox-routing.dev.js"},{"revision":"b907c3d53e7ec5e995a8a81de4c21c9b","url":"vendor/workbox-7.0.0/workbox-routing.prod.js"},{"revision":"2fbfa64f3b4e94b3f3c32c081d4975f4","url":"vendor/workbox-7.0.0/workbox-strategies.dev.js"},{"revision":"a1b45f187a34aabf82a57c1116e99883","url":"vendor/workbox-7.0.0/workbox-strategies.prod.js"},{"revision":"7f18882caf646c8a7c8cd9dbab0bf74a","url":"vendor/workbox-7.0.0/workbox-sw.js"},{"revision":"ba8d8df7801bf02d7a096980745ce23e","url":"vendor/workbox-7.0.0/workbox-window.dev.mjs"},{"revision":"0c782eab9d2e797cbcc39e15c77646c2","url":"vendor/workbox-7.0.0/workbox-window.prod.mjs"},{"revision":"a9336a8cff6bcd5b37fbe4e8dd36d731","url":"js/app.js"},{"revision":"65402fd00152fd8441d891801eb348c8","url":"js/maps.js"},{"revision":"7383b719dbf5fc9393de522febf80848","url":"css/app.css"},{"revision":"e370f7e3e07d14d278d8d0dde4eb5aa2","url":"favicon/safari-pinned-tab.svg"},{"revision":"b79c69880b8c3adf577fa7c16d49a412","url":"img/map-center-icon1.svg"},{"revision":"c722d5471cf7a2e56785ffdb07a89ff5","url":"img/map-center-icon2.svg"},{"revision":"ba56f35195c828cf950db02c1f5a96d5","url":"vendor/icomoon-v1.0/fonts/icomoon.svg"},{"revision":"d895130c50b39b277c9086a8bcaac95c","url":"data/overlays/Infopunkte.geojson"},{"revision":"8adbdee1aa2a7be7b910c9ede7f29043","url":"data/overlays/PDFs.geojson"},{"revision":"62fca319e31fb870d009bc8f2b42275b","url":"data/overlays/Touristenroute.geojson"},{"revision":"236e5d46b5bfb2017e9638fa26df0f53","url":"data/overlays/Videos.geojson"},{"revision":"8a342c013d49e35dce4fe1e25e83c104","url":"data/overlays/Weiler.geojson"},{"revision":"7a65c0dbee70b0f555c7e7382f93064e","url":"data/maps/Friedrichssegen_TK25_Uebersicht.jgw"},{"revision":"9a791e7c1d348e1ce71fedef9894f044","url":"data/maps/Friedrichssegen_TK25_Uebersicht.jpg"},{"revision":"a0bdd1bd6ec5189e6c8e348354654375","url":"data/maps/Friedrichssegen_Uraufnahme.jgw"},{"revision":"95cef810a739b2f365c1e8b0ae1a6de2","url":"data/maps/Friedrichssegen_Uraufnahme.jpg"},{"revision":"35aecfc32cfb59804858b3b26f34c1c6","url":"data/maps/preuss1902.png"},{"revision":"a7844355c74ebd7b07b5c37105dc0747","url":"data/maps/tranchot.png"},{"revision":"b13c70fdf971680bbf20d5d8bf31f550","url":"data/maps/Weiler_UTM32.jgw"},{"revision":"1572bfd3a7ab7315059445ce44cae641","url":"data/maps/Weiler_UTM32.jpg"},{"revision":"4faa379bcbfc01ef5f327f235f9bcc5d","url":"data/content/image/ahler_Gut_mit_Huettengebaeuden.jpg"},{"revision":"a769ae8e8f19ce082efc401ee63b1ac7","url":"data/content/image/arbeiter_Kasino.jpg"},{"revision":"5127ab690552d36ca42f2ac19cf880ad","url":"data/content/image/bahnhof_die_Bahnlinie.jpg"},{"revision":"4e2a065870cd83d25b5f44e8ccec9feb","url":"data/content/image/bahnhof_Friedrichssegen.jpg"},{"revision":"72a04f013d74b33c6571b584da4460f0","url":"data/content/image/bahnhof_Grube_Friedrichssegen.jpg"},{"revision":"9ec3c8be6865fd0b371916a3b6b14b77","url":"data/content/image/bahnhofsgelaende.jpg"},{"revision":"ae4db4c691340b9853d3aa0cd85bb505","url":"data/content/image/consum_und_Baeckerei.jpg"},{"revision":"569f76deaa27bdfcc34ac0ebcc06cb46","url":"data/content/image/elektromagnetische_Blendaufbereitung.jpg"},{"revision":"991e10bb3006c8dbe5f3724c58945f14","url":"data/content/image/erzhalde.jpg"},{"revision":"34285bd9682e3b2be36f030beb0c5216","url":"data/content/image/friedhof1.jpg"},{"revision":"6848a6ba7536b7bce8dd37c6e24d3b8f","url":"data/content/image/friedhof2.jpg"},{"revision":"b0c79aa464181e4e40089c010be07a09","url":"data/content/image/friedhof3.jpg"},{"revision":"8e3e6a6869069b5886cb4f6a3db4b3f6","url":"data/content/image/friedhof4.jpg"},{"revision":"610524daede5e42773a4228667c715e0","url":"data/content/image/friedhof5.jpg"},{"revision":"6a49de2e52cef37d2e032c046e53d68c","url":"data/content/image/gasfabrik1.jpg"},{"revision":"0eefdbee146a3a50262b2563678f3447","url":"data/content/image/gasfabrik2.jpg"},{"revision":"0fb27172fdd9c1dfd2c3819109479317","url":"data/content/image/grubenbahn1.jpg"},{"revision":"e31cb834629c043d6e3b13ce6f4d13db","url":"data/content/image/grubenbahn2.jpg"},{"revision":"1ed2503e778599b055d6e8e13a7b19a3","url":"data/content/image/grubenbahnbruecke_zur_neuen_Halde1.jpg"},{"revision":"f5ae188f2a720229f46296a1de9831bb","url":"data/content/image/grubenbahnbruecke_zur_neuen_Halde2.jpg"},{"revision":"3fa8ef868360314d9ef8d5f22c9dcaa0","url":"data/content/image/hauptaufbereitung.jpg"},{"revision":"73aecc64a6851293d61d058b363fd158","url":"data/content/image/heinrich_Stollen.jpg"},{"revision":"692310dd82c3308e3447a2e4321708b2","url":"data/content/image/koelsche_Loecher1.jpg"},{"revision":"f90bbf50353ad873b58309bc5dd4580c","url":"data/content/image/koelsche_Loecher2.jpg"},{"revision":"b1bfa8089653f3729bc9e86b95423e24","url":"data/content/image/koelsche_Loecher3.jpg"},{"revision":"a450c5d16b75cb4b55141479d8791aca","url":"data/content/image/koelsche_Loecher4.jpg"},{"revision":"ba0ad59f4108ab214deb1819a60d4bcf","url":"data/content/image/koelsche_Loecher5.jpg"},{"revision":"c3b656ca2f6b60cb29d39e0b8f85202b","url":"data/content/image/kraftwerk1.jpg"},{"revision":"04965e167b9d1d1d51fa6851c88a1c10","url":"data/content/image/kraftwerk2.jpg"},{"revision":"d37311c4d881a9ac9f3a60413b9889a1","url":"data/content/image/kraftwerk3.jpg"},{"revision":"8dcdd6022b54426051e637b4121a165c","url":"data/content/image/lahnschifffahrt.jpg"},{"revision":"d61ccb63f16e441665b2814881976eac","url":"data/content/image/ort_Friedrichssegen1.jpg"},{"revision":"c63952c1c18509aae6e42f8958886803","url":"data/content/image/ort_Friedrichssegen2.jpg"},{"revision":"315bf7eaa40fd5ea0cea8850047ed8c5","url":"data/content/image/ort_Friedrichssegen3.jpg"},{"revision":"20cdc8892c02c8b5586d70a6252c9f42","url":"data/content/image/ort_Friedrichssegen4.jpg"},{"revision":"41255d19e06eb79debc2e070d380a389","url":"data/content/image/ort_Friedrichssegen5.jpg"},{"revision":"dfa23c7393439914426fc0a41661e4d3","url":"data/content/image/schule_am_Tagschacht1.jpg"},{"revision":"b76ba692e0848927f3ffd39844c699eb","url":"data/content/image/schule_am_Tagschacht2.jpg"},{"revision":"5f5efdfe38a0c235493e36ab2bc469ae","url":"data/content/image/simultankirche1.jpg"},{"revision":"ca03c5fe3a8e50e421657ac96cab8c44","url":"data/content/image/simultankirche2.jpg"},{"revision":"0d29823e8a02e2099e9259b12166a0ec","url":"data/content/image/simultankirche3.jpg"},{"revision":"b32c748d977b727f045e3005d5926a6b","url":"data/content/image/simultankirche4.jpg"},{"revision":"dc8b65f2b22dd9fa29d1ba32bc12231b","url":"data/content/image/simultankirche5.jpg"},{"revision":"6f61ea836f0729b3a2f388a94dc6dfb9","url":"data/content/image/simultankirche6.jpg"},{"revision":"12c1ff3e202d4a8b3addf671f4efc5fe","url":"data/content/image/tagschacht1.jpg"},{"revision":"4efa8b0d87c94e85b49a50bba7c9275c","url":"data/content/image/tagschacht2.jpg"},{"revision":"080f9db90e6e25b9092763892ce33964","url":"data/content/image/tagschacht3.jpg"},{"revision":"998c44a54b5212e8419934917ae61599","url":"data/content/image/tagschacht4.jpg"},{"revision":"9efe1ae71958013eba7f78370e08aa93","url":"data/content/image/tagschacht5.jpg"},{"revision":"da80cd83570b09fa1ac3482a7e819719","url":"data/content/image/tagschacht6.jpg"},{"revision":"5d4de773af16ec4b74c9c63345fde35a","url":"data/content/image/tagschacht7.jpg"},{"revision":"bbdb506db897eded97cde3c95260bd23","url":"data/content/image/wohngebaeude_Ahl.jpg"},{"revision":"ea0b17bfb0de2db5babca1d877aac0fc","url":"data/content/image/wohngebaeude_am_Tagschacht1.jpg"},{"revision":"cc833be35cee2e74b7fd6bd1b2370617","url":"data/content/image/wohngebaeude_am_Tagschacht2.jpg"},{"revision":"e3f8bac2bc9f4034a71b9974cb5c2272","url":"data/content/image/wohngebaeude_am_Tagschacht3.jpg"},{"revision":"b68f2cceef513247229fa33357354b23","url":"data/content/image/wohngebaeude_am_Tagschacht4.jpg"},{"revision":"bdd3356169cd8c6591d239154fce6d1c","url":"data/content/image/wohngebaeude_am_Tagschacht5.jpg"},{"revision":"8272f19a32b879860b3f10643bd8a1f2","url":"data/content/image/wohngebaeude_am_Tagschacht6.jpg"},{"revision":"275dbc38f2ed33d5193c1172a9429066","url":"data/content/image/wohngebaeude_am_Tagschacht7.jpg"},{"revision":"71476205a16fb88500a0936d930404c9","url":"data/content/image/wohngebaeude_Erzbachstrasse.jpg"},{"revision":"94e9e268a9c2546a7252fce529dc67ba","url":"data/content/image/wohngebaeude_Neue_Welt1.jpg"},{"revision":"4a714eb0986234272215c8a602fcb6ec","url":"data/content/image/wohngebaeude_Neue_Welt2.jpg"},{"revision":"096e6af062d05b0fdc2b4af75716a5c3","url":"data/content/image/wohngebaeude_Neue_Welt3.jpg"},{"revision":"a3b7984194f5b492f672b29faf41e62f","url":"data/content/image/wohngebaeude_Neue_Welt4.jpg"},{"revision":"eb3aacf857697002cf387a8f11145253","url":"data/content/image/wohnung_des_Direktors.jpg"},{"revision":"e63a8c33b678d6f69bf77688354ce7b2","url":"data/content/image/zentralbuero_Standesamt.jpg"},{"revision":"3cd7eb5944c7fd0248ff4702363644a4","url":"data/content/pdf/FS_Chronik.pdf"},{"revision":"58ec58e59bb0f516e6323cbe0a6c7f28","url":"data/content/pdf/FS_Erze.pdf"},{"revision":"962e2182a7cc506d520dd52f3c6fbfc2","url":"data/content/pdf/FS_Glueck_auf.pdf"},{"revision":"89731deef7feb504facf600fd4649f48","url":"data/content/pdf/FS_Mineralien.pdf"},{"revision":"3f918015f57c78220596ffa466067c13","url":"data/content/pdf/FS_Tagschacht.pdf"},{"revision":"74a647492fd290472ac5307ecefb6f18","url":"data/content/video/Hubertusviadukt_compressed_cutted.webm"}];
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
