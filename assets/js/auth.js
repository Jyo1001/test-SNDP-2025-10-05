import { store } from "./util.js";
const KEY = "snp_session";
export const getSession = ()=> store.get(KEY);
export const setSession = (s)=>{ store.set(KEY, s); refreshAuthUI(); };
export const clearSession = ()=>{ store.del(KEY); refreshAuthUI(); };
export const refreshAuthUI = ()=>{
  const s = getSession();
  const loginBtn = document.getElementById("loginBtn");
  const userPanel = document.getElementById("userPanel");
  const hello = document.getElementById("hello");
  if(s){
    if(loginBtn) loginBtn.style.display="none";
    if(userPanel) userPanel.style.display="flex";
    if(hello){
      let label = s.username;
      if(s.role === "manager"){
        label = "Manager";
      } else if(s.profile && s.profile.name){
        label = s.profile.name;
      }
      hello.textContent = label;
    }
  } else {
    if(loginBtn) loginBtn.style.display="inline-block";
    if(userPanel) userPanel.style.display="none";
  }
};
export const bindAuthButtons = ()=>{
  const lb = document.getElementById("loginBtn"); if(lb) lb.addEventListener("click", ()=> location.hash = "#/login");
  const lo = document.getElementById("logoutBtn"); if(lo) lo.addEventListener("click", ()=>{ clearSession(); location.hash = "#/home"; });
};
