function generateConsultantSummary() {
  let summaryLines = []
  const status = getReadinessStatus()

  if (status === "Pursue") {
    summaryLines.push("Applicant appears well-prepared and ready for consultation.")
  } else if (status === "Pending") {
    summaryLines.push("Applicant has provided partial information and may need to prepare further before consultation.")
  } else {
    summaryLines.push("Applicant appears not ready for consultation and should gather more information.")
  }

  Object.keys(answers).forEach((key, i) => {
    if (!answers[key] || answers[key].trim() === "") {
      summaryLines.push(`- Missing answer for question ${i + 1}: "${questions[i].q}"`)
    }
  })

  return summaryLines.join(" ")
}

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

  const summaryText = generateConsultantSummary()
  doc.setFillColor(230, 230, 250)
  doc.rect(15, y - 5, 180, 40, "F")
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(12)
  doc.text("Consultant Summary:", 20, y)
  doc.setFontSize(11)
  doc.text(summaryText, 20, y + 7, { maxWidth: 170 })
  y += 45
  doc.setTextColor(0, 0, 0)

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

