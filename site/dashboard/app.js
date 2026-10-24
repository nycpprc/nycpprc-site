(() => {
  const SITES = { nycpprc: "nycpprc.org", gnosis: "gnosis.health" };
  const params = new URLSearchParams(location.search);
  const DEMO = params.get("demo") === "1";
  const cfg = window.DASHBOARD_CONFIG || {};
  const state = { site: params.get("site") || "nycpprc", days: 28, allowed: Object.keys(SITES) };
  const $ = (id) => document.getElementById(id);
  const charts = {};
  const PALETTE = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#ec4899", "#64748b", "#a16207"];
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = "#6b7280";

  let sb = null;
  if (!DEMO) sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  // ---------- auth ----------
  async function init() {
    if (DEMO) return showApp("demo@example.com");
    const { data: { session } } = await sb.auth.getSession();
    session ? showApp(session.user.email) : showLogin();
    sb.auth.onAuthStateChange((_e, s) => (s ? showApp(s.user.email) : showLogin()));
  }
  const redirectTo = location.origin + location.pathname;
  $("google-btn").onclick = () => sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
  $("magic-form").onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await sb.auth.signInWithOtp({ email: $("email").value.trim(), options: { emailRedirectTo: redirectTo, shouldCreateUser: false } });
    $("login-msg").textContent = error ? error.message : "Check your email for a sign-in link.";
  };
  $("logout").onclick = async () => { if (DEMO) return; await sb.auth.signOut(); };

  function showLogin() { $("app").classList.add("hidden"); $("login").classList.remove("hidden"); }
  let shown = false;
  async function showApp(email) {
    $("login").classList.add("hidden"); $("app").classList.remove("hidden");
    $("user-email").textContent = email + (DEMO ? " (demo data)" : "");
    if (!DEMO) {
      const { data } = await sb.from("dashboard_admins").select("sites").maybeSingle();
      state.allowed = data?.sites?.length ? data.sites : [];
      if (!state.allowed.length) { $("status").textContent = "Your account is not on the dashboard allowlist."; return; }
      if (!state.allowed.includes(state.site)) state.site = state.allowed[0];
    }
    if (shown) return; shown = true;
    renderSwitchers(); load();
  }

  function renderSwitchers() {
    $("site-switch").innerHTML = state.allowed.map((s) => `<button data-site="${s}" class="${s === state.site ? "on" : ""}">${SITES[s]}</button>`).join("");
    $("site-switch").querySelectorAll("button").forEach((b) => (b.onclick = () => { state.site = b.dataset.site; renderSwitchers(); load(); }));
    $("range-switch").querySelectorAll("button").forEach((b) => {
      b.classList.toggle("on", +b.dataset.days === state.days);
      b.onclick = () => { state.days = +b.dataset.days; renderSwitchers(); load(); };
    });
  }

  // ---------- data ----------
  async function fetchStats() {
    if (DEMO) return mockData(state.site, state.days);
    const { data, error } = await sb.functions.invoke("ga-stats", { body: { site: state.site, days: state.days } });
    if (error) throw error;
    if (data.error) throw new Error(data.error);
    return data;
  }

  async function load() {
    $("status").textContent = "Loading…";
    try {
      const d = await fetchStats();
      render(d);
      $("status").textContent = `${SITES[d.site]} · last ${d.days} days · updated ${new Date(d.generatedAt).toLocaleString()}`;
    } catch (e) { $("status").textContent = "Error: " + (e.message || e); }
  }

  // ---------- render ----------
  const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
  const nf = new Intl.NumberFormat();
  function chart(id, config) { charts[id]?.destroy(); charts[id] = new Chart($(id), config); }

  function render(d) {
    const ev = (n) => Object.values(d.keyEvents[n] || {}).reduce((a, b) => a + b, 0);
    const kpis = [["Visitors (daily sum)", sum(d.series, "users")], ["Sessions", sum(d.series, "sessions")], ["Page views", sum(d.series, "views")], ["Sign-ups", ev("sign_up")], ["Leads", ev("generate_lead")]];
    $("kpis").innerHTML = kpis.map(([l, v]) => `<div class="card kpi"><div class="l">${l}</div><div class="v">${nf.format(v)}</div></div>`).join("");

    const labels = d.series.map((r) => r.date.slice(5));
    const line = (label, data, color) => ({ label, data, borderColor: color, backgroundColor: color + "22", fill: false, tension: 0.3, pointRadius: d.days > 30 ? 0 : 2, borderWidth: 2 });
    chart("c-series", { type: "line", data: { labels, datasets: [line("Visitors", d.series.map((r) => r.users), PALETTE[0]), line("Sessions", d.series.map((r) => r.sessions), PALETTE[1]), line("Views", d.series.map((r) => r.views), PALETTE[2])] },
      options: { maintainAspectRatio: false, interaction: { mode: "index", intersect: false }, scales: { y: { beginAtZero: true, grid: { color: "#f0f1f3" } }, x: { grid: { display: false } } } } });

    chart("c-sources", { type: "doughnut", data: { labels: d.sources.map((r) => r.name), datasets: [{ data: d.sources.map((r) => r.sessions), backgroundColor: PALETTE, borderWidth: 0 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { position: "right" } } } });

    chart("c-countries", { type: "bar", data: { labels: d.countries.map((r) => r.name), datasets: [{ label: "Visitors", data: d.countries.map((r) => r.users), backgroundColor: PALETTE[0] }] },
      options: { indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: "#f0f1f3" } }, y: { grid: { display: false } } } } });

    $("t-pages").querySelector("tbody").innerHTML = d.pages.map((p) => `<tr><td title="${p.path}">${p.path}</td><td>${nf.format(p.views)}</td><td>${nf.format(p.users)}</td></tr>`).join("");

    const dates = d.series.map((r) => r.date);
    chart("c-events", { type: "bar", data: { labels, datasets: Object.keys(d.keyEvents).map((n, i) => ({ label: n, data: dates.map((dt) => d.keyEvents[n][dt] || 0), backgroundColor: PALETTE[i + 3] })) },
      options: { maintainAspectRatio: false, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#f0f1f3" } } } } });
  }

  // ---------- mock data (?demo=1) ----------
  function mockData(site, days) {
    let seed = site === "nycpprc" ? 7 : 13;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const base = site === "nycpprc" ? 60 : 35;
    const series = [], keyEvents = { sign_up: {}, generate_lead: {} };
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      const wk = [0, 6].includes(new Date(dt).getUTCDay()) ? 0.7 : 1;
      const users = Math.round(base * wk * (0.7 + rnd() * 0.6) * (1 + (days - i) / days * 0.3));
      const sessions = Math.round(users * (1.1 + rnd() * 0.3));
      series.push({ date: dt, users, sessions, views: Math.round(sessions * (1.8 + rnd())) });
      if (rnd() > 0.55) keyEvents.sign_up[dt] = 1 + Math.floor(rnd() * 3);
      if (rnd() > 0.7) keyEvents.generate_lead[dt] = 1 + Math.floor(rnd() * 2);
    }
    const tot = series.reduce((s, r) => s + r.sessions, 0);
    const split = (names, w) => names.map((n, i) => ({ name: n, v: Math.round(tot * w[i]) }));
    const pagesList = site === "nycpprc"
      ? ["/", "/about/", "/events/", "/resources/", "/contact/", "/join/", "/blog/", "/research/"]
      : ["/", "/blog/", "/services/", "/about/", "/contact/", "/blog/autism-and-nutrition/", "/book/", "/faq/"];
    return {
      site, days, generatedAt: new Date().toISOString(), series, keyEvents,
      sources: split(["Organic Search", "Direct", "Referral", "Organic Social", "Email", "Unassigned"], [0.38, 0.27, 0.14, 0.12, 0.06, 0.03]).map((r) => ({ name: r.name, sessions: r.v })),
      countries: split(["United States", "Canada", "United Kingdom", "India", "Germany", "Australia", "France"], [0.72, 0.07, 0.06, 0.05, 0.04, 0.03, 0.03]).map((r) => ({ name: r.name, users: r.v })),
      pages: pagesList.map((p, i) => ({ path: p, views: Math.round(tot * 2 / (i + 1.6)), users: Math.round(tot * 0.8 / (i + 1.8)) })),
    };
  }

  init();
})();
