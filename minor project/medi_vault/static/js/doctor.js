import { auth, getAuthHeader } from "./app.js";

async function loadDashboard() {
  const list = document.getElementById("records");
  if (!auth.currentUser) {
    if (list) list.innerHTML = "<li>Sign in first.</li>";
    return;
  }
  const headers = await getAuthHeader();
  const [reqRes, logRes, recRes] = await Promise.all([
    fetch("/api/access/requests/mine", { headers }),
    fetch("/api/audit/mine", { headers }),
    fetch("/api/records", { headers }),
  ]);
  const reqData = await reqRes.json();
  const logData = await logRes.json();
  const recData = await recRes.json();

  const C = window.MediVaultCharts;
  if (C) {
    C.renderPatientAccessTimeline("chart-requests", reqData.requests || []);
    C.renderRecordVerificationHistory(
      "chart-verifications",
      logData.logs || []
    );
  }

  if (list) {
    list.innerHTML = "";
    if (!recRes.ok) {
      list.innerHTML = `<li class="status-bad">Records: ${recRes.status}</li>`;
      return;
    }
    for (const rec of recData.records || []) {
      const li = document.createElement("li");
      li.textContent = `${rec.title || rec.id} — patient ${rec.patientId || ""}`;
      list.appendChild(li);
    }
  }
}

loadDashboard();
