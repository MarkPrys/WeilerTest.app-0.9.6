const f = (m, e) =>
    new Promise((s) => {
      let r = e.querySelector(m);
      if (r) {
        s(r);
        return;
      }
      new MutationObserver((n, t) => {
        Array.from(e.querySelectorAll(m)).forEach((i) => {
          s(i), t.disconnect();
        });
      }).observe(e, {
        childList: !0,
        subtree: !0,
      });
    }),
  g = {
    trailing: !0,
  };
function v(m, e = 25, s = {}) {
  if (((s = { ...g, ...s }), !Number.isFinite(e))) throw new TypeError("Expected `wait` to be a finite number");
  let r,
    n,
    t = [],
    i,
    a;
  const o = (l, h) => (
    (i = b(m, l, h)),
    i.finally(() => {
      if (((i = null), s.trailing && a && !n)) {
        const u = o(l, a);
        return (a = null), u;
      }
    }),
    i
  );
  return function (...l) {
    return i
      ? (s.trailing && (a = l), i)
      : new Promise((h) => {
          const u = !n && s.leading;
          clearTimeout(n),
            (n = setTimeout(() => {
              n = null;
              const w = s.leading ? r : o(this, l);
              for (const y of t) y(w);
              t = [];
            }, e)),
            u ? ((r = o(this, l)), h(r)) : t.push(h);
        });
  };
}
async function b(m, e, s) {
  return await m.apply(e, s);
}
const c = {
    viewerPath: "/pdfjs",
    viewerEntry: "/web/viewer.html",
    src: "",
    page: "",
    search: "",
    phrase: "",
    zoom: "",
    pagemode: "none",
    locale: "",
    textLayer: "",
    viewerCssTheme: "AUTOMATIC",
    viewerExtraStyles: "",
    viewerExtraStylesUrls: "",
    nameddest: "",
  },
  d = {
    AUTOMATIC: 0,
    // Default value.
    LIGHT: 1,
    DARK: 2,
  },
  A = [
    "src",
    "viewer-path",
    "locale",
    "text-layer",
    "viewer-css-theme",
    "viewer-extra-styles",
    "viewer-extra-styles-urls",
  ];
class p extends HTMLElement {
  constructor() {
    super(),
      (this.onIframeReady = v(
        async (r) => {
          await f("iframe", this.shadowRoot), r();
        },
        0,
        { leading: !0 }
      )),
      (this.setViewerExtraStyles = (r, n = "extra") => {
        var i, a, o, l, h;
        if (!r) {
          (a = (i = this.iframe.contentDocument) == null ? void 0 : i.head.querySelector(`style[${n}]`)) == null ||
            a.remove();
          return;
        }
        if (
          ((l = (o = this.iframe.contentDocument) == null ? void 0 : o.head.querySelector(`style[${n}]`)) == null
            ? void 0
            : l.innerHTML) === r
        )
          return;
        const t = document.createElement("style");
        (t.innerHTML = r), t.setAttribute(n, ""), (h = this.iframe.contentDocument) == null || h.head.appendChild(t);
      }),
      (this.injectExtraStylesLinks = (r) => {
        if (!r) return;
        r.replace(/'|]|\[/g, "")
          .split(",")
          .map((t) => t.trim())
          .forEach((t) => {
            var o, l;
            if ((o = this.iframe.contentDocument) == null ? void 0 : o.head.querySelector(`link[href="${t}"]`)) return;
            const a = document.createElement("link");
            (a.rel = "stylesheet"), (a.href = t), (l = this.iframe.contentDocument) == null || l.head.appendChild(a);
          });
      }),
      (this.initialize = () =>
        new Promise(async (r) => {
          var n;
          await f("iframe", this.shadowRoot),
            (n = this.iframe) == null ||
              n.addEventListener(
                "load",
                async () => {
                  var t, i, a;
                  await ((i = (t = this.iframe.contentWindow) == null ? void 0 : t.PDFViewerApplication) == null
                    ? void 0
                    : i.initializedPromise),
                    r((a = this.iframe.contentWindow) == null ? void 0 : a.PDFViewerApplication);
                },
                { once: !0 }
              );
        }));
    const e = this.attachShadow({ mode: "open" }),
      s = document.createElement("template");
    (s.innerHTML = `
      <style>:host{width:100%;display:block;overflow:hidden}:host iframe{height:100%}</style>
      <iframe frameborder="0" width="100%" loading="lazy"></iframe>
    `),
      e.appendChild(s.content.cloneNode(!0));
  }
  static get observedAttributes() {
    return [
      "src",
      "viewer-path",
      "locale",
      "page",
      "search",
      "phrase",
      "zoom",
      "pagemode",
      "text-layer",
      "viewer-css-theme",
      "viewer-extra-styles",
      "viewer-extra-styles-urls",
      "nameddest",
    ];
  }
  connectedCallback() {
    (this.iframe = this.shadowRoot.querySelector("iframe")),
      document.addEventListener("webviewerloaded", async () => {
        var e, s, r, n, t, i, a, o;
        this.setCssTheme(this.getCssThemeOption()),
          this.injectExtraStylesLinks(this.getAttribute("viewer-extra-styles-urls") ?? c.viewerExtraStylesUrls),
          this.setViewerExtraStyles(this.getAttribute("viewer-extra-styles") ?? c.viewerExtraStyles),
          this.getAttribute("src") !== c.src &&
            ((s = (e = this.iframe.contentWindow) == null ? void 0 : e.PDFViewerApplicationOptions) == null ||
              s.set("defaultUrl", "")),
          (n = (r = this.iframe.contentWindow) == null ? void 0 : r.PDFViewerApplicationOptions) == null ||
            n.set("disablePreferences", !0),
          (i = (t = this.iframe.contentWindow) == null ? void 0 : t.PDFViewerApplicationOptions) == null ||
            i.set("pdfBugEnabled", !0),
          (o = (a = this.iframe.contentWindow) == null ? void 0 : a.PDFViewerApplicationOptions) == null ||
            o.set("eventBusDispatchToDOM", !0);
      });
  }
  attributeChangedCallback(e) {
    if (!A.includes(e)) {
      this.onIframeReady(() => {
        this.iframe.src = this.getIframeSrc();
      });
      return;
    }
    this.onIframeReady(() => this.mountViewer(this.getIframeSrc()));
  }
  getIframeSrc() {
    const e = this.getFullPath(this.getAttribute("src") || c.src),
      s = this.getFullPath(this.getAttribute("viewer-path") || c.viewerPath),
      r = this.getAttribute("page") || c.page,
      n = this.getAttribute("search") || c.search,
      t = this.getAttribute("phrase") || c.phrase,
      i = this.getAttribute("zoom") || c.zoom,
      a = this.getAttribute("pagemode") || c.pagemode,
      o = this.getAttribute("locale") || c.locale,
      l = this.getAttribute("text-layer") || c.textLayer,
      h = this.getAttribute("viewer-css-theme") || c.viewerCssTheme,
      u = !!(this.getAttribute("viewer-extra-styles") || c.viewerExtraStyles),
      w = this.getAttribute("nameddest") || c.nameddest;
    return `${s}${c.viewerEntry}?file=${encodeURIComponent(
      e
    )}#page=${r}&zoom=${i}&pagemode=${a}&search=${n}&phrase=${t}&textLayer=${l}${
      o ? "&locale=" + o : ""
    }&viewerCssTheme=${h}&viewerExtraStyles=${u}`;
    //&nameddest=${w}
  }
  mountViewer(e) {
    !e ||
      !this.iframe ||
      (this.shadowRoot.replaceChild(this.iframe.cloneNode(), this.iframe),
      (this.iframe = this.shadowRoot.querySelector("iframe")),
      (this.iframe.src = e));
  }
  getFullPath(e) {
    return e.startsWith("/") ? `${window.location.origin}${e}` : e;
  }
  getCssThemeOption() {
    const e = this.getAttribute("viewer-css-theme");
    return Object.keys(d).includes(e) ? d[e] : d[c.viewerCssTheme];
  }
  setCssTheme(e) {
    var s, r, n;
    if (e === d.DARK) {
      const t = (s = this.iframe.contentDocument) == null ? void 0 : s.styleSheets[0],
        i = (t == null ? void 0 : t.cssRules) || [],
        a = Object.keys(i)
          .filter((o) => {
            var l;
            return ((l = i[Number(o)]) == null ? void 0 : l.conditionText) === "(prefers-color-scheme: dark)";
          })
          .map(
            (o) =>
              i[Number(o)].cssText.split(`@media (prefers-color-scheme: dark) {
`)[1].split(`
}`)[0]
          );
      this.setViewerExtraStyles(a.join(""), "theme");
    } else
      (n = (r = this.iframe.contentDocument) == null ? void 0 : r.head.querySelector("style[theme]")) == null ||
        n.remove();
  }
}
window.customElements.get("pdfjs-viewer-element") ||
  ((window.PdfjsViewerElement = p), window.customElements.define("pdfjs-viewer-element", p));
/*
export {
  p as PdfjsViewerElement,
  d as ViewerCssTheme,
  p as default,
  A as hardRefreshAttributes
};
*/
