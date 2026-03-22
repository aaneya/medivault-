import { getAuthHeader } from "./app.js";

function showStep(n) {
  document.querySelectorAll(".step-panel").forEach((p) => {
    p.classList.toggle("active", p.dataset.panel === String(n));
  });
  document.querySelectorAll(".onboarding-steps .step").forEach((s) => {
    const sn = parseInt(s.dataset.step, 10);
    s.classList.remove("active", "completed");
    if (sn < n) s.classList.add("completed");
    if (sn === n) s.classList.add("active");
  });
}

async function uploadDoc(file, docType) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("docType", docType);
  const h = await getAuthHeader();
  const r = await fetch("/api/onboarding/upload-doc", {
    method: "POST",
    headers: h,
    body: fd,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j.storageRef;
}

function wireUploadZones() {
  document.querySelectorAll(".doc-upload-zone").forEach((zone) => {
    const target = zone.dataset.target;
    const input = zone.querySelector('input[type="file"]');
    if (!input) return;
    zone.addEventListener("click", () => input.click());
    input.addEventListener("change", async () => {
      const f = input.files?.[0];
      if (!f) return;
      const st = document.getElementById(`status-${target}`);
      try {
        st.textContent = "Uploading…";
        const ref = await uploadDoc(f, target === "license" ? "license" : "id");
        if (target === "license") {
          document.getElementById("ref-license").value = ref;
        } else {
          document.getElementById("ref-id").value = ref;
        }
        zone.classList.add("uploaded");
        st.textContent = "Uploaded";
      } catch (e) {
        st.textContent = e.message || String(e);
      }
    });
  });
}

function wireCamera() {
  const video = document.getElementById("selfie-video");
  const canvas = document.getElementById("selfie-canvas");
  const preview = document.getElementById("selfie-preview");
  const btnCam = document.getElementById("btn-camera");
  const btnCap = document.getElementById("btn-capture");
  const btnRet = document.getElementById("btn-retake");
  const fileSelfie = document.getElementById("file-selfie");

  btnCam?.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.style.display = "block";
      if (btnCap) btnCap.style.display = "inline-block";
    } catch (e) {
      alert("Camera unavailable: " + e.message);
    }
  });

  btnCap?.addEventListener("click", async () => {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const f = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      try {
        const ref = await uploadDoc(f, "selfie");
        document.getElementById("ref-selfie").value = ref;
        preview.src = URL.createObjectURL(blob);
        preview.style.display = "block";
        btnRet.style.display = "inline-block";
        document.getElementById("status-selfie").textContent = "Uploaded";
      } catch (e) {
        document.getElementById("status-selfie").textContent = e.message;
      }
    }, "image/jpeg", 0.92);
  });

  btnRet?.addEventListener("click", () => {
    preview.style.display = "none";
    document.getElementById("ref-selfie").value = "";
  });

  fileSelfie?.addEventListener("change", async () => {
    const f = fileSelfie.files?.[0];
    if (!f) return;
    try {
      const ref = await uploadDoc(f, "selfie");
      document.getElementById("ref-selfie").value = ref;
      preview.src = URL.createObjectURL(f);
      preview.style.display = "block";
      document.getElementById("status-selfie").textContent = "Uploaded";
    } catch (e) {
      document.getElementById("status-selfie").textContent = e.message;
    }
  });
}

function collectForm() {
  const form = document.getElementById("onboarding-form");
  const fd = new FormData(form);
  return {
    fullName: fd.get("fullName"),
    licenseNumber: fd.get("licenseNumber"),
    specialty: fd.get("specialty"),
    hospital: fd.get("hospital"),
    hospitalAddress: fd.get("hospitalAddress"),
    hospitalPhone: fd.get("hospitalPhone"),
    yearsExperience: parseInt(fd.get("yearsExperience"), 10),
    licenseDocRef: document.getElementById("ref-license").value,
    idDocRef: document.getElementById("ref-id").value,
    selfieRef: document.getElementById("ref-selfie").value,
  };
}

function fillReview() {
  const d = collectForm();
  const el = document.getElementById("review-summary");
  el.innerHTML = `<pre class="review-pre">${JSON.stringify(d, null, 2)}</pre>`;
}

document.querySelectorAll(".btn-next").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = btn.dataset.next;
    showStep(parseInt(next, 10));
    if (next === "4") fillReview();
  });
});

document.getElementById("btn-submit-onboarding")?.addEventListener("click", async () => {
  const msg = document.getElementById("onboarding-msg");
  if (!document.getElementById("certify-check")?.checked) {
    msg.textContent = "Please certify the form.";
    return;
  }
  const body = collectForm();
  for (const k of Object.keys(body)) {
    const v = body[k];
    if (v === "" || v === null || v === undefined) {
      msg.textContent = `Missing: ${k}`;
      return;
    }
  }
  if (Number.isNaN(body.yearsExperience)) {
    msg.textContent = "Invalid years of experience";
    return;
  }
  try {
    const h = {
      ...(await getAuthHeader()),
      "Content-Type": "application/json",
    };
    const r = await fetch("/api/onboarding/submit", {
      method: "POST",
      headers: h,
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.statusText);
    msg.textContent =
      "Your application is under review. You will be notified within 24–48 hours.";
    msg.className = "status-ok";
  } catch (e) {
    msg.textContent = e.message || String(e);
    msg.className = "status-bad";
  }
});

if (document.getElementById("onboarding-form")) {
  wireUploadZones();
  wireCamera();
}
