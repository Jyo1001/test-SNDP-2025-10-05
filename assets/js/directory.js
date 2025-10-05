import { safe } from "./util.js";
export const initials = (name="")=> name.split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join("").toUpperCase();
const telHref = (phone)=> 'tel:' + String(phone||'').replace(/[^\d+]/g,'');
const mapsHref = (addr)=> 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addr||'');
export const renderDirectory = (ACCOUNTS)=>{
  const box = document.getElementById("directoryView"); if(!box) return;
  const users = ACCOUNTS.filter(a=> a.role==="user");
  box.innerHTML = `
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px">
      <input id="dirFilter" placeholder="Search by name, phone, address..." style="flex:1; min-width:0">
      <span class="chip">${users.length} users</span>
    </div>
    <div class="gallery" id="dirGrid">
      ${users.map(u=>`
        <div class="tile" style="display:flex; gap:12px; align-items:center">
          <div class="logo" style="width:54px;height:54px;border-radius:14px;display:grid;place-items:center">${initials(u.profile.name)}</div>
          <div style="flex:1; min-width:0; display:grid; gap:4px">
            <div style="font-weight:800">${safe(u.profile.name)}</div>
            <div style="color:var(--muted)">${safe(u.profile.address)}</div>
            <div style="color:var(--muted)">${safe(u.profile.phone)}</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:6px">
              <a class="btn" href="${telHref(u.profile.phone)}">Call</a>
              <a class="btn" href="mailto:${safe(u.profile.email)}">Email</a>
              <a class="btn" target="_blank" rel="noopener" href="${mapsHref(u.profile.address)}">Map</a>
            </div>
          </div>
        </div>`).join("")}
    </div>`;
  const input = document.getElementById("dirFilter");
  const grid = document.getElementById("dirGrid");
  if(input && grid){
    input.addEventListener("input", ()=>{
      const t = input.value.toLowerCase();
      grid.querySelectorAll(".tile").forEach(card=>{
        card.style.display = card.textContent.toLowerCase().includes(t) ? "" : "none";
      });
    });
  }
};
