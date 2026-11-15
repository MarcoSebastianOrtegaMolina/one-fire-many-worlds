/* A 3D model for each world, from NASA's 3D Resources (D-1427). Nothing heavy loads with the page: the viewer
   (model-viewer 4.4.0) and the model load only when the reader asks, and both are served from this site, the
   Draco decoder included, so no outside server is needed to open a model. */
(function () {
  "use strict";
  var A = window.OFMW_APP, h = A.h, T = A.T;
  if (!A) return;
  var LIB = "vendor/model-viewer/4.4.0/model-viewer.min.js", DRACO = "vendor/draco/0.187.0/";
  var NO_INSIGNIA = T("The NASA insignia was removed from its texture.");
  var LIGHTER = T("Its textures were recompressed to JPEG to load faster.");
  var MODELS = {
    station: [{ src: "models/iss.glb", bytes: 39708, name: "International Space Station (ISS) (A)", credit: "NASA",
      alt: T("3D model of the International Space Station"), page: "https://science.nasa.gov/3d-resources/international-space-station-iss-a/", change: "" }],
    moon: [
      { src: "models/habitat-1.glb", bytes: 195820, label: T("Part 1"), name: "Habitat Demonstration Unit (part 1)", credit: "NASA",
        alt: T("3D model of NASA's Habitat Demonstration Unit, part 1"), page: "https://science.nasa.gov/3d-resources/habitat-demonstration-unit/", change: T("The NASA insignias were removed from its texture.") },
      { src: "models/habitat-2.glb", bytes: 710988, label: T("Part 2"), name: "Habitat Demonstration Unit (part 2)", credit: "NASA",
        alt: T("3D model of NASA's Habitat Demonstration Unit, part 2"), page: "https://science.nasa.gov/3d-resources/habitat-demonstration-unit/", change: "" },
      { src: "models/moon-lro.glb", bytes: 3953768, label: T("The Moon"), name: "Moon 3D Models for Web, AR, and Animation (moon_small)", credit: "NASA's Goddard Space Flight Center",
        alt: T("3D model of the Moon made with imagery from NASA's Lunar Reconnaissance Orbiter"), page: "https://svs.gsfc.nasa.gov/14959/",
        change: T("Its texture was recompressed to JPEG, same size in pixels, to load faster.") }],
    /* D-1441: the EMU is the suit worn on Station spacewalks (100 % oxygen at 4.3 psi). Seen from the front at this orbit. */
    suit: [{ src: "models/emu.glb", bytes: 2538708, name: "Extravehicular Mobility Unit", credit: "NASA/Michael D. Carbajal", orbit: "180deg 80deg auto",
      alt: T("3D model of the Extravehicular Mobility Unit, the suit worn on Space Station spacewalks"), page: "https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/",
      change: T("Its backup PNG copies of the textures were removed; the WebP textures and the geometry are NASA's.") }],
    mars: [{ src: "models/mars.glb", bytes: 702156, name: "Planet Mars, 3D Model", credit: "NASA/JPL-Caltech",
      alt: T("3D model of the planet Mars"), page: "https://science.nasa.gov/resource/planet-mars-3d-model", change: LIGHTER }],
    earth: [{ src: "models/earth.glb", bytes: 2380808, name: "Earth with Clouds 3D Model", credit: "NASA Visualization Technology Applications and Development (VTAD)",
      alt: T("3D model of the Earth with clouds"), page: "https://science.nasa.gov/resource/earth-with-clouds-3d-model", change: LIGHTER }]
  };
  function size(b) { return b < 1e6 ? Math.round(b / 1e3) + " KB" : (b / 1e6).toFixed(1) + " MB"; }

  /* The viewer is loaded once, the first time a reader asks for a model. */
  var loading = null;
  function loadViewer() {
    if (loading) return loading;
    /* Documented way to point model-viewer at our own Draco decoder: set it before the library loads. */
    var here = new URL(DRACO, location.href).href;
    window.ModelViewerElement = window.ModelViewerElement || {};
    window.ModelViewerElement.dracoDecoderLocation = here;
    loading = new Promise(function (ok, fail) {
      var ready = function () {
        var MV = window.customElements && customElements.get("model-viewer");
        if (MV && MV.dracoDecoderLocation !== here) MV.dracoDecoderLocation = here;
        ok();
      };
      if (window.customElements && customElements.get("model-viewer")) return ready();
      var tag = document.createElement("script");
      tag.type = "module"; tag.src = LIB;
      tag.onload = function () { customElements.whenDefined("model-viewer").then(ready); };
      tag.onerror = function () { loading = null; tag.remove(); fail(); };
      document.head.appendChild(tag);
    });
    return loading;
  }

  A.viewer3d = function (worldId) {
    var list = MODELS[worldId];
    if (!list) return null;
    var pick = 0, open = false;
    var stage = h("div", { "class": "stage3d" }), status = h("p", { "class": "note", role: "status" }), credit = h("p", { "class": "credit3d" });
    var tabs = list.length > 1 ? h("div", { "class": "tabs3d", role: "group", "aria-label": T("Model") }) : null;
    var openBtn = h("button", { type: "button", "class": "action", onclick: function () { show(pick); } });
    var closeBtn = h("button", { type: "button", "class": "action quiet small", hidden: "", onclick: close }, T("Close the 3D view"));

    function paintIdle() {
      var m = list[pick];
      openBtn.textContent = T("See in 3D") + " (" + size(m.bytes) + ")";
      stage.replaceChildren(h("p", { "class": "idle3d", text: T("The model loads only when you open it.") }));
      status.textContent = "";
      paintCredit(m);
    }
    function paintCredit(m) {
      credit.replaceChildren(h("strong", { text: T("Model: ") }), m.name + ". " + T("Credit: ") + m.credit + ". ", m.change ? m.change + " " : "",
        T("Used for education; it does not imply endorsement by NASA. "),
        h("a", { href: m.page, target: "_blank", rel: "noopener", text: T("Open the model at NASA") }), ".");
    }
    function paintTabs() {
      if (!tabs) return;
      tabs.replaceChildren.apply(tabs, list.map(function (m, k) {
        return h("button", { type: "button", "class": "action small" + (k === pick ? "" : " quiet"), "aria-pressed": k === pick ? "true" : "false",
          onclick: function () { pick = k; if (open) show(k); else { paintTabs(); paintIdle(); } } }, m.label);
      }));
    }
    function show(k) {
      var m = list[k];
      pick = k; open = true; paintTabs(); paintCredit(m);
      openBtn.hidden = true; closeBtn.hidden = false;
      status.textContent = T("Loading the 3D model ...");
      stage.replaceChildren(h("p", { "class": "idle3d", text: T("Loading the 3D model ...") }));
      loadViewer().then(function () {
        if (!open || pick !== k) return;                         /* closed or switched while it loaded */
        var mv = document.createElement("model-viewer");
        mv.setAttribute("src", m.src);
        mv.setAttribute("alt", m.alt);
        mv.setAttribute("camera-controls", "");
        mv.setAttribute("loading", "eager");                     /* the reader already asked for it */
        mv.setAttribute("touch-action", "pan-y");
        mv.setAttribute("shadow-intensity", "0.6");
        if (m.orbit) mv.setAttribute("camera-orbit", m.orbit);
        if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) mv.setAttribute("interaction-prompt", "none");   /* no animated hand either */
        else mv.setAttribute("auto-rotate", "");
        mv.addEventListener("load", function () { status.textContent = T("Drag to turn it, pinch or scroll to zoom, and double-tap to reset."); });
        mv.addEventListener("error", function () {
          if (!mv.isConnected || pick !== k) return;               /* a late error from a model already replaced */
          status.textContent = T("The model did not load. Check the connection and try again.");
          openBtn.hidden = false; closeBtn.hidden = true; open = false; openBtn.textContent = T("Try again");
        });
        mv.addEventListener("dblclick", function () { mv.resetTurntableRotation && mv.resetTurntableRotation(); mv.cameraOrbit = m.orbit || "auto auto auto"; mv.fieldOfView = "auto"; });
        stage.replaceChildren(mv);
      }, function () {
        open = false;
        status.textContent = T("The 3D viewer did not load. Check the connection and try again.");
        stage.replaceChildren(h("p", { "class": "idle3d", text: T("The 3D viewer did not load.") }));
        openBtn.hidden = false; closeBtn.hidden = true; openBtn.textContent = T("Try again");
      });
    }
    function close() { open = false; openBtn.hidden = false; closeBtn.hidden = true; paintTabs(); paintIdle(); openBtn.focus(); }

    paintTabs(); paintIdle();
    return h("section", { "class": "view3d" },
      h("h2", { text: T("In 3D") }),
      h("p", { text: T("A NASA model of the place, to turn and look at.") }),
      tabs, h("div", { "class": "bar3d" }, openBtn, closeBtn), stage, status, credit);
  };
})();
