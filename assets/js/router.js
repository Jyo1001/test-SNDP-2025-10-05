import { store } from "./util.js";

const STATIC_ROUTES = new Set([
  "home",
  "about",
  "guru",
  "history",
  "chathenkery",
  "programs",
  "directory",
  "notices",
  "gallery",
  "faq",
  "loans",
  "references",
  "login"
]);

const clean = (route = "") => String(route || "").replace(/^#\//, "");

export const normalizeRoute = (route = "") => {
  const value = clean(route);
  if(!value){ return "home"; }
  const [root, param] = value.split("/");
  if(root === "user" && param){
    return `user/${param}`;
  }
  if(STATIC_ROUTES.has(root)){
    return root;
  }
  return "home";
};

export const isValidRoute = (route = "") => {
  const cleaned = clean(route);
  if(!cleaned){ return false; }
  return normalizeRoute(cleaned) === cleaned;
};

export const currentRoute = () => {
  const normalized = normalizeRoute(location.hash.startsWith("#/") ? location.hash.slice(2) : "");
  const [root, param] = normalized.split("/");
  return { root: root || "home", param };
};

export const renderRoute = () => {
  const { root, param } = currentRoute();
  const key = (root === "user" && param) ? "user" : root;
  const normalized = (root === "user" && param) ? `user/${param}` : root;
  document.querySelectorAll("[data-route]").forEach(el => {
    el.style.display = (el.getAttribute("data-route") === key) ? "block" : "none";
  });
  document.querySelectorAll(".nav a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === "#/" + key);
  });
  // route hooks are executed by app.js (after data loads)
  store.set("lastRoute", normalized);
};
