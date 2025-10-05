import { loadJSON, store, safe } from "./util.js";
import { renderRoute, currentRoute } from "./router.js";
import { bindAuthButtons, refreshAuthUI, setSession, getSession } from "./auth.js";
import { renderLoans, renderUserDetail } from "./loans.js";
import { renderDirectory } from "./directory.js";
import { CONTENT, renderStaticContent } from "./content.js";

let DATA = { accounts: [], events: [], notices: [], site: {} };
let searchBlocks = [];

function openSearchPanel(){
  document.body.dataset.searchOpen = "true";
  const toggle = document.getElementById("searchToggle");
  if(toggle){
    toggle.setAttribute("aria-expanded", "true");
    const text = toggle.querySelector(".search-text");
    if(text && window.innerWidth <= 820){
      text.textContent = "Close";
    }
  }
  const q = document.getElementById("q");
  if(q){
    if(window.innerWidth <= 820){
      setTimeout(()=> q.focus(), 50);
    } else {
      q.focus();
    }
  }
}

function closeSearchPanel(){
  document.body.dataset.searchOpen = "false";
  const toggle = document.getElementById("searchToggle");
  if(toggle){
    toggle.setAttribute("aria-expanded", "false");
    const text = toggle.querySelector(".search-text");
    if(text){
      text.textContent = "Search";
    }
  }
  const q = document.getElementById("q");
  if(q && document.activeElement === q){
    q.blur();
  }
}

function toggleSearchPanel(){
  if(document.body.dataset.searchOpen === "true"){
    closeSearchPanel();
  } else {
    openSearchPanel();
  }
}

async function bootstrap(){
  // Load data in parallel
  const [users, events, notices, site] = await Promise.all([
    loadJSON("data/users.json"),
    loadJSON("data/events.json"),
    loadJSON("data/notices.json"),
    loadJSON("data/site.json")
  ]);
  DATA.accounts = users;
  DATA.events   = [...events].sort((a,b)=> new Date(a.date) - new Date(b.date));
  DATA.notices  = notices;
  DATA.site     = site;

  document.getElementById("year").textContent = new Date().getFullYear();
  const storedTheme = store.get("theme");
  const initialTheme = storedTheme || DATA.site.theme || "light";
  document.body.dataset.theme = initialTheme;
  document.body.dataset.navOpen = "false";
  document.body.dataset.searchOpen = "false";
  refreshAuthUI();
  bindAuthButtons();

  renderStaticContent(CONTENT, DATA.events);
  renderHome(DATA.site);
  renderSectionIntros(DATA.site);
  renderGallery(DATA.site);
  renderReferences(DATA.site);
  searchBlocks = Array.from(document.querySelectorAll("section[data-route], section.hero"));

  // Basic notices/events render
  const noticesBox = document.getElementById("notices");
  if(noticesBox) noticesBox.innerHTML = DATA.notices.map(n => `
    <div class="notice ${n.type}"><div class="dot"></div><div><strong>${n.title}</strong><div>${n.body}</div></div></div>`).join("");

  // Routing
  window.addEventListener("hashchange", onRoute);
  const last = store.get("lastRoute");
  if(!location.hash || !location.hash.startsWith("#/")){
    location.hash = "#/" + (last || "home");
  } else {
    onRoute();
  }

  // Search shortcut
  const q = document.getElementById("q");
  const searchToggle = document.getElementById("searchToggle");
  closeSearchPanel();
  searchToggle?.addEventListener("click", toggleSearchPanel);
  document.addEventListener("keydown", (e)=>{
    if(e.key === "/" && document.activeElement !== q){
      e.preventDefault();
      if(window.innerWidth <= 820){
        openSearchPanel();
      } else {
        q?.focus();
      }
    }
    if(e.key === "Escape" && document.body.dataset.searchOpen === "true"){
      e.preventDefault();
      closeSearchPanel();
    }
  });
  q?.addEventListener("input", ()=>{
    const needle = q.value.trim().toLowerCase();
    if(!needle){ searchBlocks.forEach(b=> b.style.outline="none"); return; }
    searchBlocks.forEach(b=>{
      const text = b.textContent.toLowerCase();
      b.style.outline = text.includes(needle) ? "2px solid rgba(130,200,255,.45)" : "none";
    });
  });

  // Theme toggle
  document.getElementById("theme")?.addEventListener("click", ()=>{
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    store.set("theme", next);
  });

  // Navigation toggle
  const navToggle = document.getElementById("navToggle");
  const navLabel = navToggle?.querySelector(".menu-label");
  const navLinks = document.querySelectorAll(".nav a");
  const closeNav = ()=>{
    document.body.dataset.navOpen = "false";
    if(navToggle){
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.classList.remove("is-open");
    }
    if(navLabel){
      navLabel.textContent = "Menu";
    }
    closeSearchPanel();
  };
  navToggle?.addEventListener("click", ()=>{
    const isOpen = document.body.dataset.navOpen === "true";
    const next = !isOpen;
    document.body.dataset.navOpen = String(next);
    navToggle.setAttribute("aria-expanded", String(next));
    navToggle.classList.toggle("is-open", next);
    if(navLabel){
      navLabel.textContent = next ? "Close" : "Menu";
    }
    if(next){
      closeSearchPanel();
    }
  });
  navLinks.forEach(link => link.addEventListener("click", closeNav));
  window.addEventListener("resize", ()=>{
    closeSearchPanel();
    if(window.innerWidth > 820){
      closeNav();
    }
  });

  // Simple login page inside SPA
  if(!document.getElementById("loginSheet")){
    const login = document.createElement("template");
    login.innerHTML = `
      <section id="loginSheet" data-route="login"><h2>Log in</h2>
        <div class="notice ok"><div class="dot"></div><div>Demo: Users <code>user01..user10</code> and Manager <code>manager</code>. Password: <code>demo123</code>.</div></div>
        <form id="loginForm" class="form">
          <div style="display:flex; gap:8px; margin-bottom:8px">
            <label><input type="radio" name="role" value="user" checked> User</label>
            <label><input type="radio" name="role" value="manager"> Manager</label>
          </div>
          <input id="username" placeholder="username" required />
          <input id="password" type="password" placeholder="password" required />
          <button class="btn" type="submit">Log in</button>
          <div id="loginMsg" style="margin-top:8px"></div>
        </form>
      </section>`;
    document.querySelector("main.wrap").appendChild(login.content);
    searchBlocks = Array.from(document.querySelectorAll("section[data-route], section.hero"));
  }
  // Bind login
  document.getElementById("loginForm")?.addEventListener("submit",(e)=>{
    e.preventDefault();
    const role = document.querySelector('input[name="role"]:checked').value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const found = DATA.accounts.find(a => a.username===username && a.password===password && a.role===role);
    const msg = document.getElementById("loginMsg");
    if(!found){ msg.textContent = "Invalid credentials"; return; }
    setSession({username:found.username, role:found.role, profile:found.profile});
    msg.textContent = "Logged in";
    setTimeout(()=> location.hash = "#/loans", 300);
  });
}

function renderHome(site = {}){
  const title = site.title || "SNDP Chathenkery";
  document.title = site.pageTitle || `${title} — Community Hub`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if(metaDesc && site.description){
    metaDesc.setAttribute("content", site.description);
  }
  const brandLabel = document.querySelector(".brand span");
  if(brandLabel) brandLabel.textContent = title;
  const heroHeading = document.querySelector(".hero-copy h1");
  if(heroHeading) heroHeading.textContent = `Welcome to ${title}`;
  const mottoEl = document.getElementById("siteMotto");
  if(mottoEl && site.motto){ mottoEl.textContent = site.motto; }
  const chipsEl = document.getElementById("homeChips");
  if(chipsEl && Array.isArray(site.chips) && site.chips.length){
    chipsEl.innerHTML = site.chips.map(text => `<span class="chip">${safe(text)}</span>`).join("");
  }
  const statsEl = document.getElementById("homeStats");
  if(statsEl && Array.isArray(site.stats)){
    statsEl.innerHTML = site.stats.map((stat) => `
      <div class="tile">
        <div class="sub">${safe(stat.label)}</div>
        <div class="big">${safe(stat.value)}</div>
        ${stat.note ? `<p>${safe(stat.note)}</p>` : ""}
      </div>`).join("");
  }
  const highlightsEl = document.getElementById("homeOverview");
  if(highlightsEl){
    const highlights = Array.isArray(site.highlights) ? site.highlights : [];
    highlightsEl.innerHTML = highlights.map((item) => `
      <article class="highlight-card">
        <h3>${safe(item.title)}</h3>
        <p>${safe(item.body)}</p>
        ${item.link ? `<a href="${safe(item.link.href)}"${item.link.external ? " target=\"_blank\" rel=\"noopener\"" : ""}>${safe(item.link.label || "Learn more")}</a>` : ""}
      </article>`).join("");
    highlightsEl.style.display = highlights.length ? "grid" : "none";
  }
  const insightsEl = document.getElementById("homeInsights");
  if(insightsEl){
    const sections = Array.isArray(site.insights) ? site.insights : [];
    insightsEl.innerHTML = sections.map((section) => `
      <div class="insight-card">
        <h3>${safe(section.title)}</h3>
        <ul>${(section.items || []).map((item) => `<li>${safe(item)}</li>`).join("")}</ul>
      </div>`).join("");
    insightsEl.style.display = sections.length ? "grid" : "none";
  }
}

function renderSectionIntros(site = {}){
  const sections = [
    ["directoryIntro", site.directoryIntro],
    ["noticesIntro", site.noticesIntro],
    ["galleryIntro", site.galleryIntro],
    ["loansIntro", site.loansIntro]
  ];
  sections.forEach(([id, config]) => {
    const target = document.getElementById(id);
    if(!target) return;
    if(!config){
      target.innerHTML = "";
      target.style.display = "none";
      return;
    }
    const block = typeof config === "string" ? { paragraphs: [config] } : config;
    const paragraphs = Array.isArray(block.paragraphs) ? block.paragraphs : [];
    const list = Array.isArray(block.list) ? block.list : [];
    let html = `<article class="article">`;
    if(paragraphs.length){
      html += paragraphs.map(text => `<p>${safe(text)}</p>`).join("");
    }
    if(block.note){
      html += `<p>${safe(block.note)}</p>`;
    }
    if(list.length){
      html += `<ul class="bullet-list">${list.map(item => `<li>${safe(item)}</li>`).join("")}</ul>`;
    }
    if(block.cta && block.cta.href){
      const external = block.cta.external ? ' target="_blank" rel="noopener"' : "";
      const variant = block.cta.variant === "alt" ? " btn-alt" : "";
      html += `<a class="btn${variant}" href="${safe(block.cta.href)}"${external}>${safe(block.cta.label || "Learn more")}</a>`;
    }
    html += `</article>`;
    target.innerHTML = html;
    target.style.display = "";
  });
}

function renderGallery(site = {}){
  const grid = document.getElementById("galleryGrid");
  if(grid){
    const items = Array.isArray(site.gallery) ? site.gallery : [];
    grid.innerHTML = items.map(item => `
      <article class="gallery-card">
        ${item.eyebrow ? `<span class="eyebrow">${safe(item.eyebrow)}</span>` : ""}
        <h3>${safe(item.title)}</h3>
        ${item.body ? `<p>${safe(item.body)}</p>` : ""}
        ${item.link ? `<a href="${safe(item.link.href)}"${item.link.external ? ' target=\"_blank\" rel=\"noopener\"' : ""}>${safe(item.link.label || "View details")}</a>` : ""}
      </article>`).join("");
    grid.style.display = items.length ? "grid" : "none";
  }
}

function renderReferences(site = {}){
  const list = document.getElementById("referencesList");
  if(list){
    const refs = Array.isArray(site.references) ? site.references : [];
    list.innerHTML = refs.map((ref) => `
      <li>
        <a href="${safe(ref.href)}" target="_blank" rel="noopener">${safe(ref.label || ref.href)}</a>
        ${ref.note ? `<div>${safe(ref.note)}</div>` : ""}
      </li>`).join("");
    list.style.display = refs.length ? "block" : "none";
  }
  const intro = document.getElementById("referencesIntro");
  if(intro){
    intro.innerHTML = site.referencesIntro
      ? `<article class="article"><p>${safe(site.referencesIntro)}</p></article>`
      : "";
  }
}

function onRoute(){
  renderRoute();
  closeSearchPanel();
  const { root, param } = currentRoute();
  if(root === "directory") renderDirectory(DATA.accounts);
  if(root === "loans"){
    if(!getSession()){ location.hash = "#/login"; return; }
    renderLoans(DATA.accounts);
  }
  if(root === "user"){
    if(!getSession()){ location.hash = "#/login"; return; }
    renderUserDetail(DATA.accounts, param);
  }
  const navToggle = document.getElementById("navToggle");
  if(navToggle){
    document.body.dataset.navOpen = "false";
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.classList.remove("is-open");
    const label = navToggle.querySelector(".menu-label");
    if(label) label.textContent = "Menu";
  }
}

bootstrap().catch(err => {
  console.error(err);
  document.body.insertAdjacentHTML("beforeend", `<pre style="color:#fff;background:#900;padding:10px">${err}</pre>`);
});
