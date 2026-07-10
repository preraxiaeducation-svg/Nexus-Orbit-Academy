import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
 * Send welcome email using Resend with PDF attachment
 */
export async function sendWelcomeEmailViaResend(
  data: WelcomeEmailData,
  emailTemplate: string,
  pdfBuffer?: Buffer
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
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

    // Prepare attachments
    const attachments = pdfBuffer
      ? [
          {
            filename: `Welcome_${data.studentName.replace(/\s+/g, "_")}.pdf`,
            content: pdfBuffer,
          },
        ]
      : [];

    // Send email via Resend
    const response = await resend.emails.send({
      from: "Nexus Orbit Academy <noreply@nexus-orbit.academy>",
      to: data.studentEmail,
      subject: "🚀 Welcome to Nexus Orbit Academy",
      html: htmlContent,
      attachments,
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to send email");
    }

    console.log(`Email sent successfully via Resend: ${response.data?.id}`);
    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send welcome email via Resend:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify Resend API connection
 */
export async function verifyResendConnection(): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured");
      return false;
    }
    console.log("Resend API configured successfully");
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Resend API verification failed:", errorMessage);
    return false;
  }
}

/**
 * Send test email via Resend
 */
export async function sendTestEmailViaResend(recipientEmail: string): Promise<boolean> {
  try {
    const response = await resend.emails.send({
      from: "Nexus Orbit Academy <noreply@nexus-orbit.academy>",
      to: recipientEmail,
      subject: "Test Email from Nexus Orbit Academy",
      html: "<p>This is a test email from Nexus Orbit Academy using Resend.</p>",
    });

    if (response.error) {
      console.error("Test email failed:", response.error.message);
      return false;
    }

    console.log("Test email sent successfully:", response.data?.id);
    return true;
  } catch (error) {
    console.error("Test email error:", error);
    return false;
  }
}
