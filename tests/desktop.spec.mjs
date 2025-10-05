import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { JSDOM } from "jsdom";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const siteDataPromise = readFile(join(projectRoot, "data/site.json"), "utf8").then(JSON.parse);
const usersDataPromise = readFile(join(projectRoot, "data/users.json"), "utf8").then(JSON.parse);

const flushPromises = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
};

let dom;

async function setupApp() {
  const html = await readFile(join(projectRoot, "index.html"), "utf8");
  dom = new JSDOM(html, {
    url: "http://localhost/index.html",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.innerWidth = 1280;
  const fetchStub = vi.fn(async (path) => {
    const filePath = join(projectRoot, path);
    const content = await readFile(filePath);
    const headers = { "Content-Type": path.endsWith(".json") ? "application/json" : "text/plain" };
    return new Response(content, { status: 200, headers });
  });
  window.fetch = fetchStub;
  Object.assign(globalThis, {
    window,
    document: window.document,
    location: window.location,
    navigator: window.navigator,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    HTMLElement: window.HTMLElement,
    Node: window.Node,
    Event: window.Event,
    HashChangeEvent: window.HashChangeEvent,
    CustomEvent: window.CustomEvent,
    fetch: fetchStub,
  });
  const appModule = await import(pathToFileURL(join(projectRoot, "assets/js/app.js")).href + `?t=${Date.now()}`);
  await appModule.appReady;
  await flushPromises();
  return { window, document: window.document, fetchStub };
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (dom) {
    dom.window.close();
    dom = null;
  }
  vi.useRealTimers();
  vi.restoreAllMocks();
  for (const key of ["window", "document", "location", "navigator", "localStorage", "sessionStorage", "HTMLElement", "Node", "Event", "HashChangeEvent", "CustomEvent", "fetch"]) {
    if (key in globalThis) {
      delete globalThis[key];
    }
  }
});

describe("desktop experience", () => {
  it("renders home hero data and highlights", async () => {
    const { document } = await setupApp();
    const siteData = await siteDataPromise;
    expect(document.querySelectorAll("#homeOverview .highlight-card").length).toBe(siteData.highlights.length);
    expect(document.querySelectorAll("#homeInsights .insight-card").length).toBe(siteData.insights.length);
    expect(document.getElementById("homeStats").children.length).toBe(siteData.stats.length);
    const ctaButtons = Array.from(document.querySelectorAll(".hero .cta .btn"));
    expect(ctaButtons.map((btn) => btn.getAttribute("href"))).toEqual([
      "#/about",
      "#/chathenkery",
    ]);
  });

  it("navigates between sections via top navigation", async () => {
    const { window, document } = await setupApp();
    window.location.hash = "#/gallery";
    window.dispatchEvent(new window.HashChangeEvent("hashchange"));
    await flushPromises();
    expect(document.querySelector('section[data-route="gallery"]').style.display).toBe("block");
    expect(document.querySelector('section[data-route="home"]').style.display).toBe("none");
    const active = Array.from(document.querySelectorAll(".nav a.active")).map((a) => a.getAttribute("href"));
    expect(active).toEqual(["#/gallery"]);
  });

  it("renders directory cards with contact buttons", async () => {
    const { window, document } = await setupApp();
    const users = await usersDataPromise;
    window.location.hash = "#/directory";
    window.dispatchEvent(new window.HashChangeEvent("hashchange"));
    await flushPromises();
    const cards = document.querySelectorAll("#directoryView .tile");
    const userCount = users.filter((u) => u.role === "user").length;
    expect(cards.length).toBe(userCount);
    const firstCardButtons = cards[0].querySelectorAll("a.btn");
    expect(firstCardButtons[0].getAttribute("href")).toMatch(/^tel:/);
    expect(firstCardButtons[1].getAttribute("href")).toMatch(/^mailto:/);
    expect(firstCardButtons[2].getAttribute("href")).toMatch(/^https:\/\/www.google.com\/maps/);
  });

  it("supports keyboard search focus and theme toggle", async () => {
    const { window, document } = await setupApp();
    const searchInput = document.getElementById("q");
    window.document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "/", bubbles: true }));
    expect(window.document.activeElement).toBe(searchInput);
    const originalTheme = document.body.dataset.theme;
    document.getElementById("theme").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(document.body.dataset.theme).not.toBe(originalTheme);
  });

  it("allows manager login and renders loans dashboard", async () => {
    vi.useFakeTimers();
    const { window, document } = await setupApp();
    window.location.hash = "#/login";
    window.dispatchEvent(new window.HashChangeEvent("hashchange"));
    await flushPromises();
    const form = document.getElementById("loginForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const roleManager = document.querySelector('input[name="role"][value="manager"]');
    const msg = document.getElementById("loginMsg");

    username.value = "user01";
    password.value = "wrong";
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    expect(msg.textContent).toContain("Invalid");

    roleManager.checked = true;
    username.value = "manager";
    password.value = "demo123";
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    expect(msg.textContent).toBe("Logged in");

    vi.runAllTimers();
    await flushPromises();
    window.dispatchEvent(new window.HashChangeEvent("hashchange"));
    await flushPromises();

    expect(window.location.hash).toBe("#/loans");
    expect(document.querySelector("#loanTable")).toBeTruthy();

    document.getElementById("logoutBtn").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(window.location.hash).toBe("#/home");
    window.dispatchEvent(new window.HashChangeEvent("hashchange"));
    await flushPromises();
    expect(document.getElementById("userPanel").style.display).toBe("none");
  });
});
