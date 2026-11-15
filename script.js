"use strict";
/* ---------- Sample data (demo only) ---------- */
const MENTORS = [
  {id:1,name:"Pawan Agrawal",role:"Software Engineer",company:"Northwind Labs",year:2016,field:"Technology",topics:["Interviews","Internships","Resumes"],formats:["Video call","Chat"],avail:"This week",rating:4.9,skills:["Python","System design"],bio:"Moved from a campus coding club to a product team. Happy to share how I prepared for technical interviews.",why:"You set a goal to land a tech internship."},
  {id:2,name:"Vaibhav Dubey",role:"Financial Analyst",company:"Harbor Capital",year:2018,field:"Finance",topics:["Resumes","Career exploration"],formats:["Video call","In person"],avail:"This month",rating:4.7,skills:["Excel","Valuation"],bio:"Started in accounting and switched into investment analysis. I can help you read finance job posts.",why:"You saved a finance resume guide."},
  {id:3,name:"Shivam Satyavadi",role:"UX Designer",company:"Brightline Studio",year:2019,field:"Design",topics:["Portfolios","Interviews"],formats:["Video call","Chat"],avail:"This week",rating:4.8,skills:["Figma","User research"],bio:"I review portfolios and help students tell clear case-study stories.",why:""},
  {id:4,name:"Dr. Tejinder Singh",role:"Public Health Researcher",company:"Meridian Health",year:2012,field:"Healthcare",topics:["Grad school","Career exploration"],formats:["In person","Video call"],avail:"This month",rating:4.9,skills:["Data analysis","Research writing"],bio:"Walks students through grad school choices and research careers.",why:""},
  {id:5,name:"Sujal Agrawal",role:"Brand Manager",company:"Lumen Brands",year:2015,field:"Marketing",topics:["Internships","Portfolios","Resumes"],formats:["Chat","Video call"],avail:"Waitlist",rating:4.6,skills:["Branding","Social media"],bio:"Shares how to stand out for marketing internships with real campaign examples.",why:""},
  {id:6,name:"Pawan Singh",role:"Civil Engineer",company:"Arcadia Engineering",year:2014,field:"Engineering",topics:["Career exploration","Interviews"],formats:["In person","Chat"],avail:"This week",rating:4.7,skills:["AutoCAD","Project management"],bio:"Talks about licensing, site work and moving into project leadership.",why:""}
];
const RESOURCES = [
  {id:1,title:"One-page resume checklist",cat:"Resumes",type:"Checklist",sum:"Check layout, action verbs and results before you send your resume.",tips:["Lead each bullet with a verb","Add numbers where you can","Keep it to one page"]},
  {id:2,title:"Resume templates for first-time applicants",cat:"Resumes",type:"Template",sum:"Clean templates for students with limited work experience.",tips:["Put projects above unrelated jobs","Use a simple font"]},
  {id:3,title:"Common interview questions and how to answer",cat:"Interviews",type:"Guide",sum:"Practise the STAR method on the 12 questions interviewers ask most.",tips:["Write 3 stories you can reuse","Practise out loud"]},
  {id:4,title:"Finding your first internship",cat:"Internships",type:"Guide",sum:"Where to look, when to apply and how to follow up politely.",tips:["Start 4 months early","Ask alumni for referrals"]},
  {id:5,title:"Portfolio case study walkthrough",cat:"Portfolios",type:"Video",sum:"A 15-minute talk on structuring a project so reviewers see your thinking.",tips:["Show the problem first","Explain your own role"]},
  {id:6,title:"Which career fits me? Self-assessment",cat:"Career exploration",type:"Guide",sum:"Reflect on interests, strengths and values, then list roles to explore.",tips:["Pick three roles to research","Talk to one alum per role"]}
];
const EVENTS = [
  {id:1,title:"Alumni talk: From campus to product team",type:"Alumni talk",date:"2026-11-12",format:"Online",topic:"Technology careers",who:"Priya Nair"},
  {id:2,title:"Open Q&A: Is grad school right for me?",type:"Q&A session",date:"2026-11-19",format:"In person",topic:"Grad school",who:"Dr. Rohan Mehta"},
  {id:3,title:"Mock interview night",type:"Mock interviews",date:"2026-11-26",format:"Online",topic:"Interview practice",who:"Alumni panel"}
];
const TIMES = ["10:00 AM","2:00 PM","4:30 PM"];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const daysFromNow = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const nice = s => new Date(s + "T00:00").toLocaleDateString(undefined, {weekday:"short", month:"short", day:"numeric", year:"numeric"});
const mentor = id => MENTORS.find(m => m.id == id);
const initials = n => n.replace("Dr. ", "").split(" ").map(w => w[0]).join("");
const avatar = m => `<span class="av c${m.id % 4}" aria-hidden="true">${initials(m.name)}</span>`;

// Safe localStorage: returns fallback on missing/invalid/wrong-type data
function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) === Array.isArray(fallback) && v !== null ? v : fallback;
  } catch { return fallback; }
}
function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ } }

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}

/* ---------- State ---------- */
const seedSessions = [
  {id:"s1", mentorId:2, topic:"Resumes", format:"Video call", date:daysFromNow(6), time:"2:00 PM", status:"Accepted", note:""},
  {id:"s2", mentorId:1, topic:"Interviews", format:"Video call", date:daysFromNow(-5), time:"10:00 AM", status:"Completed", note:""}
];
const seedGoals = [
  {id:"g1", text:"Update portfolio", done:false},
  {id:"g2", text:"Practice interview answers", done:false},
  {id:"g3", text:"Email two alumni mentors", done:true}
];
let saved = load("cc_saved", []).filter(n => typeof n === "number");
let sessions = load("cc_sessions", seedSessions).filter(s => s && mentor(s.mentorId) && s.date);
let regs = load("cc_regs", []);
let goals = load("cc_goals", seedGoals).filter(g => g && typeof g.text === "string");
let feedback = load("cc_fb", []);

/* ---------- Dialog ---------- */
const dlg = $("#dlg");
function openDlg(html) {
  $("#dlgBody").innerHTML = html;
  if (!dlg.open) dlg.showModal();
}
$("#dlgX").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); // click on backdrop

/* ---------- Mentors ---------- */
function fillSelect(id, label, values) {
  $(id).innerHTML = `<option value="">${label}</option>` + values.map(v => `<option>${v}</option>`).join("");
}
const uniq = a => [...new Set(a)].sort();
fillSelect("#fField", "All fields", uniq(MENTORS.map(m => m.field)));
fillSelect("#fTopic", "All topics", uniq(MENTORS.flatMap(m => m.topics)));
fillSelect("#fFormat", "Any format", uniq(MENTORS.flatMap(m => m.formats)));
fillSelect("#fAvail", "Any availability", uniq(MENTORS.map(m => m.avail)));

function mentorCard(m) {
  const isSaved = saved.includes(m.id);
  return `<article class="card mentor">
    <div class="top">${avatar(m)}<div><h3>${m.name}</h3><p class="muted">${m.role}, ${m.company}</p><p class="muted">Class of ${m.year}</p></div></div>
    <p>${m.bio}</p>
    <p class="tags">${m.topics.map(t => `<span>${t}</span>`).join("")}</p>
    <p class="meta"><span class="star"><span aria-hidden="true">★</span> ${m.rating} <span class="sr">out of 5</span></span><span>Availability: ${m.avail}</span></p>
    ${m.why ? `<p class="why"><strong>Suggested for you:</strong> ${m.why}</p>` : ""}
    <div class="row"><button class="btn sm" data-view="${m.id}">View profile<span class="sr"> of ${m.name}</span></button>
    <button class="btn ghost sm" data-save="${m.id}" aria-pressed="${isSaved}">${isSaved ? "Saved ✓" : "Save mentor"}<span class="sr"> ${m.name}</span></button></div>
  </article>`;
}

function renderMentors() {
  const words = $("#q").value.toLowerCase().split(/\s+/).filter(Boolean);
  const f = {field:$("#fField").value, topic:$("#fTopic").value, format:$("#fFormat").value, avail:$("#fAvail").value};
  const list = MENTORS.filter(m => {
    const hay = [m.name, m.role, m.company, m.field, ...m.topics, ...m.skills].join(" ").toLowerCase();
    return words.every(w => hay.includes(w)) && (!f.field || m.field === f.field) && (!f.topic || m.topics.includes(f.topic)) &&
      (!f.format || m.formats.includes(f.format)) && (!f.avail || m.avail === f.avail);
  });
  $("#grid").innerHTML = list.map(mentorCard).join("");
  $("#empty").hidden = list.length > 0;
  $("#count").textContent = `Showing ${list.length} of ${MENTORS.length} mentors`;
}
$("#filters").addEventListener("input", renderMentors);
$("#filters").addEventListener("reset", () => setTimeout(renderMentors, 0));
$("#filters").addEventListener("submit", e => e.preventDefault());

// Hero spotlight
(function () {
  const m = MENTORS[0];
  $("#spot").innerHTML = `<h2 class="sr">Mentor spotlight</h2><div class="top">${avatar(m)}<div><h3>${m.name}</h3><p class="muted">${m.role}, ${m.company}</p></div></div>
  <p>“I wish someone had walked me through my first interview. Now I get to.”</p>
  <p class="meta"><span class="star"><span aria-hidden="true">★</span> ${m.rating}</span><span>Available ${m.avail.toLowerCase()}</span></p>
  <button class="btn sm" data-view="${m.id}">View profile<span class="sr"> of ${m.name}</span></button>`;
})();

function profile(id) {
  const m = mentor(id);
  openDlg(`<div class="top">${avatar(m)}<div><h2 id="dlgTitle">${m.name}</h2><p class="muted">${m.role}, ${m.company} · Class of ${m.year}</p></div></div>
  <p>${m.bio}</p>
  <dl><dt>Field</dt><dd>${m.field}</dd><dt>Guidance on</dt><dd>${m.topics.join(", ")}</dd><dt>Skills</dt><dd>${m.skills.join(", ")}</dd>
  <dt>Formats</dt><dd>${m.formats.join(", ")}</dd><dt>Availability</dt><dd>${m.avail}</dd><dt>Rating</dt><dd class="star">★ ${m.rating} / 5</dd></dl>
  ${m.why ? `<p class="why"><strong>Why suggested:</strong> ${m.why}</p>` : ""}
  <p class="row"><button class="btn" data-book="${m.id}">Request a session</button><button class="btn ghost" data-save="${m.id}">${saved.includes(m.id) ? "Unsave mentor" : "Save mentor"}</button></p>`);
}

function toggleSave(id) {
  const m = mentor(id);
  if (saved.includes(+id)) { saved = saved.filter(x => x !== +id); toast(`${m.name} removed from saved mentors.`); }
  else { saved.push(+id); toast(`${m.name} saved to your dashboard.`); }
  store("cc_saved", saved); renderMentors(); renderDash();
  if (dlg.open && $("#dlgBody [data-save]")) profile(id);
}

/* ---------- Booking flow ---------- */
let B = {};
function bookForm(id, errs = {}) {
  const m = mentor(id);
  const err = k => errs[k] ? `<span class="err" id="e-${k}">${errs[k]}</span>` : "";
  const inv = k => errs[k] ? `aria-invalid="true" aria-describedby="e-${k}"` : "";
  const opt = (arr, cur) => `<option value="">Select…</option>` + arr.map(v => `<option ${v === cur ? "selected" : ""}>${v}</option>`).join("");
  openDlg(`<h2 id="dlgTitle">Request a session with ${m.name}</h2>
  <p class="note">Demo only: booking is simulated and no request is sent to a real mentor.</p>
  <form id="bf" novalidate>
    <label for="bTopic">Topic</label><select id="bTopic" ${inv("topic")}>${opt(m.topics, B.topic)}</select>${err("topic")}
    <label for="bFormat">Meeting format</label><select id="bFormat" ${inv("format")}>${opt(m.formats, B.format)}</select>${err("format")}
    <label for="bDate">Preferred date</label><input id="bDate" type="date" min="${iso(new Date())}" value="${B.date || ""}" ${inv("date")}>${err("date")}
    <label for="bTime">Preferred time</label><select id="bTime" ${inv("time")}>${opt(TIMES, B.time)}</select>${err("time")}
    <label for="bNote">Short note (optional, max 200 characters)</label><textarea id="bNote" rows="3" maxlength="200">${esc(B.note || "")}</textarea>
    <p class="row"><button class="btn">Review request</button><button type="button" class="btn ghost" data-close>Cancel</button></p>
  </form>`);
  $("#bf").addEventListener("submit", e => {
    e.preventDefault();
    B = {id, topic:$("#bTopic").value, format:$("#bFormat").value, date:$("#bDate").value, time:$("#bTime").value, note:$("#bNote").value.trim()};
    const errs2 = {};
    if (!B.topic) errs2.topic = "Choose a topic.";
    if (!B.format) errs2.format = "Choose a meeting format.";
    if (!B.date) errs2.date = "Pick a date.";
    else if (B.date < iso(new Date())) errs2.date = "Choose today or a future date.";
    if (!B.time) errs2.time = "Choose a time.";
    if (Object.keys(errs2).length) { bookForm(id, errs2); $("[aria-invalid=true]").focus(); }
    else bookReview();
  });
  $("#bTopic").focus();
}
function bookReview() {
  const m = mentor(B.id);
  openDlg(`<h2 id="dlgTitle">Review your request</h2>
  <dl><dt>Mentor</dt><dd>${m.name}</dd><dt>Topic</dt><dd>${B.topic}</dd><dt>Format</dt><dd>${B.format}</dd><dt>When</dt><dd>${nice(B.date)}, ${B.time}</dd><dt>Note</dt><dd>${B.note ? esc(B.note) : "None"}</dd></dl>
  <p class="note">Status after sending: <span class="badge Pending">Pending</span> until the mentor accepts (simulated).</p>
  <p class="row"><button class="btn" id="confirmBook">Confirm request</button><button class="btn ghost" id="backBook">Edit details</button></p>`);
  $("#backBook").addEventListener("click", () => bookForm(B.id));
  $("#confirmBook").addEventListener("click", () => {
    sessions.push({id:"s" + Date.now(), mentorId:B.id, topic:B.topic, format:B.format, date:B.date, time:B.time, status:"Pending", note:B.note});
    store("cc_sessions", sessions); renderDash(); renderFb();
    openDlg(`<h2 id="dlgTitle">Request sent (demo)</h2><p class="ok">Your session request with ${m.name} was added to your dashboard as Pending.</p>
    <p class="row"><a class="btn" href="#dashboard" data-close>See dashboard</a><button class="btn ghost" data-close>Close</button></p>`);
    B = {};
  });
}

/* ---------- Dashboard ---------- */
function renderDash() {
  const up = sessions.filter(s => s.status !== "Completed").sort((a, b) => a.date.localeCompare(b.date));
  $("#sessions").innerHTML = up.length ? up.map(s => `<li><span><strong>${mentor(s.mentorId).name}</strong><br>${s.topic} · ${s.format}<br>${nice(s.date)}, ${s.time}</span>
    <span><span class="badge ${s.status}">${s.status}</span> <button class="btn ghost sm" data-cancel="${s.id}">Cancel<span class="sr"> session with ${mentor(s.mentorId).name}</span></button></span></li>`).join("")
    : `<li class="empty">No upcoming sessions yet. <a href="#mentors">Find a mentor</a> to book your first one.</li>`;
  $("#saved").innerHTML = saved.length ? saved.map(id => { const m = mentor(id); return m ? `<li><span><strong>${m.name}</strong><br>${m.role}</span>
    <span><button class="btn sm" data-view="${m.id}">View</button> <button class="btn ghost sm" data-save="${m.id}">Remove<span class="sr"> ${m.name}</span></button></span></li>` : ""; }).join("")
    : `<li class="empty">No saved mentors. Choose “Save mentor” on any profile to keep them here.</li>`;
  renderGoals();
}
document.addEventListener("click", e => {
  const c = e.target.closest("[data-cancel]");
  if (!c) return;
  sessions = sessions.filter(s => s.id !== c.dataset.cancel);
  store("cc_sessions", sessions); renderDash(); renderFb(); toast("Session cancelled.");
});

/* ---------- Goals ---------- */
function renderGoals() {
  $("#goals").innerHTML = goals.length ? goals.map(g => `<li class="${g.done ? "done" : ""}"><label><input type="checkbox" data-goal="${g.id}" ${g.done ? "checked" : ""}><span>${esc(g.text)}</span></label>
    <button class="btn ghost sm" data-rmgoal="${g.id}">Remove<span class="sr"> ${esc(g.text)}</span></button></li>`).join("")
    : `<li class="empty">No action items. Add one below, such as “Update portfolio”.</li>`;
  const done = goals.filter(g => g.done).length, pct = goals.length ? Math.round(done / goals.length * 100) : 0;
  document.querySelectorAll(".prog").forEach(p => p.textContent = `${done} of ${goals.length} action items complete (${pct}%)`);
  document.querySelectorAll(".bar2").forEach(b => b.value = pct);
}
$("#goalForm").addEventListener("submit", e => {
  e.preventDefault();
  const t = $("#goalIn").value.trim();
  if (!t) return;
  goals.push({id:"g" + Date.now(), text:t, done:false});
  store("cc_goals", goals); $("#goalIn").value = ""; renderGoals(); toast("Action item added.");
});
$("#goals").addEventListener("change", e => {
  const g = goals.find(x => x.id === e.target.dataset.goal);
  if (g) { g.done = e.target.checked; store("cc_goals", goals); renderGoals(); toast(g.done ? "Nice work! Marked complete." : "Marked as not done."); }
});
$("#goals").addEventListener("click", e => {
  const b = e.target.closest("[data-rmgoal]");
  if (b) { goals = goals.filter(x => x.id !== b.dataset.rmgoal); store("cc_goals", goals); renderGoals(); toast("Action item removed."); }
});

/* ---------- Resources ---------- */
fillSelect("#rCat", "All categories", uniq(RESOURCES.map(r => r.cat)));
function renderRes() {
  const q = $("#rq").value.toLowerCase().trim(), cat = $("#rCat").value;
  const list = RESOURCES.filter(r => (!cat || r.cat === cat) && (r.title + r.sum + r.cat + r.type).toLowerCase().includes(q));
  $("#rGrid").innerHTML = list.map(r => `<article class="card mentor"><p class="tags"><span>${r.cat}</span><span>${r.type}</span></p><h3>${r.title}</h3><p>${r.sum}</p>
    <div class="row"><button class="btn sm" data-res="${r.id}">Open resource<span class="sr">: ${r.title}</span></button></div></article>`).join("")
    || `<div class="empty"><h3>No resources found</h3><p>Try another keyword or choose “All categories”.</p></div>`;
  $("#rCount").textContent = `${list.length} resource${list.length === 1 ? "" : "s"} shown`;
}
$("#rq").addEventListener("input", renderRes);
$("#rCat").addEventListener("change", renderRes);

/* ---------- Events ---------- */
function renderEvents() {
  $("#eGrid").innerHTML = EVENTS.map(ev => {
    const r = regs.includes(ev.id);
    return `<article class="card mentor"><p class="tags"><span>${ev.type}</span><span>${ev.format}</span></p><h3>${ev.title}</h3>
    <p>${nice(ev.date)}<br>Topic: ${ev.topic}<br>With: ${ev.who}</p>
    <div class="row"><button class="btn ${r ? "ghost" : ""} sm" data-reg="${ev.id}" aria-pressed="${r}">${r ? "Registered ✓ (cancel)" : "Register"}<span class="sr"> for ${ev.title}</span></button></div></article>`;
  }).join("");
}

/* ---------- Feedback ---------- */
$("#stars").innerHTML = [5, 4, 3, 2, 1].map(n => `<input type="radio" name="rate" id="st${n}" value="${n}"><label for="st${n}" title="${n} star${n > 1 ? "s" : ""}"><span aria-hidden="true">★</span><span class="sr">${n} star${n > 1 ? "s" : ""}</span></label>`).join("");
function renderFb() {
  const done = sessions.filter(s => s.status === "Completed");
  $("#fbSession").innerHTML = done.length ? done.map(s => `<option value="${s.id}">${mentor(s.mentorId).name} – ${s.topic} (${nice(s.date)})</option>`).join("") : `<option value="">No completed sessions yet</option>`;
}
$("#fbForm").addEventListener("submit", e => {
  e.preventDefault();
  const r = document.querySelector("input[name=rate]:checked"), sid = $("#fbSession").value;
  if (!sid) { $("#fbErr").textContent = "Complete a session first to leave feedback."; return; }
  if (!r) { $("#fbErr").textContent = "Choose a star rating before saving."; return; }
  $("#fbErr").textContent = "";
  feedback = feedback.filter(f => f.sessionId !== sid);
  feedback.push({sessionId:sid, rating:+r.value, comment:$("#fbText").value.trim()});
  store("cc_fb", feedback);
  $("#fbMsg").textContent = `Thank you! Your ${r.value}-star feedback was saved (demo, stored in this browser only).`;
  toast("Feedback saved.");
});

/* ---------- Global click handling ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-view],[data-save],[data-book],[data-res],[data-reg],[data-demo],[data-close]");
  if (!t) return;
  if (t.dataset.view) profile(t.dataset.view);
  else if (t.dataset.save) toggleSave(t.dataset.save);
  else if (t.dataset.book) { B = {}; bookForm(+t.dataset.book); }
  else if (t.dataset.res) {
    const r = RESOURCES.find(x => x.id == t.dataset.res);
    openDlg(`<h2 id="dlgTitle">${r.title}</h2><p class="tags"><span>${r.cat}</span><span>${r.type}</span></p><p>${r.sum}</p><h3>Key tips</h3><ul>${r.tips.map(x => `<li>${x}</li>`).join("")}</ul>
    <p class="row"><button class="btn" data-demo="Download is simulated in this demo.">Save a copy</button><button class="btn ghost" data-close>Close</button></p>`);
  }
  else if (t.dataset.reg) {
    const id = +t.dataset.reg, ev = EVENTS.find(x => x.id === id);
    if (regs.includes(id)) { regs = regs.filter(x => x !== id); toast(`Registration cancelled for “${ev.title}”.`); }
    else { regs.push(id); toast(`You are registered for “${ev.title}” (simulated).`); }
    store("cc_regs", regs); renderEvents();
  }
  else if (t.dataset.demo) toast(t.dataset.demo);
  if ("close" in t.dataset) dlg.close();
});

/* ---------- Mobile menu ---------- */
const links = $("#links"), menuBtn = $("#menuBtn");
function setMenu(open) { links.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); }
menuBtn.addEventListener("click", () => setMenu(!links.classList.contains("open")));
links.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); }); // dialog handles Escape natively

/* ---------- Init ---------- */
renderMentors(); renderDash(); renderRes(); renderEvents(); renderFb();
