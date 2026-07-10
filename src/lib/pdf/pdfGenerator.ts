import { PDFDocument, PDFPage, StandardFonts, rgb, degrees } from "pdf-lib";
import { readFileSync } from "fs";
import { join } from "path";

export interface WelcomePDFData {
  studentName: string;
  registrationId: string;
  courseName: string;
  registrationDate: string;
  courseDuration?: string;
  courseLevel?: string;
  courseDepartment?: string;
  courseInstructor?: string;
  courseModules?: string[];
  courseBenefits?: string[];
  learningOutcomes?: string[];
  careerOpportunities?: string[];
}

/**
 * Generate a beautiful welcome PDF
 */
export async function generateWelcomePDF(data: WelcomePDFData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  // Set PDF metadata
  pdfDoc.setTitle("Welcome to Nexus Orbit Academy");
  pdfDoc.setAuthor("Nexus Orbit Academy");
  pdfDoc.setSubject(`Welcome Letter - ${data.studentName}`);

  // Color scheme
  const primaryColor = rgb(0.49, 0.23, 0.93); // Purple #7c3aed
  const secondaryColor = rgb(0.15, 0.38, 0.93); // Blue #2563eb
  const accentColor = rgb(0.375, 0.65, 0.98); // Light blue #60a5fa
  const darkBg = rgb(0.06, 0.08, 0.1); // Very dark #0f1419
  const textColor = rgb(0.88, 0.9, 0.93); // Light text #e0e6ed
  const lightText = rgb(0.55, 0.58, 0.66); // Muted text #8b94a8

  // Cover Page
  await addCoverPage(pdfDoc, data, primaryColor, secondaryColor, darkBg, textColor, accentColor);

  // Course Overview Page
  await addCourseOverviewPage(pdfDoc, data, primaryColor, accentColor, darkBg, textColor, lightText);

  // Welcome Letter Page
  await addWelcomeLetterPage(pdfDoc, data, primaryColor, darkBg, textColor, lightText);

  return Buffer.from(await pdfDoc.save());
}

/**
 * Add cover page to PDF
 */
async function addCoverPage(
  pdfDoc: PDFDocument,
  data: WelcomePDFData,
  primaryColor: any,
  secondaryColor: any,
  darkBg: any,
  textColor: any,
  accentColor: any
) {
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Background gradient effect with rectangles
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: darkBg,
  });

  // Gradient bars
  page.drawRectangle({
    x: 0,
    y: height - 150,
    width: width,
    height: 150,
    color: primaryColor,
  });

  // Logo/Title section
  page.drawText("🚀", {
    x: width / 2 - 20,
    y: height - 120,
    size: 60,
  });

  page.drawText("NEXUS ORBIT", {
    x: 50,
    y: height - 200,
    size: 36,
    color: accentColor,
    font: boldFont,
  });

  page.drawText("ACADEMY", {
    x: 50,
    y: height - 240,
    size: 28,
    color: textColor,
    font: regularFont,
  });

  // Main heading
  page.drawText("WELCOME TO NEXUS ORBIT ACADEMY", {
    x: 50,
    y: height - 320,
    size: 32,
    color: primaryColor,
    font: boldFont,
  });

  // Subheading
  page.drawText("Official AI & Aerospace Learning Platform", {
    x: 50,
    y: height - 360,
    size: 14,
    color: accentColor,
    font: regularFont,
  });

  // Student information box
  drawBox(page, 50, 250, width - 100, 150, secondaryColor, 2, 0.2);

  page.drawText("REGISTRATION DETAILS", {
    x: 70,
    y: 380,
    size: 12,
    color: accentColor,
    font: boldFont,
  });

  page.drawText(`Student Name: ${data.studentName}`, {
    x: 70,
    y: 355,
    size: 11,
    color: textColor,
  });

  page.drawText(`Registration ID: ${data.registrationId}`, {
    x: 70,
    y: 335,
    size: 11,
    color: textColor,
  });

  page.drawText(`Course: ${data.courseName}`, {
    x: 70,
    y: 315,
    size: 11,
    color: textColor,
  });

  page.drawText(`Registration Date: ${data.registrationDate}`, {
    x: 70,
    y: 295,
    size: 11,
    color: textColor,
  });

  page.drawText(`Level: ${data.courseLevel || "N/A"}`, {
    x: 70,
    y: 275,
    size: 11,
    color: textColor,
  });

  // Footer
  page.drawText("Your Learning Journey Begins Today", {
    x: 50,
    y: 40,
    size: 12,
    color: accentColor,
    font: italicFont,
  });

  page.drawLine({
    start: { x: 50, y: 60 },
    end: { x: width - 50, y: 60 },
    color: primaryColor,
    thickness: 1,
  });
}

/**
 * Add course overview page
 */
async function addCourseOverviewPage(
  pdfDoc: PDFDocument,
  data: WelcomePDFData,
  primaryColor: any,
  accentColor: any,
  darkBg: any,
  textColor: any,
  lightText: any
) {
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: darkBg,
  });

  // Header
  page.drawText("COURSE INFORMATION", {
    x: 50,
    y: height - 50,
    size: 24,
    color: primaryColor,
    font: boldFont,
  });

  page.drawLine({
    start: { x: 50, y: height - 65 },
    end: { x: width - 50, y: height - 65 },
    color: primaryColor,
    thickness: 2,
  });

  let yPosition = height - 110;
  const lineHeight = 25;

  // Course details
  const courseDetails = [
    ["Course Name", data.courseName],
    ["Duration", data.courseDuration || "N/A"],
    ["Level", data.courseLevel || "N/A"],
    ["Department", data.courseDepartment || "N/A"],
    ["Instructor", data.courseInstructor || "Nexus Orbit Faculty"],
  ];

  courseDetails.forEach(([label, value]) => {
    drawDetailRow(page, 50, yPosition, label, value, accentColor, textColor, boldFont, regularFont);
    yPosition -= lineHeight;
  });

  yPosition -= 20;

  // Modules section
  if (data.courseModules && data.courseModules.length > 0) {
    drawSection(
      page,
      "📚 Course Modules",
      data.courseModules,
      50,
      yPosition,
      primaryColor,
      accentColor,
      textColor,
      boldFont,
      regularFont
    );
    yPosition -= 30 + data.courseModules.length * 18;
  }

  yPosition -= 20;

  // Benefits section
  if (data.courseBenefits && data.courseBenefits.length > 0) {
    drawSection(
      page,
      "✨ Benefits",
      data.courseBenefits,
      50,
      yPosition,
      primaryColor,
      accentColor,
      textColor,
      boldFont,
      regularFont
    );
    yPosition -= 30 + data.courseBenefits.length * 18;
  }

  yPosition -= 20;

  // Learning outcomes
  if (data.learningOutcomes && data.learningOutcomes.length > 0) {
    drawSection(
      page,
      "🎯 Learning Outcomes",
      data.learningOutcomes,
      50,
      yPosition,
      primaryColor,
      accentColor,
      textColor,
      boldFont,
      regularFont
    );
  }
}

/**
 * Add welcome letter page
 */
async function addWelcomeLetterPage(
  pdfDoc: PDFDocument,
  data: WelcomePDFData,
  primaryColor: any,
  darkBg: any,
  textColor: any,
  lightText: any
) {
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: darkBg,
  });

  // Header
  page.drawText("WELCOME LETTER", {
    x: 50,
    y: height - 50,
    size: 24,
    color: primaryColor,
    font: boldFont,
  });

  page.drawLine({
    start: { x: 50, y: height - 65 },
    end: { x: width - 50, y: height - 65 },
    color: primaryColor,
    thickness: 2,
  });

  let yPosition = height - 110;

  // Letter content
  const letterContent = [
    `Dear ${data.studentName},`,
    "",
    "Welcome to the Nexus Orbit Academy family! We are thrilled to have you join us on this exciting learning journey.",
    "",
    "As a student of our academy, you are now part of a vibrant community of learners, innovators, and explorers dedicated to understanding the wonders of aerospace, artificial intelligence, and space technology.",
    "",
    "This premium course will equip you with cutting-edge knowledge and practical skills. Throughout your journey, you will:",
    "",
    "• Learn from industry-leading instructors and experts",
    "• Access exclusive course materials and resources",
    "• Collaborate with fellow students in our community",
    "• Work on real-world projects and case studies",
    "• Earn a recognized certificate upon completion",
    "",
    "Our support team is here to assist you every step of the way. Should you have any questions or need guidance, please don't hesitate to reach out.",
    "",
    "Best wishes for your learning journey!",
    "",
    "Warm regards,",
    "",
    "Admissions Office",
    "Nexus Orbit Academy",
  ];

  const lineSpacing = 14;
  letterContent.forEach((line) => {
    if (yPosition < 60) {
      // New page if needed
      return;
    }
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 11,
      color: line.startsWith("Dear") || line.includes("regards") ? primaryColor : textColor,
      font: regularFont,
    });
    yPosition -= lineSpacing;
  });

  // Footer with date
  page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: 40,
    size: 9,
    color: lightText,
    font: italicFont,
  });
}

/**
 * Helper: Draw a detail row
 */
function drawDetailRow(
  page: PDFPage,
  x: number,
  y: number,
  label: string,
  value: string,
  labelColor: any,
  valueColor: any,
  boldFont: any,
  regularFont: any
) {
  page.drawText(`${label}:`, {
    x,
    y,
    size: 11,
    color: labelColor,
    font: boldFont,
  });

  page.drawText(value, {
    x: x + 150,
    y,
    size: 11,
    color: valueColor,
    font: regularFont,
  });
}

/**
 * Helper: Draw a section with bullet points
 */
function drawSection(
  page: PDFPage,
  title: string,
  items: string[],
  x: number,
  y: number,
  titleColor: any,
  accentColor: any,
  textColor: any,
  boldFont: any,
  regularFont: any
) {
  page.drawText(title, {
    x,
    y,
    size: 12,
    color: titleColor,
    font: boldFont,
  });

  let itemY = y - 18;
  items.forEach((item) => {
    page.drawText(`• ${item}`, {
      x: x + 15,
      y: itemY,
      size: 10,
      color: textColor,
      font: regularFont,
    });
    itemY -= 16;
  });
}

/**
 * Helper: Draw a box
 */
function drawBox(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  color: any,
  thickness: number,
  opacity: number
) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: color,
    borderWidth: thickness,
    color: undefined,
  });
}
