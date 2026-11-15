/* The people behind each investigation: the shared helper A.people (also used by the question box) and the page
   #/people. Everything shown comes from data/people.js; nothing is guessed, composed or looked up here.
   Classes start with pp-. */
(function () {
  "use strict";
  var A = window.OFMW_APP;
  if (!A || !A.D) return;
  var h = A.h, T = A.T, D = A.D;

  A.es({
    "Principal Investigator (PI)": "Investigador principal (PI)", "Co-Investigator (Co-I)": "Coinvestigador (Co-I)",
    "Project Scientist": "Científico del proyecto", "Investigator": "Investigador", "Technical Point of Contact": "Contacto técnico",
    "Principal investigators": "Investigadores principales", "Co-investigators": "Coinvestigadores", "Project scientists": "Científicos del proyecto",
    "Investigators": "Investigadores", "Technical contacts": "Contactos técnicos", "Other roles": "Otros papeles",
    "No official profile found": "No se encontró perfil oficial", "Profile not searched yet": "Perfil aún no buscado",
    "Profile page": "Página de perfil", "Email": "Correo", "Website": "Sitio web",
    "Show details": "Ver detalle", "Hide details": "Ocultar detalle",
    "Contact through the PSI record of ": "Contacto por la ficha de PSI de ",
    "Also on this platform": "También en esta plataforma", "Investigations on this platform": "Investigaciones en esta plataforma",
    "Not in other investigations of this platform.": "No aparece en otras investigaciones de esta plataforma.",
    "Where this comes from": "De dónde sale", "Checked ": "Comprobado el ", "Photo: ": "Foto: ",
    "The names and roles come from the PSI record of each investigation.": "Los nombres y papeles salen de la ficha de PSI de cada investigación.",
    "Nobody has looked for an official profile of this person yet.": "Todavía nadie ha buscado un perfil oficial de esta persona.",
    "An official profile was searched for and not found.": "Se buscó un perfil oficial y no se encontró.",
    "Photo of ": "Foto de ",
    "The people behind the investigations": "Las personas detrás de las investigaciones",
    "The NASA investigators named in each PSI record, with their official profile when one was found. Search by name or institution, or filter by role.":
      "Los investigadores que nombra cada ficha de PSI, con su perfil oficial cuando se encontró. Busca por nombre o institución, o filtra por papel.",
    "Search by name or institution": "Buscar por nombre o institución", "Role": "Papel",
    "Showing ": "Se ven ", " of ": " de ", " people": " personas",
    "Nobody matches this search": "Nadie coincide con esta búsqueda", "Try another name, or clear the search and the role.": "Prueba otro nombre, o quita la búsqueda y el papel.",
    "Clear search": "Quitar búsqueda", "All investigations": "Todas las investigaciones",
    "The people list could not be read": "No se pudo leer la lista de personas",
    "The file data/people.js did not load. The names are still in each investigation record.": "El archivo data/people.js no cargó. Los nombres siguen en la ficha de cada investigación.",
    "No people are named in the PSI records loaded here.": "Las fichas de PSI cargadas aquí no nombran a nadie.",
    "People · One Fire, Many Worlds": "Personas · One Fire, Many Worlds"
  });

  var ROLE_ORDER = [["pi", /Principal Investigator/i, T("Principal investigators")], ["coi", /Co-Investigator/i, T("Co-investigators")],
    ["inv", /^Investigator$/i, T("Investigators")], ["ps", /Project Scientist/i, T("Project scientists")],
    ["tpc", /Technical Point of Contact/i, T("Technical contacts")]];
  function roleKind(role) { for (var k = 0; k < ROLE_ORDER.length; k++) if (ROLE_ORDER[k][1].test(role || "")) return ROLE_ORDER[k][0]; return "other"; }
  function roleRank(role) { var kind = roleKind(role); for (var k = 0; k < ROLE_ORDER.length; k++) if (ROLE_ORDER[k][0] === kind) return k; return ROLE_ORDER.length; }

  function data() { var P = window.OFMW_PEOPLE; return P && typeof P === "object" ? P : null; }
  /* Only web pages and mail links are shown; anything else in the file is ignored. */
  function safeUrl(u) { return typeof u === "string" && /^(https?:\/\/|mailto:)/i.test(u.trim()) ? u.trim() : null; }
  function safeImg(u) { return typeof u === "string" && /^img\/people\/[\w.-]+\.(jpe?g|png|webp)$/i.test(u) ? u : null; }

  /* "Richard Axelbaum (Principal Investigator (PI))" gives { name: "Richard Axelbaum", role: "Principal Investigator (PI)" }. */
  function parse(i) {
    return String((i && i.investigators) || "").split(/;\s*/).map(function (part) {
      part = part.trim();
      if (!part) return null;
      var k = part.indexOf(" (");
      if (k < 0 || part.charAt(part.length - 1) !== ")") return { name: part, role: "" };
      return { name: part.slice(0, k).trim(), role: part.slice(k + 2, -1).trim() };
    }).filter(Boolean);
  }
  function get(name) {
    var P = data();
    if (!P || !P.byName || !P.people) return null;
    var id = Object.prototype.hasOwnProperty.call(P.byName, name) ? P.byName[name] : null;
    var e = id && Object.prototype.hasOwnProperty.call(P.people, id) ? P.people[id] : null;
    return e && typeof e === "object" ? Object.assign({ id: id }, e) : null;
  }
  /* Unique people of these investigations. Two spellings that people.js maps to one id are one person. */
  function forInvestigations(ids) {
    var seen = {}, out = [];
    (ids || []).forEach(function (invId) {
      var i = A.inv(invId);
      if (!i) return;
      parse(i).forEach(function (p) {
        var e = get(p.name), key = e ? "id:" + e.id : "name:" + p.name, rec = seen[key];
        if (!rec) { rec = seen[key] = { key: key, name: e && e.name ? e.name : p.name, names: [], entry: e, roles: [], invs: [] }; out.push(rec); }
        if (rec.names.indexOf(p.name) < 0) rec.names.push(p.name);
        rec.roles.push({ inv: i.id, role: p.role });
        if (rec.invs.indexOf(i.id) < 0) rec.invs.push(i.id);
      });
    });
    out.forEach(function (r) { r.rank = Math.min.apply(null, r.roles.map(function (x) { return roleRank(x.role); })); });
    return out.sort(function (a, b) { return a.rank - b.rank || a.name.localeCompare(b.name); });
  }
  function everyone() { return forInvestigations(D.investigations.map(function (i) { return i.id; })); }
  /* Which investigations of the platform name this person, by any spelling that maps to the same id. */
  function allInvsOf(rec) {
    var all = everyone();
    for (var k = 0; k < all.length; k++) if (all[k].key === rec.key) return all[k].roles;
    return rec.roles;
  }

  function initials(name) {
    var w = String(name).replace(/[^\p{L}\s'-]/gu, " ").split(/\s+/).filter(Boolean);
    return ((w[0] || "").charAt(0) + (w.length > 1 ? w[w.length - 1].charAt(0) : "")).toUpperCase();
  }
  function avatar(rec) {
    var e = rec.entry, src = e && safeImg(e.photo);
    var box = h("span", { "class": "pp-photo", "aria-hidden": src ? null : "true" });
    var letters = function () { box.replaceChildren(h("span", { "class": "pp-initials", text: initials(rec.name) })); box.setAttribute("aria-hidden", "true"); };
    if (src) box.appendChild(h("img", { src: src, alt: T("Photo of ") + rec.name, width: "64", height: "64", loading: "lazy", decoding: "async", onerror: letters }));
    else letters();
    return box;
  }
  function link(item) {
    var url = item && safeUrl(item.url);
    if (!url) return null;
    var mail = /^mailto:/i.test(url);
    return h("a", { "class": "pp-link", href: url, target: mail ? null : "_blank", rel: mail ? null : "noopener noreferrer", text: T(item.label || (mail ? "Email" : "Website")) });
  }
  function contacts(e) {
    if (!e) return [];
    var list = [];
    if (e.profile) list.push(link({ label: e.profile.label || "Profile page", url: e.profile.url }));
    (Array.isArray(e.contact) ? e.contact : []).forEach(function (c) { list.push(link(c)); });
    return list.filter(Boolean);
  }
  function verified(e) { return !!(e && e.status === "verified" && (e.profile || (Array.isArray(e.contact) && e.contact.length))); }
  function sourceLink(s) {
    if (typeof s === "string") { var u = safeUrl(s); return u ? h("a", { href: u, target: "_blank", rel: "noopener noreferrer", text: u.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] }) : h("span", { text: s }); }
    if (s && typeof s === "object") { var v = safeUrl(s.url); return v ? h("a", { href: v, target: "_blank", rel: "noopener noreferrer", text: s.label || v }) : (s.label ? h("span", { text: s.label }) : null); }
    return null;
  }
  function roleText(role) { return role ? T(role) : ""; }

  var serial = 0;
  function card(rec, opts) {
    opts = opts || {};
    var e = rec.entry, ok = verified(e), cur = opts.current ? A.inv(opts.current) : null, id = "pp-d" + (++serial);
    var here = cur ? rec.roles.filter(function (r) { return r.inv === cur.id; }) : [];
    var roleLine = cur ? here.map(function (r) { return roleText(r.role); }).filter(Boolean).join("; ")
      : rec.roles.map(function (r) { var i = A.inv(r.inv); return (i ? i.acr : r.inv) + (r.role ? ": " + roleText(r.role) : ""); }).join("; ");
    var orgLine = ok ? [e.position, e.org].filter(Boolean).join(", ") : "";
    var visibleLinks = ok ? contacts(e) : [];
    var others = allInvsOf(rec).filter(function (r) { return !cur || r.inv !== cur.id; });
    var psiInvs = cur ? [cur] : rec.invs.map(A.inv).filter(Boolean);

    var detail = h("div", { "class": "pp-detail", id: id, hidden: "" },
      ok && visibleLinks.length && opts.compact ? h("p", { "class": "pp-links" }, contacts(e)) : null,   /* compact cards keep their contacts here */
      e && e.note ? h("p", { "class": "pp-note", lang: "en", text: e.note }) : null,
      cur ? h("div", { "class": "pp-sub" }, h("h4", { text: T("Also on this platform") }),
        others.length ? h("ul", { "class": "pp-invs" }, others.map(function (r) { var i = A.inv(r.inv); return i ? h("li", null, h("a", { href: "#/investigation/" + i.id, text: i.acr }), r.role ? " " + roleText(r.role) : "") : null; }))
          : h("p", { "class": "pp-quiet", text: T("Not in other investigations of this platform.") })) : null,
      h("div", { "class": "pp-sub" }, h("h4", { text: T("Where this comes from") }),
        h("p", { "class": "pp-quiet", text: T("The names and roles come from the PSI record of each investigation.") }),
        !e || e.status === "not-searched" ? h("p", { "class": "pp-quiet", text: T("Nobody has looked for an official profile of this person yet.") }) : null,
        e && e.status === "not-found" ? h("p", { "class": "pp-quiet", text: T("An official profile was searched for and not found.") }) : null,
        e && Array.isArray(e.sources) && e.sources.length ? h("p", { "class": "pp-quiet pp-sources" }, e.sources.map(sourceLink).filter(Boolean).map(function (n, k) { return [k ? ", " : "", n]; })) : null,
        e && e.checked ? h("p", { "class": "pp-quiet" }, T("Checked "), h("span", { "class": "num", text: String(e.checked) })) : null,
        e && safeImg(e.photo) && (e.photoCredit || e.photoSource) ? h("p", { "class": "pp-quiet" }, T("Photo: "),
          safeUrl(e.photoSource) ? h("a", { href: safeUrl(e.photoSource), target: "_blank", rel: "noopener noreferrer", text: e.photoCredit || e.photoSource }) : (e.photoCredit || "")) : null));
    var btn = h("button", { type: "button", "class": "pp-head", "aria-expanded": "false", "aria-controls": id,
      onclick: function () {
        var open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        if (open) detail.removeAttribute("hidden"); else detail.setAttribute("hidden", "");
        btn.querySelector(".pp-toggle").textContent = open ? T("Hide details") : T("Show details");
        art.classList.toggle("is-open", open);
      } },
      avatar(rec),
      h("span", { "class": "pp-who" },
        h("span", { "class": "pp-name", text: rec.name }),
        roleLine ? h("span", { "class": "pp-role", text: roleLine }) : null,
        orgLine ? h("span", { "class": "pp-org", text: orgLine }) : null),
      h("span", { "class": "pp-toggle", text: T("Show details") }));
    var art = h("article", { "class": "pp-card" + (opts.compact ? " pp-compact" : ""), "data-key": rec.key },
      btn,
      ok ? (visibleLinks.length && !opts.compact ? h("p", { "class": "pp-links pp-links-top" }, visibleLinks) : null)
        : h("div", { "class": "pp-missing" }, A.tag("missing", T("No official profile found")),
          h("p", { "class": "pp-links" }, psiInvs.map(function (i) {
            return safeUrl(i.url) ? h("a", { "class": "pp-link", href: i.url, target: "_blank", rel: "noopener noreferrer", text: T("Contact through the PSI record of ") + i.acr }) : null;
          }))),
      detail);
    return art;
  }
  function cards(list, opts) {
    opts = opts || {};
    var recs = (list || []).map(function (x) {
      if (x && x.roles) return x;
      var e = get(x.name);
      return { key: e ? "id:" + e.id : "name:" + x.name, name: e && e.name ? e.name : x.name, names: [x.name], entry: e, roles: [{ inv: opts.current || "", role: x.role || "" }], invs: opts.current ? [opts.current] : [] };
    });
    if (!recs.length) return A.state("empty", T("No people are named in the PSI records loaded here."));
    return h("div", { "class": "pp-cards" + (opts.compact ? " pp-cards-compact" : "") }, recs.map(function (r) { return card(r, opts); }));
  }
  A.people = { parse: parse, get: get, forInvestigations: forInvestigations, cards: cards, roleKind: roleKind };

  /* ---------- the page #/people ---------- */
  var KEY = "ofmw-people";
  var st = { q: "", role: "" };
  try { var s0 = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (s0 && typeof s0 === "object") { st.q = String(s0.q || ""); st.role = String(s0.role || ""); } } catch (e) { /* fresh */ }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* not kept */ } }
  function fold(t) { return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function peopleView() {
    document.title = T("People · One Fire, Many Worlds");
    var root = h("div", { "class": "wrap pp-page" }, A.back("#/investigations", T("All investigations")),
      A.intro(T("The people behind the investigations"), T("The NASA investigators named in each PSI record, with their official profile when one was found. Search by name or institution, or filter by role.")));
    if (!data()) {
      root.appendChild(A.state("error", T("The people list could not be read"), T("The file data/people.js did not load. The names are still in each investigation record."),
        h("a", { "class": "c-btn", href: "#/investigations", text: T("All investigations") })));
      A.main.replaceChildren(root);
      return;
    }
    var all = everyone();
    var search = h("input", { type: "search", id: "pp-q", "class": "pp-input", value: st.q, autocomplete: "off", spellcheck: "false",
      oninput: function () { st.q = search.value; save(); render(); } });
    var roleSel = h("select", { id: "pp-role", "class": "pp-input", onchange: function () { st.role = roleSel.value; save(); render(); } },
      [["", T("All")]].concat(ROLE_ORDER.map(function (r) { return [r[0], r[2]]; }), [["other", T("Other roles")]]).map(function (o) {
        return h("option", { value: o[0], text: o[1], selected: o[0] === st.role ? "" : null });
      }));
    var count = h("p", { "class": "pp-count", id: "pp-count", role: "status", tabindex: "-1" });
    var clear = h("button", { type: "button", "class": "c-btn c-btn-quiet", hidden: "", onclick: clearAll, text: T("Clear search") });
    var list = h("div", { "class": "pp-list" });
    function clearAll() { st.q = ""; st.role = ""; save(); search.value = ""; roleSel.value = ""; render(); search.focus(); }
    function render() {
      var q = fold(st.q.trim());
      var shown = all.filter(function (r) {
        if (st.role && !r.roles.some(function (x) { return roleKind(x.role) === st.role; })) return false;
        if (!q) return true;
        var e = r.entry, hay = fold([r.name].concat(r.names, e && verified(e) ? [e.org, e.position] : []).join(" "));
        return hay.indexOf(q) >= 0;
      });
      count.textContent = T("Showing ") + shown.length + T(" of ") + all.length + T(" people");
      if (st.q || st.role) clear.removeAttribute("hidden"); else clear.setAttribute("hidden", "");
      list.replaceChildren(shown.length ? cards(shown, {}) : A.state("empty", T("Nobody matches this search"), T("Try another name, or clear the search and the role."),
        h("button", { type: "button", "class": "c-btn", onclick: clearAll, text: T("Clear search") })));
    }
    root.appendChild(h("div", { "class": "pp-bar" },
      h("div", { "class": "pp-ctl pp-ctl-q" }, h("label", { "for": "pp-q", text: T("Search by name or institution") }), search),
      h("div", { "class": "pp-ctl" }, h("label", { "for": "pp-role", text: T("Role") }), roleSel)));
    root.appendChild(h("div", { "class": "pp-status" }, count, clear));
    root.appendChild(list);
    A.main.replaceChildren(root);
    render();
  }
  A.route("people", "investigations", peopleView);
})();
