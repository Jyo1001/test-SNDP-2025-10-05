import { loadJSON, store } from "./util.js";
import { renderRoute, currentRoute } from "./router.js";
import { bindAuthButtons, refreshAuthUI, setSession, getSession } from "./auth.js";
import { renderLoans, renderUserDetail } from "./loans.js";
import { renderDirectory } from "./directory.js";
import { CONTENT, renderStaticContent } from "./content.js";

let DATA = { accounts: [], events: [], notices: [], site: {} };
let searchBlocks = [];

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
  document.body.dataset.theme = DATA.site.theme || "dark";
  refreshAuthUI();
  bindAuthButtons();

  renderStaticContent(CONTENT, DATA.events);
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
  document.addEventListener("keydown", (e)=>{ if(e.key === "/" && document.activeElement !== q){ e.preventDefault(); q.focus(); }});
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
    const dark = document.body.dataset.theme !== "light";
    document.body.dataset.theme = dark ? "light" : "dark";
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

function onRoute(){
  renderRoute();
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
}

bootstrap().catch(err => {
  console.error(err);
  document.body.insertAdjacentHTML("beforeend", `<pre style="color:#fff;background:#900;padding:10px">${err}</pre>`);
});
