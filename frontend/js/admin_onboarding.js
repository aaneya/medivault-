import { auth, getAuthHeader } from "./app.js";

let rejectUid = null;

async function load() {
  const box = document.getElementById("admin-list");
  const msg = document.getElementById("admin-msg");
  if (!auth.currentUser) {
    msg.textContent = "Sign in as admin.";
    return;
  }
  try {
    const h = await getAuthHeader();
    const r = await fetch("/api/admin/onboarding/pending", { headers: h });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.statusText);
    const items = j.submissions || [];
    box.innerHTML = "";
    items.forEach((s) => {
      const uid = s.uid || s.id;
      const div = document.createElement("div");
      div.className = "admin-row card";
      div.innerHTML = `
        <h3>${s.fullName || uid}</h3>
        <p>License: ${s.licenseNumber || "—"} · ${s.hospital || "—"} · ${s.specialty || "—"}</p>
        <p>
          <a href="${s.licenseDocRef_url || "#"}" target="_blank" rel="noopener">License</a>
          · <a href="${s.idDocRef_url || "#"}" target="_blank" rel="noopener">ID</a>
          · <a href="${s.selfieRef_url || "#"}" target="_blank" rel="noopener">Selfie</a>
        </p>
        <button type="button" class="btn-approve" data-uid="${uid}">Approve</button>
        <button type="button" class="btn-reject" data-uid="${uid}">Reject</button>
      `;
      box.appendChild(div);
    });
    box.querySelectorAll(".btn-approve").forEach((b) => {
      b.addEventListener("click", () => review(b.dataset.uid, "approve"));
    });
    box.querySelectorAll(".btn-reject").forEach((b) => {
      b.addEventListener("click", () => openReject(b.dataset.uid));
    });
  } catch (e) {
    msg.textContent = e.message || String(e);
  }
}

async function review(uid, action, rejectionReason) {
  const msg = document.getElementById("admin-msg");
  try {
    const h = {
      ...(await getAuthHeader()),
      "Content-Type": "application/json",
    };
    const body = { action };
    if (action === "reject") body.rejectionReason = rejectionReason || "No reason";
    const r = await fetch(`/api/admin/onboarding/${uid}/review`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.statusText);
    if (msg) msg.textContent = "";
    load();
  } catch (e) {
    if (msg) msg.textContent = e.message || String(e);
  }
}

function openReject(uid) {
  rejectUid = uid;
  document.getElementById("reject-modal").style.display = "flex";
}

document.getElementById("reject-confirm")?.addEventListener("click", async () => {
  const reason = document.getElementById("reject-reason").value;
  document.getElementById("reject-modal").style.display = "none";
  if (rejectUid) await review(rejectUid, "reject", reason);
});

document.getElementById("reject-cancel")?.addEventListener("click", () => {
  document.getElementById("reject-modal").style.display = "none";
});

load();
