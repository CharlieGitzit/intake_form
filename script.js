const chatWindow=document.getElementById("chat-window")
const input=document.getElementById("user-input")
const btn=document.getElementById("send-btn")
const progressFill=document.getElementById("progress-fill")
const readinessScore=document.getElementById("readiness-score")
const exportBtn=document.getElementById("export-pdf")
const confidenceMeter=document.getElementById("confidence-meter")
const whyBox=document.getElementById("why-box")

const questions=[
{q:"What country were you born in?",why:"Birth country helps professionals understand eligibility categories."},
{q:"When did you last enter the U.S.?",why:"Entry date connects to official entry records."},
{q:"What was your status when you entered?",why:"Entry status affects available legal pathways."},
{q:"Have you had immigration court proceedings?",why:"Court history impacts documentation needed."},
{q:"Do you have pending applications?",why:"Pending cases help professionals avoid duplicate filings."}
]

let step=0
let answers={}
let pauseTimer

function addBubble(text,type){
const bubble=document.createElement("div")
bubble.className="bubble "+type
bubble.textContent=text
chatWindow.appendChild(bubble)
chatWindow.scrollTop=chatWindow.scrollHeight
}

function updateProgress(){
progressFill.style.width=((step/questions.length)*100)+"%"
if(step<2)confidenceMeter.textContent="Confidence Level: Getting Started"
else if(step<questions.length)confidenceMeter.textContent="Confidence Level: Organized"
else confidenceMeter.textContent="Confidence Level: Consultant Ready"
}

function botNext(){
if(step<questions.length){
setTimeout(()=>addBubble(questions[step].q,"bot"),400)
whyBox.innerHTML=`Why we ask this: ${questions[step].why}`
}else{
addBubble("You’ve done an important step today. Preparing information early makes conversations with professionals clearer and less stressful.","bot")
readinessScore.textContent="Consultation Readiness: Intake Complete"
}
}

btn.addEventListener("click",()=>{
const text=input.value.trim()
if(!text)return
addBubble(text,"user")
answers["q"+step]=text
input.value=""
step++
updateProgress()
addBubble("Thanks — that helps.","bot")
botNext()
})

window.onload=botNext

input.addEventListener("input",()=>{
clearTimeout(pauseTimer)
pauseTimer=setTimeout(()=>addBubble("No rush. Take your time — you're doing fine.","bot"),30000)
})

function generatePDF(){
const {jsPDF}=window.jspdf
const doc=new jsPDF()
let y=20
doc.text("Immigration Intake Summary",20,y)
y+=10
Object.keys(answers).forEach((k,i)=>{doc.text(`Q${i+1}: ${answers[k]}`,20,y);y+=10})
doc.save("intake-summary.pdf")
}

exportBtn.addEventListener("click",generatePDF)

