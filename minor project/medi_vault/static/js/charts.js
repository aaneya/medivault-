/**
 * Chart.js helpers — requires global Chart from CDN (see base.html).
 */
(function () {
  const Chart = window.Chart;
  if (!Chart) {
    console.warn("Chart.js not loaded");
    return;
  }

  const CHART_DEFAULTS = {
    font: { family: "system-ui, Segoe UI, sans-serif", size: 12 },
    color: "#94a3b8",
    borderColor: "#1e293b",
    gridColor: "rgba(148,163,184,0.08)",
  };

  Chart.defaults.font = CHART_DEFAULTS.font;
  Chart.defaults.color = CHART_DEFAULTS.color;
  Chart.defaults.borderColor = CHART_DEFAULTS.borderColor;

  function parseDate(v) {
    if (!v) return null;
    if (v instanceof Date) return v;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function monthKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  function renderUploadTimeline(canvasId, records) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const now = new Date();
    const labels = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthKey(d));
    }
    const counts = Object.fromEntries(labels.map((k) => [k, 0]));
    (records || []).forEach((r) => {
      const d = parseDate(r.createdAt);
      if (!d) return;
      const k = monthKey(d);
      if (k in counts) counts[k] += 1;
    });
    const data = labels.map((k) => counts[k]);
    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Uploads",
            data,
            borderColor: "#0d9488",
            backgroundColor: "rgba(13,148,136,0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { color: CHART_DEFAULTS.gridColor } },
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: CHART_DEFAULTS.gridColor } },
        },
      },
    });
  }

  function renderFileTypeBreakdown(canvasId, records) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const types = { pdf: 0, jpg: 0, png: 0, dicom: 0 };
    (records || []).forEach((r) => {
      const t = (r.fileType || "").toLowerCase();
      if (t in types) types[t] += 1;
    });
    const data = [types.pdf, types.jpg, types.png, types.dicom];
    const legend = document.getElementById("legend-types");
    if (legend) {
      legend.innerHTML = "";
      const labels = ["PDF", "JPG", "PNG", "DICOM"];
      const colors = ["#14b8a6", "#fb7185", "#fbbf24", "#a78bfa"];
      labels.forEach((lb, i) => {
        const div = document.createElement("div");
        div.className = "chart-legend-item";
        div.innerHTML = `<span class="chart-legend-dot" style="background:${colors[i]}"></span>${lb}: ${data[i]}`;
        legend.appendChild(div);
      });
    }
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["PDF", "JPG", "PNG", "DICOM"],
        datasets: [
          {
            data,
            backgroundColor: ["#14b8a6", "#fb7185", "#fbbf24", "#a78bfa"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: { legend: { display: false } },
      },
    });
  }

  function renderTamperStatusBar(canvasId, records) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const active = (records || []).filter((r) => !r.isDeleted);
    let ok = 0;
    let bad = 0;
    active.forEach((r) => {
      if (r.isTampered) bad += 1;
      else ok += 1;
    });
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Verified", "Tampered"],
        datasets: [
          {
            label: "Records",
            data: [ok, bad],
            backgroundColor: ["#166534", "#b91c1c"],
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: CHART_DEFAULTS.gridColor } },
          y: { grid: { display: false } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  function renderPatientAccessTimeline(canvasId, requests) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const now = new Date();
    const labels = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      labels.push(`W${Math.min(52, Math.ceil((d - new Date(d.getFullYear(), 0, 1)) / 604800000) + 1)}`);
    }
    const approved = new Array(8).fill(0);
    const denied = new Array(8).fill(0);
    const pending = new Array(8).fill(0);
    (requests || []).forEach((r) => {
      const d = parseDate(r.requestedAt);
      if (!d) return;
      const diffWeeks = Math.floor((now - d) / 604800000);
      const idx = 7 - Math.min(7, Math.max(0, diffWeeks));
      const st = (r.status || "").toLowerCase();
      if (st === "approved") approved[idx] += 1;
      else if (st === "denied") denied[idx] += 1;
      else if (st === "pending") pending[idx] += 1;
    });
    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Approved", data: approved, backgroundColor: "#14b8a6" },
          { label: "Denied", data: denied, backgroundColor: "#fb7185" },
          { label: "Pending", data: pending, backgroundColor: "#fbbf24" },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { color: CHART_DEFAULTS.gridColor } },
          y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: CHART_DEFAULTS.gridColor } },
        },
      },
    });
  }

  function renderRecordVerificationHistory(canvasId, auditLogs) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const now = new Date();
    const labels = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    const counts = new Array(30).fill(0);
    (auditLogs || []).forEach((log) => {
      if ((log.action || "") !== "verify") return;
      const d = parseDate(log.timestamp);
      if (!d) return;
      const diff = Math.floor((now - d) / 86400000);
      if (diff >= 0 && diff < 30) counts[29 - diff] += 1;
    });
    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Verifications",
            data: counts,
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(14,165,233,0.1)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { maxTicksLimit: 8 }, grid: { color: CHART_DEFAULTS.gridColor } },
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: CHART_DEFAULTS.gridColor } },
        },
      },
    });
  }

  window.MediVaultCharts = {
    renderUploadTimeline,
    renderFileTypeBreakdown,
    renderTamperStatusBar,
    renderPatientAccessTimeline,
    renderRecordVerificationHistory,
  };
})();
