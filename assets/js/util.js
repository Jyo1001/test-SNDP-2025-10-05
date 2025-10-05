export const money = (n) => {
  if (n === "—") return "—";
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n); }
  catch { return "₹" + Number(n || 0).toLocaleString("en-IN"); }
};
export const safe = (s="") => s.toString().replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export const loadJSON = async (path) => {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load " + path);
  return await res.json();
};
export const store = {
  get(k){ try{return JSON.parse(localStorage.getItem(k))}catch(_){return null}},
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); },
  del(k){ localStorage.removeItem(k); }
};
