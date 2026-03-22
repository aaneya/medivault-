import { auth, getAuthHeader } from "./app.js";

function parseDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function updateStats(records) {
  const active = (records || []).filter((r) => !r.isDeleted);
  const verified = active.filter((r) => !r.isTampered).length;
  const totalMB = (
    active.reduce((s, r) => s + (r.fileSizeBytes || 0), 0) / 1048576
  ).toFixed(1);
  const sorted = [...active].sort((a, b) => {
    const da = parseDate(a.createdAt)?.getTime() || 0;
    const db = parseDate(b.createdAt)?.getTime() || 0;
    return db - da;
  });
  const lastDate = sorted.length
    ? new Date(parseDate(sorted[0].createdAt)).toLocaleDateString()
    : "—";

  const st = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  st("stat-total", String(active.length));
  st("stat-verified", String(verified));
  st("stat-storage", `${totalMB} MB`);
  st("stat-last-upload", lastDate);
}

async function loadRecords() {
  const list = document.getElementById("records");
  if (!list) return;
  list.innerHTML = "";
  if (!auth.currentUser) {
    list.innerHTML = "<li>Sign in first (login page).</li>";
    return;
  }
  const headers = await getAuthHeader();
  const r = await fetch("/api/records", { headers });
  if (!r.ok) {
    list.innerHTML = `<li class="status-bad">Error: ${r.status}</li>`;
    return;
  }
  const data = await r.json();
  const records = data.records || [];
  for (const rec of records) {
    const li = document.createElement("li");
    li.textContent = `${rec.title || rec.id} — ${rec.fileType || ""}`;
    list.appendChild(li);
  }

  updateStats(records);

  const C = window.MediVaultCharts;
  if (C) {
    C.renderUploadTimeline("chart-timeline", records);
    C.renderFileTypeBreakdown("chart-types", records);
    C.renderTamperStatusBar("chart-tamper", records);
  }
}

loadRecords();
