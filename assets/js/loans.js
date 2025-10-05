import { money, safe } from "./util.js";
import { getSession } from "./auth.js";
export const buildMonthlyStatement = (user)=>{
  if(!user || !user.loan) return [];
  const rate = (user.loan.interest||10)/100;
  let start = new Date(user.loan.start_date||"2025-01-01");
  if(isNaN(start)) start = new Date("2025-01-01");
  const monthStart = (d)=> new Date(d.getFullYear(), d.getMonth(), 1);
  const addMonths = (d,n)=> new Date(d.getFullYear(), d.getMonth()+n, 1);
  const monthsInclusive = (a,b)=> (b.getFullYear()-a.getFullYear())*12 + (b.getMonth()-a.getMonth()) + 1;
  const end = monthStart(new Date());
  const n = Math.max(1, monthsInclusive(monthStart(start), end));
  let bal = Math.round(user.loan.amount_borrowed||0);
  const base = Math.max(1000, Math.round((user.loan.amount_borrowed||0)*0.06));
  let seed = 0; for(const ch of user.username) seed = (seed*31 + ch.charCodeAt(0))>>>0;
  const rnd = ()=>{ seed = (seed*1664525 + 1013904223)>>>0; return (seed>>>8)/16777216; };

  const target = (typeof user.loan.balance === "number") ? user.loan.balance : null;
  const rows = [];
  for(let i=0;i<n;i++){
    const dt = addMonths(monthStart(start), i);
    const opening = Math.max(0, Math.round(bal));
    const interest = Math.round(opening * rate / 12);
    let payment;
    if(i===n-1 && target!=null){ payment = Math.max(0, Math.round(opening + interest - target)); }
    else { const varFac = 0.85 + rnd()*0.5; payment = Math.round(base * varFac); payment = Math.min(payment, opening + interest); }
    const closing = Math.max(0, Math.round(opening + interest - payment));
    rows.push({month: dt.toISOString().slice(0,7), opening, interest, payment, closing});
    bal = closing;
  }
  return rows;
};
export const renderLoans = (ACCOUNTS)=>{
  const box = document.getElementById("loansView"); if(!box) return;
  const s = getSession();
  if(!s){ box.innerHTML = `<div class="notice ok"><div class="dot"></div><div>Please log in to view loans.</div></div>`; return; }
  if(s.role==="user"){
    const u = ACCOUNTS.find(a=> a.username===s.username);
    if(!u){ box.innerHTML = `<div class="notice ok"><div class="dot"></div><div>Account not found.</div></div>`; return; }
    box.innerHTML = `
      <div class="tile"><div class="big">${safe(u.profile.name)}</div></div>
      <table class="table">
        <tbody>
          <tr><th>Username</th><td>${u.username}</td></tr>
          <tr><th>Phone</th><td>${safe(u.profile.phone)}</td></tr>
          <tr><th>Address</th><td>${safe(u.profile.address)}</td></tr>
          <tr><th>Borrowed</th><td>${money(u.loan.amount_borrowed)}</td></tr>
          <tr><th>Balance</th><td>${money(u.loan.balance)}</td></tr>
          <tr><th>Interest</th><td>${u.loan.interest}% p.a.</td></tr>
          <tr><th>Start</th><td>${u.loan.start_date}</td></tr>
          <tr><th>Last payment</th><td>${u.loan.last_payment}</td></tr>
        </tbody>
      </table>`;
  } else {
    const list = ACCOUNTS.filter(a=> a.role==="user");
    box.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px">
        <input id="flt" placeholder="Filter by name/phone/username" style="flex:1; min-width:0">
        <span class="chip">${list.length} users</span>
      </div>
      <div class="table-wrap">
        <table class="table" id="loanTable">
          <thead><tr>
            <th>Name</th><th>Username</th><th>Phone</th><th>Borrowed</th><th>Balance</th><th>Interest %</th><th>Start</th><th>Last payment</th>
          </tr></thead>
          <tbody>${list.map(u=> `
            <tr>
              <td><a href="#/user/${u.username}">${safe(u.profile.name)}</a></td>
              <td>${u.username}</td>
              <td>${safe(u.profile.phone)}</td>
              <td>${money(u.loan.amount_borrowed)}</td>
              <td>${money(u.loan.balance)}</td>
              <td>${u.loan.interest}</td>
              <td>${u.loan.start_date}</td>
              <td>${u.loan.last_payment}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
    const flt = document.getElementById("flt");
    if(flt){
      flt.addEventListener("input", ()=>{
        const t = flt.value.toLowerCase();
        document.querySelectorAll("#loanTable tbody tr").forEach(r=>{
          r.style.display = r.textContent.toLowerCase().includes(t) ? "" : "none";
        });
      });
    }
  }
};
export const renderUserDetail = (ACCOUNTS, username)=>{
  const box = document.getElementById("userDetail"); if(!box) return;
  const s = getSession();
  let u = ACCOUNTS.find(a=> a.username===username && a.role==="user");
  if(s && s.role==="user"){ u = ACCOUNTS.find(a=> a.username===s.username && a.role==="user"); }
  if(!u){ box.innerHTML = `<div class="notice ok"><div class="dot"></div><div>User not found or access denied.</div></div>`; return; }
  const rows = buildMonthlyStatement(u);
  const totalInterest = rows.reduce((t,r)=> t+r.interest, 0);
  const totalPaid = rows.reduce((t,r)=> t+r.payment, 0);
  const closingN = rows.length? rows[rows.length-1].closing : (u.loan.balance||0);
  box.innerHTML = `
    <div class="tile"><div class="big">${safe(u.profile.name)}</div></div>
    <div class="kpi">
      <div class="tile"><div class="sub">Borrowed</div><div class="big">${money(u.loan.amount_borrowed)}</div></div>
      <div class="tile"><div class="sub">Total Paid</div><div class="big">${money(totalPaid)}</div></div>
      <div class="tile"><div class="sub">Interest</div><div class="big">${money(totalInterest)}</div></div>
      <div class="tile"><div class="sub">Balance</div><div class="big">${money(closingN)}</div></div>
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Month</th><th>Opening</th><th>Interest</th><th>Payment</th><th>Closing</th></tr></thead>
        <tbody>${rows.map(r=> `<tr><td>${r.month}</td><td>${money(r.opening)}</td><td>${money(r.interest)}</td><td>${money(r.payment)}</td><td>${money(r.closing)}</td></tr>`).join("")}</tbody>
      </table>
    </div>`;
};
