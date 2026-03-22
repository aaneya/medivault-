import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const cfg = window.__FIREBASE_CONFIG__ || {};
const app = initializeApp(cfg);
export const auth = getAuth(app);

export async function getAuthHeader() {
  const u = auth.currentUser;
  if (!u) throw new Error("Not signed in");
  const token = await u.getIdToken(true);
  return { Authorization: `Bearer ${token}` };
}

export async function establishServerSession() {
  const u = auth.currentUser;
  if (!u) return;
  const token = await u.getIdToken(true);
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ idToken: token }),
  });
}

export function initLoginPage() {
  const btn = document.getElementById("signin");
  const msg = document.getElementById("msg");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await establishServerSession();
      msg.textContent = "Signed in. Session established. You can open /dashboard.";
      msg.className = "status-ok";
    } catch (e) {
      msg.textContent = e.message || String(e);
      msg.className = "status-bad";
    }
  });
}

onAuthStateChanged(auth, async (user) => {
  const el = document.getElementById("auth-state");
  if (el) {
    el.textContent = user ? `Signed in as ${user.email}` : "Not signed in";
  }
  if (user) {
    try {
      await establishServerSession();
    } catch (_) {
      /* ignore */
    }
  }
});

initLoginPage();
