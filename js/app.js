/************************************************************ -*- JavaScript -*-
 *
 * (c) 2024 movisda GmbH
 *
 * movisda GmbH
 * Rosenstr. 2
 * 10178 Berlin
 * Germany
 *
 * email:   dev@movisda.io
 * web:     https://movisda.io
 *
 * The software and documentation contained herein are proprietary to and
 * comprise valuable trade secrets of movisda GmbH which intends to preserve.
 *
 * This software may not be used, copied, transmitted, stored, modified,
 * distributed or sold without a written license agreement. This software and
 * information or any other copies thereof may not be made available to any
 * other person.
 *
 ******************************************************************************/

//==============================================================================
// Constants
//==============================================================================

log.setDefaultLevel(log.levels.TRACE, false);

const CWD = window.location.pathname.split("/").slice(0, -1).join("/");
const ZOOM_MIN = 11;
const ZOOM_MAX = 20;
const ICON_MIN_SIZE = 8;
const ICON_MAX_SIZE = 64;
const ICON_EXP = 2;
const ICON_URLS = {
  red: "img/pin-red.png",
  green: "img/pin-green.png",
  blue: "img/pin-blue.png",
  yellow: "img/pin-yellow.png",
};

//==============================================================================
// Global Variables
//==============================================================================

var swListener = new BroadcastChannel("swListener");
var iconSet = createIconSet();
/*global localforage*/
/*global log*/
/*global i18next*/
/*global L*/
/*global LAYERS*/
/*global pmtiles*/
/*global Swal*/

//==============================================================================
// Internationalization
//==============================================================================

i18next.init(
  {
    fallbackLng: "en",
    lng: "de", // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
    resources: {
      // evtl. load via http https://github.com/i18next/i18next-http-backend
      en: {
        translation: {
          status: {
            online: "online",
            offline: "offline",
            install: "Install",
          },
          error: {
            onlyRaster: "Only raster tilesets are supported!",
            loading: "There was an error loading the map!",
            saving: "Saving map failed",
          },
          warning: {
            notOnline: "Must be online to download maps!",
            outside: "Your location is outside the boundaries of the map.",
            noGPS: "No access to the current position allowed.",
          },
          info: {
            title: "Friedrichssegen App",
            fossCredits: "Open Source Credits",
            movisdaCredits: "movisda GmbH",
          },
          msg: {
            mapSaved: "The map has been successfully saved to the device!",
            appInstalled: "The application is now available offline!",
            downloadProgress: "Downloading Assets",
          },
        },
      },
      de: {
        translation: {
          status: {
            online: "verbunden",
            offline: "nicht verbunden",
            install: "Installation",
          },
          error: {
            onlyRaster: "Es werden nur Rasterkarten unterstützt!",
            loading: "Es ist ein Fehler beim Laden der Rasterkarte aufgetreten!",
            saving: "Die Karte konnte nicht gepeichert werden!",
          },
          warning: {
            notOnline: "Für das Laden der Karten ist eine Internetverbindung notwendig!",
            outside: "Ihre Position ist außerhalb der Grenzen der Karte.",
            noGPS: "Kein Zugriff auf die aktuelle Position erlaubt.",
          },
          info: {
            title: "Friedrichssegen Anwendung",
            fossCredits: "Verwendete quelloffene Bibliotheken",
            movisdaCredits: "movisda GmbH",
          },
          msg: {
            mapSaved: "Die Karte wurde erfolgreich gespeichert!",
            appInstalled: "Die Anwendung kann jetzt auch ohne Internetverbindung genutzt werden!",
            downloadProgress: "Herunterladen der Daten",
          },
        },
      },
    },
    debug: false,
  },
  function (err) {
    if (err) {
      Swal.fire({
        icon: "error",
        text: "translation error: " + err,
        showCloseButton: true,
        showConfirmButton: false,
      });
    }
  }
);

//==============================================================================
// Utilities
//==============================================================================

// -----------------------------------------------------------------------------
function firstOf(a, b) {
  return a ? a : b;
}

// -----------------------------------------------------------------------------
function createIconSet() {
  const iconSet = {};
  const diffSize = ICON_MAX_SIZE - ICON_MIN_SIZE;
  const diffLevel = ZOOM_MAX - ZOOM_MIN;
  for (let color in ICON_URLS) {
    iconSet[color] = [];
  }
  for (var l = ZOOM_MIN; l <= ZOOM_MAX; l++) {
    const ratio = (l - ZOOM_MIN) / diffLevel;
    const size = Math.round(ICON_MIN_SIZE + Math.pow(ratio, ICON_EXP) * diffSize);
    for (let color in ICON_URLS) {
      iconSet[color][l] = L.icon({
        iconUrl: ICON_URLS[color],
        iconSize: [size, size],
        iconAnchor: [Math.round(size / 2), size],
      });
    }
  }
  return iconSet;
}

// -----------------------------------------------------------------------------
function getIcon(feature, zoomLevel = -1) {
  if (zoomLevel < 0) {
    zoomLevel = map.getZoom();
  }
  if (zoomLevel < ZOOM_MIN) {
    zoomLevel = ZOOM_MIN;
  }
  if (zoomLevel > ZOOM_MAX) {
    zoomLevel = ZOOM_MAX;
  }
  zoomLevel = Math.round(zoomLevel);

  if (feature.properties.PDF) {
    return iconSet["green"][zoomLevel];
  }
  if (feature.properties.Video) {
    return iconSet["red"][zoomLevel];
  }
  if (feature.properties.Bilder) {
    return iconSet["blue"][zoomLevel];
  }
  return L.Icon.Default;
}

// -----------------------------------------------------------------------------
function showErrorDialog(msg, err = null) {
  if (err == null) {
    Swal.fire({
      icon: "error",
      text: i18next.t(msg),
      showCloseButton: true,
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      icon: "error",
      title: i18next.t(msg),
      html: err,
      showCloseButton: true,
      showConfirmButton: false,
    });
  }
}

// -----------------------------------------------------------------------------
function showWarningToast(msg) {
  Swal.fire({
    icon: "warning",
    text: i18next.t(msg),
    toast: true,
    timer: 2500,
    position: "center",
    showCloseButton: true,
    showConfirmButton: false,
  });
}

// -----------------------------------------------------------------------------
function showLoading() {
  Swal.fire({
    title: i18next.t("msg.downloadProgress"),
    text: "0%",
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
  });
}

// -----------------------------------------------------------------------------
function hideLoading() {
  Swal.closePopup();
}

// -----------------------------------------------------------------------------
function updateLoadBar(percent) {
  const status = document.getElementById("swal2-html-container");
  if (!status) {
    log.warn("no loading box available");
    return;
  }
  if (percent >= 0 && percent <= 100) {
    status.innerHTML = `${percent}%`;
  }
  // remove load bar in case of wrong values
  else {
    hideLoading();
  }
}

//==============================================================================
// Controls
//==============================================================================

// -----------------------------------------------------------------------------
// Fit bounds control
L.Control.Fitbounds = L.Control.extend({
  onAdd: function (/*map*/) {
    const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    div.innerHTML = `
      <a class="leaflet-bar-part leaflet-bar-part-single fit-bounds-btn" title="Zoom To Map" onclick="if (map.bounds) {map.fitBounds(map.bounds, {animate: false})};">
        <i class="icon-zoom_out_map"></i>
      </a>
    `;
    L.DomEvent.on(div, "click", function (e) {
      L.DomEvent.stopPropagation(e);
    });
    return div;
  },
});

L.control.fitbounds = (opts) => {
  return new L.Control.Fitbounds(opts);
};

// -----------------------------------------------------------------------------
// Fit bounds control
L.Control.CoordSwitch = L.Control.extend({
  visible: false,
  onAdd: function (/*map*/) {
    const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    div.innerHTML = `
      <a class="leaflet-bar-part leaflet-bar-part-single fit-bounds-btn" title="Show Coordinates" onclick="let c = controls.centercoords; if(c.visible)  { c.remove();c.visible=false;} else { c.addTo(map); c.visible=true;}">
        <i class="icon-coord_switch"></i>
      </a>
    `;
    L.DomEvent.on(div, "click", function (e) {
      L.DomEvent.stopPropagation(e);
    });
    return div;
  },
});

L.control.coordswitch = (opts) => {
  return new L.Control.CoordSwitch(opts);
};

//==============================================================================
// Map Configuration
//==============================================================================

// -----------------------------------------------------------------------------
// local storage
const store = localforage.createInstance({
  name: "maps",
  storeName: "pmtiles",
});

// -----------------------------------------------------------------------------
// map instance
const map = L.map("map", {
  zoomSnap: L.Browser.mobile ? 0 : 1,
  minZoom: ZOOM_MIN,
  maxZoom: ZOOM_MAX,
  attributionControl: false,
  zoomControl: false,
});

// -----------------------------------------------------------------------------
const controls = {
  layers: L.control
    .layers([], [], {
      position: "topright",
      sortLayers: true,
      sortFunction: function (layerA, layerB, nameA, nameB) {
        return layerA.options.age < layerB.options.age
          ? -1
          : layerA.options.age > layerB.options.age
          ? 1
          : nameA < nameB
          ? -1
          : nameA > nameB
          ? 1
          : 0;
      },
    })
    .addTo(map),
  attribution: L.control
    .attribution({
      position: "bottomleft",
    })
    .addTo(map),
  scalebar: L.control
    .scale({
      metric: true,
      imperial: false,
      position: "bottomleft",
    })
    .addTo(map),
  centercoords: L.control.mapCenterCoord({
    position: "bottomleft",
    onMove: true,
    icon: true,
    zIndex: 600,
  }),
  fitbounds: L.control
    .fitbounds({
      position: "bottomright",
    })
    .addTo(map),
  coordswitch: L.control
    .coordswitch({
      position: "bottomright",
    })
    .addTo(map),
  locate: L.control
    .locate({
      icon: "icon-gps_fixed",
      iconLoading: "spinner icon-gps_fixed",
      setView: "untilPan",
      cacheLocation: true,
      position: "topright",
      flyTo: false,
      // initialZoomLevel: 18,
      keepCurrentZoomLevel: true,
      circleStyle: {
        interactive: false,
      },
      markerStyle: {
        interactive: true,
      },
      compassStyle: {
        width: 13,
        depth: 13,
      },
      metric: true,
      strings: {
        title: "My location",
        outsideMapBoundsMsg: i18next.t("msg.location.outside"),
        popup: (options) => {
          const loc = controls.locate._marker.getLatLng();
          return `<div style="text-align: center;">You are within ${Number(options.distance).toLocaleString()} ${
            options.unit
          } of<br><strong>${loc.lat.toFixed(6)}</strong>, <strong>${loc.lng.toFixed(6)}</strong></div>`;
        },
      },
      locateOptions: {
        enableHighAccuracy: true,
        maxZoom: 18,
      },
      onLocationOutsideMapBounds(control) {
        control.stop();
        showWarningToast("warning.outside");
      },
      onLocationError: () => {
        document.querySelector(".leaflet-control-locate").getElementsByTagName("span")[0].className = "icon-gps_off";
        showWarningToast("warning.noGPS");
      },
    })
    .addTo(map),
};

//==============================================================================
// Take care of new window sizes
//==============================================================================

const mapDiv = document.getElementById("map");
const resizeObserver = new ResizeObserver(() => {
  map.closePopup();
  map.invalidateSize();
});
resizeObserver.observe(mapDiv);

//==============================================================================
// Online/Offline | Attributation
//==============================================================================

// -----------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showCredits() {
  Swal.fire({
    customClass: {
      icon: "info-icon",
      title: "info-title",
    },
    iconHtml: "<img src='img/viriditas-logo-87.png'>",
    title: i18next.t("info.fossCredits"),
    html: `
     <br>
     <a href='https://icomoon.io/' target='_blank'>IcoMoon Icons</a><br>
     <a href='https://leafletjs.com/' target='_blank'>Leaflet JS</a><br>
     <a href='https://github.com/domoritz/leaflet-locatecontrol' target='_blank'>Leaflet Locate</a><br>
     <a href='https://localforage.github.io/localForage/' target='_blank'>localForage</a><br>
     <a href='https://docs.protomaps.com/pmtiles/' target='_blank'>Protomaps PMTiles</a><br>
     <a href='https://mozilla.github.io/pdf.js/#' target='_blank'>PDF.js</a><br>
     <a href='https://github.com/yafred/leaflet-responsive-popup' target='_blank'>Responsive Popup</a><br>
     <a href='https://sweetalert2.github.io/' target='_blank'>sweetalert2</a><br>
     <a href='https://github.com/GoogleChrome/workbox/' target='_blank'>Workbox</a><br>
     `,
    showCloseButton: true,
    showConfirmButton: false,
  });
}

// -----------------------------------------------------------------------------
function updateAttribution() {
  fetch("package.json")
    .then((resp) => resp.json())
    .then(function (manifest) {
      controls.attribution.setPrefix(
        `<span id="status-indicator" style="color:${
          navigator.onLine ? "green" : "red"
        }">&#9673;</span>&nbsp;<span id="status-msg">${
          navigator.onLine ? i18next.t("status.online") : i18next.t("status.offline")
        }</span> | 
        <a href='https://viriditas.info' target="_blank">viriditas</a> |
        <a href='https://movisda.io' target="_blank">movisda</a> |
        <a href='https://openstreetmap.org' target="_blank">OSM</a> |
        <a href='javascript: showCredits()'>Info</a> |
        v` + manifest.version
      );
    });
}

// -----------------------------------------------------------------------------
window.addEventListener("offline", () => {
  document.getElementById("status-indicator").style.color = "red";
  document.getElementById("status-msg").innerHTML = "offline";
});

window.addEventListener("online", () => {
  document.getElementById("status-indicator").style.color = "green";
  document.getElementById("status-msg").innerHTML = "online";
});

//==============================================================================
// Loading Maps
//==============================================================================

// -----------------------------------------------------------------------------
function loadPMTiles(url, name, options) {
  store
    .getItem(url)
    .then((value) => {
      addPMTilesLayer(name, value, options);
    })
    .catch(() => {
      let p = new pmtiles.PMTiles(url);
      p.getMetadata()
        .then((metadata) => {
          if (metadata.format == "pbf" || metadata.vector_layers) {
            showErrorDialog("error.onlyRaster");
          } else {
            p.getHeader().then((header) => {
              if (metadata && header) {
                if (navigator.onLine) {
                  fetch(url)
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(response.statusText);
                      }
                      response.blob().then((blob) => {
                        let file = new File([blob], name, { type: blob.type });
                        const value = {
                          name: metadata.name,
                          description: firstOf(metadata.description, ""),
                          attribution: firstOf(metadata.attribution, ""),
                          bounds: [
                            [header.minLat, header.minLon],
                            [header.maxLat, header.maxLon],
                          ],
                          maxZoom: header.maxZoom,
                          minZoom: header.minZoom,
                          timestamp: Date.now(),
                          pmtiles: file,
                        };
                        store
                          .setItem(url, value)
                          .then(function (value) {
                            addPMTilesLayer(name, value, options);
                            //showSuccessToast("msg.mapSaved");
                            log.debug("map downloaded");
                          })
                          .catch((error) => {
                            showWarningToast("error.saving");
                            showErrorDialog("Request failed.", error);
                          });
                      });
                    })
                    .catch((error) => {
                      showErrorDialog("Request failed.", error);
                    });
                } else {
                  showWarningToast("warning.notOnline");
                }
              }
            });
          }
        })
        .catch((err) => {
          showErrorDialog("error.loading", err);
        });
    });
}

// -----------------------------------------------------------------------------
function addPMTilesLayer(name, value, options) {
  name = firstOf(name, value.name);
  let p = new pmtiles.PMTiles(new pmtiles.FileAPISource(value.pmtiles));
  let layer = pmtiles
    .leafletRasterLayer(p, {
      key: name,
      bounds: value.bounds,
      updateWhenIdle: false,
      maxZoom: map.getMaxZoom(),
      maxNativeZoom: Number(value.maxZoom),
      detectRetina: true,
      attribution: value.attribution,
    })
    .addTo(map);
  layer.options.bounds = value.bounds;
  layer.options.age = options.age;
  map.addLayer(layer);
  controls.layers.addBaseLayer(layer, name);
  updateMapBounds(layer);
  map.fitBounds(value.bounds);
}

//------------------------------------------------------------------------------
function loadImageLayerWithBounds(url, name, bounds, options) {
  let layer = new L.imageOverlay(url, bounds, options);
  layer.options.bounds = bounds;
  controls.layers.addBaseLayer(layer, name);
  updateMapBounds(layer);
  map.fitBounds(bounds);
}

//------------------------------------------------------------------------------
function loadImageLayerWithWorld(url, name, world, options) {
  let getMeta = async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  };

  //Fetching Image and TextData
  Promise.all([fetch(world.file).then((r) => r.text()), getMeta(url)]).then(([jgwText, img]) => {
    //Calculate the Bounding Box
    let splitted = jgwText.split("\n");
    let pixelSizeX = Number(splitted[0]);
    let pixelSizeY = Number(splitted[3]);
    let centerCoordX = Number(splitted[4]);
    let centerCoordY = Number(splitted[5]);

    let westBound = centerCoordX - pixelSizeX / 2;
    let northBound = centerCoordY - pixelSizeY / 2;
    let eastBound = westBound + img.naturalWidth * pixelSizeX;
    let southBound = northBound + img.naturalHeight * pixelSizeY;

    let wsUTM = L.utm({ x: westBound, y: southBound, zone: world.zone, band: world.band });
    let neUTM = L.utm({ x: eastBound, y: northBound, zone: world.zone, band: world.band });
    let ws84 = wsUTM.latLng();
    let ne84 = neUTM.latLng();
    let bounds = [
      [ws84.lat, ws84.lng],
      [ne84.lat, ne84.lng],
    ];

    loadImageLayerWithBounds(url, name, bounds, options);
  });
}

//------------------------------------------------------------------------------
function loadGeoJSONLayer(url, name, options) {
  fetch(url)
    .then((resp) => resp.json())
    .then(function (geojson) {
      name = firstOf(geojson.name, name);

      const layer = L.geoJSON(geojson, {
        bubblingMouseEvents: false,
        renderer: L.canvas({
          padding: 0.5,
          tolerance: 10,
        }),
        style: (feature) => {
          return {
            color: Object.hasOwn(feature.properties, "stroke")
              ? feature.properties["stroke"]
              : feature.properties["marker-color"]
              ? feature.properties["marker-color"]
              : feature.geometry.type == "Point"
              ? "#ffffff"
              : "#0000aa",
            opacity: Object.hasOwn(feature.properties, "stroke-opacity") ? feature.properties["stroke-opacity"] : 1.0,
            weight: Object.hasOwn(feature.properties, "stroke-width")
              ? feature.properties["stroke-width"]
              : feature.geometry.type == "Point"
              ? 1.5
              : 3,
            fillColor: Object.hasOwn(feature.properties, "fill")
              ? feature.properties["fill"]
              : feature.properties["marker-color"]
              ? feature.properties["marker-color"]
              : "#0000aa",
            fillOpacity: Object.hasOwn(feature.properties, "fill-opacity")
              ? feature.properties["fill-opacity"]
              : feature.geometry.type != "Point"
              ? 0.2
              : feature.geometry.type == "Point"
              ? 1
              : "",
          };
        },
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, { icon: getIcon(feature) });
        },
        onEachFeature: (feature, featureLayer) => {
          featureLayer.on({
            mouseout: function (e) {
              for (let i in e.target._eventParents) {
                e.target._eventParents[i].resetStyle(e.target);
              }
            },
            //mouseover: highlightFeature,
          });

          let header = feature.properties.Objekt || "Unknown";
          let contentType = "html";
          let content = "";
          if (feature.properties.PDF) {
            let res = CWD + "/" + feature.properties.PDF;
            contentType = "pdf";
            content = `<pdfjs-viewer-element src='${res}' viewer-path="vendor/pdfjs-4.1.392" style="height: 80dvh; zoom: "page-fit" viewer-extra-styles="#toolbarViewerLeft, #toolbarViewerRight, #scaleSelectContainer { display: none; }"></pdfjs-viewer-element>`;
          } else if (feature.properties.Video) {
            contentType = "video";
            let res = CWD + "/" + feature.properties.Video;
            content = `<video controls autoplay loop style="width:100%"><source src="${res}"></source></video>`;
          } else if (feature.properties.Bilder) {
            const slider = Array.isArray(feature.properties.Bilder)
              ? feature.properties.Bilder
              : [feature.properties.Bilder];

            contentType = "images";
            content = slider
              .map((src) => {
                if (src) {
                  let res = CWD + "/" + src.replace("Bilder", "content");
                  return `<a href="${res}"> <img class="images-photo" src='${res}' alt='${res}' style="width:auto; height:400px"/> </a>`;
                }
              })
              .join("");
          }

          if (content) {
            content = `
            <div>
              <h3>${header}</h3>
              <div class="leaflet-popup-content-${contentType}">
                ${content}
              </div>
            </div>`;

            var popup = L.responsivePopup().setContent(content);
            featureLayer.bindPopup(popup, { className: "leaflet-popup-" + contentType, maxWidth: 1024 });
          }
        },
      });

      layer.options.age = options.age;
      layer.options.geojson = true;
      controls.layers.addOverlay(layer, name);
      map.addLayer(layer);
    })
    .catch((error) => {
      showErrorDialog("error.loading", error);
    });
}

// -----------------------------------------------------------------------------
function loadMaps() {
  LAYERS.pmtiles.forEach((item) => {
    loadPMTiles(item.url, item.name, item.options);
  });
  LAYERS.images.forEach((item) => {
    if (item.bounds) {
      loadImageLayerWithBounds(item.url, item.name, item.bounds, item.options);
    } else if (item.world) {
      loadImageLayerWithWorld(item.url, item.name, item.world, item.options);
    } else {
      log.warn("missing transformation for ", item.url);
    }
  });
  LAYERS.geojson.forEach((item) => {
    loadGeoJSONLayer(item.url, item.name, item.options);
  });
}

// -----------------------------------------------------------------------------
function updateMapBounds(layer) {
  if (layer.options.bounds) {
    let bounds = layer.options.bounds;
    let llbounds = L.latLngBounds([bounds[0]], [bounds[1]]);
    map.setMaxBounds(null);
    /*
    map.once("moveend", () => {
      map.setMaxBounds(L.latLngBounds(bounds).pad(0.25));
    });
    */
    // zoom to new base maps when in a completely different location
    if (map.bounds && !map.bounds.overlaps(bounds)) {
      map.fitBounds(bounds);
    }
    map.bounds = llbounds;
    controls.locate._isOutsideMapBounds = function () {
      if (this._event === undefined) {
        return false;
      }
      return !llbounds.contains(this._event.latlng);
    };
  }
}

// -----------------------------------------------------------------------------
map.on("baselayerchange", (e) => {
  updateMapBounds(e.layer);
});

// -----------------------------------------------------------------------------
function addInstallButton() {
  if ("PushManager" in window) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();

      const deferredPrompt = e;

      const installButton = document.getElementById("install-button");
      installButton.textContent = i18next.t("status.install");
      installButton.style.display = "initial";

      installButton.addEventListener("click", () => {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("App installed");
          } else {
            console.log("App installation declined");
          }

          installButton.style.display = "none";
        });
      });
    });
  }
}

//==============================================================================
// Callbacks
//==============================================================================

// -----------------------------------------------------------------------------
function handleStatusEvent(e) {
  if (e.type == "PRECACHE_STATUS") {
    //log.debug(`cache filling progress: ${e.progress}`);
    updateLoadBar(e.progress);
  } else if (e.type == "APP_STATUS") {
    log.debug(`application status: ${e.message}`);
    if (e.message == "new version") {
      showLoading();
    } else {
      hideLoading();
      if (e.message == "started") {
        location.reload(true);
      }
    }
  } else {
    log.warn("unknown event type from swListener received: ", e.type);
  }
}

// -----------------------------------------------------------------------------
swListener.onmessage = function (e) {
  if (e.data && e.data.type) {
    handleStatusEvent(e.data);
  } else {
    log.warn("invalid event from swListener received: ", e);
  }
};

// -----------------------------------------------------------------------------
map.on("zoomend", function () {
  map.eachLayer((overlay) => {
    if (overlay.options.geojson) {
      overlay.eachLayer((featureLayer) => {
        featureLayer.setIcon?.(getIcon(featureLayer.feature));
      });
    }
  });
});

//==============================================================================
// Entry point
//==============================================================================

updateAttribution();
loadMaps();
addInstallButton();
