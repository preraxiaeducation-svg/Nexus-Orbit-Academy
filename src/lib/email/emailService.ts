import nodemailer from "nodemailer";

// Validate SMTP configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || "noreply@nexus-orbit.academy";

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
  console.warn("Email configuration incomplete. Some email features may not work.");
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export interface WelcomeEmailData {
  studentName: string;
  studentEmail: string;
  registrationId: string;
  registrationDate: string;
  courseName: string;
  courseDuration: string;
  courseLevel: string;
  courseDepartment: string;
  courseInstructor: string;
  learningMode?: string;
  websiteUrl?: string;
  dashboardUrl?: string;
}

/**
 * Replace template variables with actual values
 */
export function renderEmailTemplate(
  template: string,
  data: Record<string, string>
): string {
  let html = template;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, "g"), value || "");
  });
  
  return html;
}

/**
 * Send welcome email with optional PDF attachment
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData,
  emailTemplate: string,
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
      throw new Error("Email configuration incomplete");
    }

    // Prepare template variables
    const templateVars = {
      STUDENT_NAME: data.studentName,
      STUDENT_EMAIL: data.studentEmail,
      REGISTRATION_ID: data.registrationId,
      REGISTRATION_DATE: data.registrationDate,
      COURSE_NAME: data.courseName,
      COURSE_DURATION: data.courseDuration,
      COURSE_LEVEL: data.courseLevel,
      COURSE_DEPARTMENT: data.courseDepartment,
      INSTRUCTOR: data.courseInstructor,
      LEARNING_MODE: data.learningMode || "Online Self-Paced",
      WEBSITE_URL: data.websiteUrl || "https://nexus-orbit.academy",
      DASHBOARD_URL: data.dashboardUrl || "https://nexus-orbit.academy/dashboard",
    };

    // Render HTML
    const htmlContent = renderEmailTemplate(emailTemplate, templateVars);

    // Send email
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: data.studentEmail,
      subject: "🚀 Welcome to Nexus Orbit Academy",
      html: htmlContent,
      attachments: attachments || [],
      headers: {
        "X-Registration-ID": data.registrationId,
        "X-Student-Name": data.studentName,
      },
    });

    console.log(`Email sent successfully: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send welcome email:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify email transporter connection
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    if (!SMTP_HOST) {
      console.warn("Email not configured");
      return false;
    }
    await transporter.verify();
    console.log("Email transporter verified successfully");
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Email transporter verification failed:", errorMessage);
    return false;
  }
}

/**
 * Send test email
 */
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: recipientEmail,
      subject: "Test Email from Nexus Orbit Academy",
      html: "<p>This is a test email from Nexus Orbit Academy.</p>",
    });
    return true;
  } catch (error) {
    console.error("Test email failed:", error);
    return false;
  }
}
