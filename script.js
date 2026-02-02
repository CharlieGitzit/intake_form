const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("user-input");
const btn = document.getElementById("send-btn");
const progressFill = document.getElementById("progress-fill");
const readinessScore = document.getElementById("readiness-score");
const exportBtn = document.getElementById("export-pdf");

const questions = [
"Welcome. I'm here to help organize your information. What country were you born in?",
"What month and year did you last enter the United States?",
"What was your status when you entered?",
"Have you ever had immigration court proceedings?",
"Do you currently have any pending applications?",
"Thank you. All required intake fields are recorded."
];

let step = 0;
let answers = {};

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className = "bubble " + type;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateProgress() {
  const percent = (step / questions.length) * 100;
  progressFill.style.width = percent + "%";
}

function calculateReadiness() {
  const answered = Object.keys(answers).length;
  let level = "";
  if (answered < questions.length * 0.5) level = "Intake started — more information needed.";
  else if (answered < questions.length) level = "Nearly ready — consultant can review details.";
  else level = "Intake complete — ready for professional consultation.";
  readinessScore.textContent = "Consultation Readiness: " + level;
}

function botNext() {
  if (step < questions.length) {
    setTimeout(() => addBubble(questions[step], "bot"), 400);
  } else {
    addBubble("Thank you. The next step is consultation with a licensed professional.", "bot");
    addBubble("AI Summary: All provided intake fields recorded. No legal interpretation applied.", "bot");
  }
}

btn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  addBubble(text, "user");
  answers["q" + step] = text;
  input.value = "";
  step++;
  updateProgress();
  calculateReadiness();
  botNext();
});

window.onload = botNext;

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(14);
  doc.text("Immigration Intake Summary", 20, y);
  y += 10;

  Object.keys(answers).forEach((key, i) => {
    doc.setFontSize(11);
    doc.text(`Q${i + 1}: ${questions[i]}`, 20, y);
    y += 6;
    doc.text(`Answer: ${answers[key]}`, 20, y);
    y += 10;
  });

  doc.text("Status: Information recorded without legal evaluation.", 20, y);
  doc.save("intake-summary.pdf");
}

exportBtn.addEventListener("click", generatePDF);

