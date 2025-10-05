import { store } from "./util.js";
export const currentRoute = () => {
  const hash = location.hash.startsWith("#/") ? location.hash.slice(2) : "home";
  const [root, param] = hash.split("/");
  return { root: root || "home", param };
};
export const renderRoute = () => {
  const { root, param } = currentRoute();
  const key = (root === "user" && param) ? "user" : root;
  document.querySelectorAll("[data-route]").forEach(el => {
    el.style.display = (el.getAttribute("data-route") === key) ? "block" : "none";
  });
  document.querySelectorAll(".nav a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === "#/" + key);
  });
  // route hooks are executed by app.js (after data loads)
  store.set("lastRoute", key + (param ? "/" + param : ""));
};
