// 데이터 퀴즈 앱 — 카테고리 → 모드(연습/스피드/힌트) → 문제 → 결과
const TIME_LIMIT = 15;     // 스피드 모드 문항당 제한 시간(초)
const HINT_SCORE = 0.5;    // 힌트를 쓰고 맞힌 문항 점수

const state = {
  category: null,
  mode: null,          // "practice" | "speed" | "hint"
  list: [],            // 이번에 푸는 문항들
  index: 0,
  records: [],         // { q, picked, correct, timeout, usedHint, score }
  answered: false,
  usedHint: false,
  timerId: null,
  remaining: TIME_LIMIT
};

const MODE_NAMES = { practice: "연습", speed: "스피드", hint: "힌트" };
const $ = (id) => document.getElementById(id);

function show(screenId) {
  ["screen-category", "screen-mode", "screen-quiz", "screen-result"].forEach((id) =>
    $(id).classList.toggle("hidden", id !== screenId)
  );
}

// ── 1. 카테고리 ──
function renderCategories() {
  const cats = [...new Set(QUESTIONS.map((q) => q.category))];
  const box = $("category-list");
  box.innerHTML = "";
  cats.forEach((c) => {
    const n = QUESTIONS.filter((q) => q.category === c).length;
    const b = document.createElement("button");
    b.className = "btn";
    b.innerHTML = `${c}<small>${n}문항</small>`;
    b.onclick = () => { state.category = c; $("mode-category").textContent = `카테고리: ${c}`; show("screen-mode"); };
    box.appendChild(b);
  });
  show("screen-category");
}

// ── 2. 모드 ──
document.querySelectorAll(".mode-btn").forEach((b) =>
  b.addEventListener("click", () => {
    state.mode = b.dataset.mode;
    startQuiz(QUESTIONS.filter((q) => q.category === state.category));
  })
);
$("back-to-category").onclick = renderCategories;

// ── 3. 문제 ──
function startQuiz(list) {
  state.list = list;
  state.index = 0;
  state.records = [];
  $("quiz-mode-label").textContent = `${MODE_NAMES[state.mode]} 모드`;
  show("screen-quiz");
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  const q = state.list[state.index];
  state.answered = false;
  state.usedHint = false;
  $("quiz-progress").textContent = `${state.index + 1} / ${state.list.length}`;
  $("question-text").textContent = q.question;
  $("feedback").classList.add("hidden");
  $("next-btn").classList.add("hidden");

  const box = $("choices");
  box.innerHTML = "";
  q.choices.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "btn choice";
    b.textContent = `${i + 1}. ${text}`;
    b.dataset.index = i;
    b.onclick = () => answer(i);
    box.appendChild(b);
  });

  const hintBtn = $("hint-btn");
  hintBtn.classList.toggle("hidden", state.mode !== "hint");
  hintBtn.disabled = false;

  $("timer").classList.toggle("hidden", state.mode !== "speed");
  if (state.mode === "speed") startTimer();
}

function startTimer() {
  state.remaining = TIME_LIMIT;
  updateTimer();
  state.timerId = setInterval(() => {
    state.remaining -= 1;
    updateTimer();
    if (state.remaining <= 0) { stopTimer(); answer(null, true); }
  }, 1000);
}
function updateTimer() {
  $("timer-value").textContent = state.remaining;
  $("timer").classList.toggle("danger", state.remaining <= 5);
}
function stopTimer() {
  if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
}

// 힌트: 오답 2개를 지운다
$("hint-btn").onclick = () => {
  if (state.answered || state.usedHint) return;
  const q = state.list[state.index];
  const wrong = q.choices.map((_, i) => i).filter((i) => i !== q.answer);
  wrong.sort(() => Math.random() - 0.5).slice(0, 2).forEach((i) => {
    const b = document.querySelector(`.choice[data-index="${i}"]`);
    b.classList.add("removed");
    b.disabled = true;
  });
  state.usedHint = true;
  $("hint-btn").disabled = true;
};

function answer(picked, timeout = false) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();
  const q = state.list[state.index];
  const correct = !timeout && picked === q.answer;
  let score = 0;
  if (correct) score = state.usedHint ? HINT_SCORE : 1;
  state.records.push({ q, picked, correct, timeout, usedHint: state.usedHint, score });

  document.querySelectorAll(".choice").forEach((b) => {
    b.disabled = true;
    const i = Number(b.dataset.index);
    if (i === q.answer) b.classList.add("correct");
    else if (i === picked) b.classList.add("wrong");
  });
  $("hint-btn").disabled = true;

  let msg;
  if (timeout) msg = `⏰ 시간 초과! 정답은 ${q.answer + 1}번입니다.`;
  else if (correct) msg = state.usedHint ? `정답! (힌트 사용 ${HINT_SCORE}점)` : "정답! (1점)";
  else msg = `오답! 정답은 ${q.answer + 1}번입니다.`;
  const fb = $("feedback");
  fb.innerHTML = `<strong>${msg}</strong><br>${q.explanation}`;
  fb.classList.remove("hidden");

  const next = $("next-btn");
  next.textContent = state.index === state.list.length - 1 ? "결과 보기" : "다음";
  next.classList.remove("hidden");
}

$("next-btn").onclick = () => {
  if (state.index < state.list.length - 1) { state.index += 1; renderQuestion(); }
  else showResult();
};

// ── 4. 결과 ──
function showResult() {
  stopTimer();
  const total = state.records.reduce((s, r) => s + r.score, 0);
  $("result-score").textContent = `${MODE_NAMES[state.mode]} 모드 점수: ${total}점 / ${state.records.length}점`;
  const ul = $("result-list");
  ul.innerHTML = "";
  state.records.forEach((r, i) => {
    const li = document.createElement("li");
    let tag;
    if (r.timeout) tag = "시간 초과 (0점)";
    else if (r.correct) tag = r.usedHint ? `정답 · 힌트 사용 (${HINT_SCORE}점)` : "정답 (1점)";
    else tag = "오답 (0점)";
    li.className = r.correct ? "ok" : "no";
    li.textContent = `${i + 1}. ${r.q.question} — ${tag}`;
    ul.appendChild(li);
  });
  const wrongs = state.records.filter((r) => !r.correct);
  const retry = $("retry-wrong-btn");
  retry.classList.toggle("hidden", wrongs.length === 0);
  retry.textContent = `틀린 문제 다시 풀기 (${wrongs.length}문항)`;
  show("screen-result");
}

$("retry-wrong-btn").onclick = () => {
  const wrongs = state.records.filter((r) => !r.correct).map((r) => r.q);
  if (wrongs.length) startQuiz(wrongs);
};
$("restart-btn").onclick = renderCategories;

renderCategories();
