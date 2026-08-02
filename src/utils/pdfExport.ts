import { jsPDF } from 'jspdf';
import { PredictionResult } from '../types';

export function generatePredictionPDF(result: PredictionResult) {
  const doc = new jsPDF();
  const input = result.input_data;

  // Primary Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ROAD ACCIDENT SEVERITY PREDICTION REPORT', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Machine Learning Model Microproject - B.Tech Computer Engineering', 14, 27);

  // Prediction Summary Box
  const severityColor = result.severity === 'Fatal' ? [239, 68, 68] :
                       result.severity === 'Serious' ? [245, 158, 11] : [16, 185, 129];
  
  doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
  doc.roundedRect(14, 42, 182, 28, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`PREDICTED SEVERITY: ${result.severity.toUpperCase()}`, 20, 53);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Confidence Score: ${result.confidence}%   |   Risk Score: ${result.risk_score}/100`, 20, 62);

  // Input Details Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Input Accident Parameters', 14, 80);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 83, 196, 83);

  if (input) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const col1 = [
      `State: ${input.state}`,
      `Weather: ${input.weather}`,
      `Road Type: ${input.road_type}`,
      `Road Surface: ${input.road_surface}`,
      `Light Condition: ${input.light_condition}`,
      `Vehicle Type: ${input.vehicle_type}`
    ];

    const col2 = [
      `Driver Age: ${input.driver_age} yrs`,
      `Driver Gender: ${input.driver_gender}`,
      `Alcohol Involved: ${input.alcohol}`,
      `Speed Limit: ${input.speed_limit} km/h`,
      `Time of Day: ${input.time_of_day}`,
      `Casualties: ${input.casualties}`
    ];

    let yPos = 91;
    for (let i = 0; i < col1.length; i++) {
      doc.text(col1[i], 16, yPos);
      doc.text(col2[i], 110, yPos);
      yPos += 7;
    }
  }

  // Class Probabilities
  let startY = 140;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Model Class Probabilities', 14, startY);
  doc.line(14, startY + 3, 196, startY + 3);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Minor Severity: ${result.probabilities.Minor}%`, 16, startY + 12);
  doc.text(`Serious Severity: ${result.probabilities.Serious}%`, 80, startY + 12);
  doc.text(`Fatal Severity: ${result.probabilities.Fatal}%`, 140, startY + 12);

  // Safety Recommendations
  startY += 25;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Safety & Emergency Actions', 14, startY);
  doc.line(14, startY + 3, 196, startY + 3);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  let recY = startY + 11;
  result.recommendations.forEach((rec) => {
    const cleanRec = rec.replace('✔', '•');
    doc.text(cleanRec, 16, recY);
    recY += 7;
  });

  // Footer Metadata
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Report Generated On: ${new Date().toLocaleString()} | India Road Guard AI Engine`, 14, 285);

  doc.save(`Road_Accident_Severity_Report_${result.severity}_${Date.now()}.pdf`);
}
