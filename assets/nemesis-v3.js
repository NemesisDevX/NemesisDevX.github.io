/* NEMESIS / ENGINEERING — progressive enhancement, no dependencies. */
(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const boot = byId("boot");
  const skip = byId("boot-skip");
  const lines = byId("boot-lines");
  const progress = byId("boot-bar");
  const percent = byId("boot-percent");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = false;
  let cancelled = false;
  let lastFocus = null;
  const reduced = () => reduceMotion.matches;
  const saveSeen = () => { try { sessionStorage.setItem("nemesis-intro-v3", "1"); } catch (_) {} };
  const seen = () => { try { return sessionStorage.getItem("nemesis-intro-v3") === "1"; } catch (_) { return false; } };
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  function hideBoot() {
    if (!boot || !active) return;
    cancelled = true;
    active = false;
    saveSeen();
    boot.classList.add("leave");
    document.body.classList.remove("lock-scroll");
    for (const selector of ["main", "header", "footer"]) {
      const el = document.querySelector(selector);
      if (el) el.inert = false;
    }
    window.setTimeout(() => {
      boot.hidden = true;
      boot.classList.remove("leave");
      if (lastFocus && lastFocus !== skip && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
      else byId("main")?.focus({ preventScroll: true });
    }, reduced() ? 0 : 590);
  }
  async function typeLine(content, n, total) {
    if (cancelled || !lines) return;
    const node = document.createElement("div");
    node.className = "boot-line";
    const span = document.createElement("span");
    node.append(span);
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    node.append(cursor);
    lines.append(node);
    for (let i = 0; i < content.length; i++) {
      if (cancelled) break;
      span.textContent += content[i];
      const count = Math.min(99, Math.round(((n + (i + 1) / content.length) / total) * 100));
      if (progress) progress.style.width = count + "%";
      if (percent) percent.textContent = count + "%";
      await wait(content[i] === "." ? 94 : content[i] === " " ? 13 : 25);
    }
    cursor.remove();
    if (!cancelled) await wait(145);
  }
  async function openBoot(force = false) {
    if (!boot || active || reduced() || (!force && seen())) return;
    cancelled = false;
    active = true;
    lastFocus = document.activeElement;
    boot.hidden = false;
    boot.classList.remove("leave");
    document.body.classList.add("lock-scroll");
    for (const selector of ["main", "header", "footer"]) {
      const el = document.querySelector(selector);
      if (el) el.inert = true;
    }
    if (lines) lines.textContent = "";
    if (progress) progress.style.width = "0%";
    if (percent) percent.textContent = "0%";
    skip?.focus({ preventScroll: true });
    const messages = [
      "> INITIALIZING / NEMESIS ENGINEERING",
      "> LOADING CODE, TESTS & REVIEW HISTORY ... OK",
      "> VERIFYING 08 UPSTREAM MERGES ... CONFIRMED",
      "> ACCESS GRANTED. ENGINEERING THAT HOLDS UP."
    ];
    try {
      for (let i = 0; i < messages.length; i++) {
        if (cancelled) return;
        await typeLine(messages[i], i, messages.length);
      }
      if (cancelled) return;
      if (progress) progress.style.width = "100%";
      if (percent) percent.textContent = "100% / READY";
      await wait(690);
      if (!cancelled) hideBoot();
    } catch (_) {
      hideBoot();
    }
  }
  skip?.addEventListener("click", hideBoot);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && active) hideBoot();
  });
  document.querySelectorAll("[data-replay-intro]").forEach((btn) => {
    btn.addEventListener("click", () => openBoot(true));
  });
  if (!reduced() && !seen()) openBoot();
  if (!reduced() && "IntersectionObserver" in window) {
    const revealNodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver((entries, io) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    revealNodes.forEach((el) => { el.classList.add("reveal-ready"); observer.observe(el); });
  }
})();