const chatWindow = document.getElementById("chat-window")
const input = document.getElementById("user-input")
const btn = document.getElementById("send-btn")
const progressFill = document.getElementById("progress-fill")
const readinessScore = document.getElementById("readiness-score")
const exportBtn = document.getElementById("export-pdf")
const confidenceMeter = document.getElementById("confidence-meter")
const whyBox = document.getElementById("why-box")

const questions = [
  { q: "What country were you born in?", why: "Birth country helps professionals understand eligibility categories." },
  { q: "When did you last enter the U.S.?", why: "Entry date connects to official entry records." },
  { q: "What was your status when you entered?", why: "Entry status affects available legal pathways." },
  { q: "Have you had immigration court proceedings?", why: "Court history impacts documentation needed." },
  { q: "Do you have pending applications?", why: "Pending cases help professionals avoid duplicate filings." }
]

let step = 0
let answers = {}
let score = 0
const scoreThresholds = {
  pursue: 7,
  pending: 4
}
let pauseTimer

function addBubble(text, type) {
  const bubble = document.createElement("div")
  bubble.className = "bubble " + type
  bubble.textContent = text
  chatWindow.appendChild(bubble)
  chatWindow.scrollTop = chatWindow.scrollHeight
}

function updateProgress() {
  progressFill.style.width = ((step / questions.length) * 100) + "%"
  if (step < 2) confidenceMeter.textContent = "Confidence Level: Getting Started"
  else if (step < questions.length) confidenceMeter.textContent = "Confidence Level: Organized"
  else confidenceMeter.textContent = "Confidence Level: Consultant Ready"
}

function botNext() {
  if (step < questions.length) {
    setTimeout(() => addBubble(questions[step].q, "bot"), 400)
    whyBox.innerHTML = `Why we ask this: ${questions[step].why}`
  } else {
    addBubble("You’ve done an important step today. Preparing information early makes conversations with professionals clearer and less stressful.", "bot")
    readinessScore.textContent = ""
  }
}

function evaluateAnswer(step, answer) {
  switch (step) {
    case 0:
      if (answer.trim().length > 0) score += 2
      break
    case 1:
      if (/^(0?[1-9]|1[0-2])\/? ?\d{4}$|^(January|February|March|April|May|June|July|August|September|October|November|December) ?\d{4}$/i.test(answer)) score += 3
      break
    case 2:
      if (/valid|lawful|visitor|student|work/i.test(answer)) score += 2
      break
    case 3:
      if (/no|none|never/i.test(answer)) score += 3
      break
    case 4:
      if (/no|none|never/i.test(answer)) score += 2
      break
  }
}

function getReadinessStatus() {
  if (score >= scoreThresholds.pursue) return 'Pursue'
  if (score >= scoreThresholds.pending) return 'Pending'
  return 'Fail'
}

function getReadinessMessage() {
  const status = getReadinessStatus()
  if (status === 'Pursue') {
    return "You're well prepared! We recommend scheduling a consultation soon."
  } else if (status === 'Pending') {
    return "You've made a great start — we suggest reviewing these resources before your consultation."
  } else {
    return "Based on your answers, we recommend gathering more information first. Please check these helpful resources."
  }
}

function showExportSection() {
  document.querySelector('.export-section').style.display = 'block'
}

btn.addEventListener("click", () => {
  const text = input.value.trim()
  if (!text) return
  addBubble(text, "user")
  answers["q" + step] = text
  evaluateAnswer(step, text)
  input.value = ""
  step++
  updateProgress()
  addBubble("Thanks — that helps.", "bot")
  if (step < questions.length) {
    botNext()
  } else {
    addBubble(getReadinessMessage(), "bot")
    readinessScore.innerHTML = `<strong>Consultation Readiness:</strong> ${getReadinessStatus()}`
    showExportSection()
  }
})

window.onload = () => {
  botNext()
  document.querySelector('.export-section').style.display = 'none'
}

input.addEventListener("input", () => {
  clearTimeout(pauseTimer)
  pauseTimer = setTimeout(() => addBubble("No rush. Take your time — you're doing fine.", "bot"), 30000)
})

function generatePDF() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()
  let y = 20
  doc.setFontSize(18)
  doc.text("Immigration Intake Summary", 20, y)
  y += 10
  doc.setFontSize(12)
  doc.text(`Readiness Status: ${getReadinessStatus()}`, 20, y)
  y += 10
  doc.text(getReadinessMessage(), 20, y)
  y += 15
  doc.text("Answers Summary:", 20, y)
  y += 10
  Object.keys(answers).forEach((k, i) => {
    doc.text(`Q${i + 1}: ${questions[i].q}`, 20, y)
    y += 7
    doc.text(`A: ${answers[k]}`, 25, y)
    y += 10
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })
  doc.save("intake-summary.pdf")
}

exportBtn.addEventListener("click", generatePDF)

