"use server";

import { prisma } from "@/lib/db";
import { sendWelcomeEmailViaResend, WelcomeEmailData } from "@/lib/email/resendService";
import { generateWelcomePDF, WelcomePDFData } from "@/lib/pdf/pdfGenerator";
import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

/**
 * Process registration success workflow
 * Handles PDF generation, email sending, and database updates
 */
export async function processRegistrationSuccess(registrationId: string): Promise<{
  success: boolean;
  data?: {
    pdfBuffer?: Buffer;
    emailStatus: string;
    message: string;
  };
  error?: string;
}> {
  try {
    // Fetch registration details
    const registration = await prisma.interestRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return {
        success: false,
        error: "Registration not found",
      };
    }

    // Get course information based on preferred department
    const courseInfo = getCourseInfo(registration.preferredDepartment, registration.preferredCourseLevel);

    // Generate welcome PDF
    let pdfBuffer: Buffer | undefined;
    try {
      pdfBuffer = await generateWelcomePDF({
        studentName: registration.fullName,
        registrationId: registration.id,
        courseName: courseInfo.courseName,
        registrationDate: new Date(registration.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        courseDuration: courseInfo.duration,
        courseLevel: registration.preferredCourseLevel,
        courseDepartment: getCourseDisplayName(registration.preferredDepartment),
        courseInstructor: "Nexus Orbit Academy Faculty",
        courseModules: courseInfo.modules,
        courseBenefits: courseInfo.benefits,
        learningOutcomes: courseInfo.outcomes,
      });
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // Continue even if PDF fails
    }

    // Load email template
    const emailTemplatePath = join(process.cwd(), "src/lib/email/templates/welcomeEmail.html");
    let emailTemplate = "";
    try {
      emailTemplate = readFileSync(emailTemplatePath, "utf-8");
    } catch (templateError) {
      console.error("Failed to load email template:", templateError);
      emailTemplate = getDefaultEmailTemplate();
    }

    // Send welcome email via Resend with PDF attachment
    const emailResult = await sendWelcomeEmailViaResend(
      {
        studentName: registration.fullName,
        studentEmail: registration.email,
        registrationId: registration.id,
        registrationDate: new Date(registration.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        courseName: courseInfo.courseName,
        courseDuration: courseInfo.duration,
        courseLevel: registration.preferredCourseLevel,
        courseDepartment: getCourseDisplayName(registration.preferredDepartment),
        courseInstructor: "Nexus Orbit Academy Faculty",
        learningMode: "Online Self-Paced",
        websiteUrl: "https://nexus-orbit.academy",
        dashboardUrl: "https://nexus-orbit.academy/dashboard",
      },
      emailTemplate,
      pdfBuffer
    );

    // Create or update registration success record
    const registrationSuccess = await prisma.registrationSuccess.upsert({
      where: { interestRegistrationId: registrationId },
      create: {
        interestRegistrationId: registrationId,
        studentName: registration.fullName,
        email: registration.email,
        registeredCourse: courseInfo.courseName,
        registrationId: registration.id,
        emailStatus: emailResult.success ? "SENT" : "FAILED",
        emailAttempts: 1,
        lastEmailAttemptAt: new Date(),
        pdfGenerated: pdfBuffer !== null,
        pdfPath: `welcome_${registration.id}.pdf`,
      },
      update: {
        emailStatus: emailResult.success ? "SENT" : "FAILED",
        emailAttempts: { increment: 1 },
        lastEmailAttemptAt: new Date(),
        pdfGenerated: pdfBuffer !== null,
      },
    });

    return {
      success: true,
      data: {
        pdfBuffer,
        emailStatus: emailResult.success ? "SENT" : "FAILED",
        message: emailResult.success
          ? "Registration successful! Welcome email has been sent."
          : "Registration successful. Email delivery is being retried.",
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration success processing failed:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get course information based on department and level
 */
function getCourseInfo(
  department: string,
  level: string
): {
  courseName: string;
  duration: string;
  modules: string[];
  benefits: string[];
  outcomes: string[];
} {
  const courseMap: Record<
    string,
    {
      courseName: string;
      duration: string;
      modules: string[];
      benefits: string[];
      outcomes: string[];
    }
  > = {
    AEROSPACE_BEGINNER: {
      courseName: "Introduction to Aerospace Engineering",
      duration: "12 Weeks",
      modules: [
        "Fundamentals of Flight",
        "Aircraft Design Principles",
        "Aerodynamics Basics",
        "Propulsion Systems",
        "Practical Design Project",
      ],
      benefits: [
        "Learn from industry experts",
        "Hands-on project experience",
        "Industry-recognized certificate",
        "Career placement assistance",
      ],
      outcomes: [
        "Understand core aerospace concepts",
        "Design basic aircraft structures",
        "Analyze aerodynamic forces",
        "Apply propulsion principles",
      ],
    },
    AEROSPACE_INTERMEDIATE: {
      courseName: "Advanced Aerospace Engineering",
      duration: "16 Weeks",
      modules: [
        "Advanced Aerodynamics",
        "Structural Analysis",
        "Flight Dynamics",
        "Propulsion Systems Design",
        "Avionics & Control Systems",
        "Capstone Project",
      ],
      benefits: [
        "Advanced technical skills",
        "Real-world project experience",
        "Professional network building",
        "Industry partnerships",
      ],
      outcomes: [
        "Master advanced aeronautical engineering",
        "Design complex aircraft systems",
        "Analyze flight performance",
        "Implement control systems",
      ],
    },
    AI_ML_BEGINNER: {
      courseName: "Introduction to AI & Machine Learning",
      duration: "10 Weeks",
      modules: [
        "AI Fundamentals",
        "Machine Learning Basics",
        "Python for ML",
        "Data Processing",
        "First ML Model Project",
      ],
      benefits: [
        "Learn from AI experts",
        "Practical coding projects",
        "Industry-recognized certificate",
        "Tech job opportunities",
      ],
      outcomes: [
        "Understand AI/ML concepts",
        "Build ML models",
        "Process and analyze data",
        "Deploy ML solutions",
      ],
    },
    AI_ML_INTERMEDIATE: {
      courseName: "Advanced AI & Machine Learning",
      duration: "14 Weeks",
      modules: [
        "Deep Learning Fundamentals",
        "Neural Networks",
        "Natural Language Processing",
        "Computer Vision",
        "Advanced Projects",
        "Capstone Thesis",
      ],
      benefits: [
        "Deep technical expertise",
        "Advanced ML frameworks",
        "Research publication opportunity",
        "AI industry connections",
      ],
      outcomes: [
        "Master deep learning",
        "Build advanced ML systems",
        "Implement NLP & CV solutions",
        "Conduct AI research",
      ],
    },
    SPACE_TECH_BEGINNER: {
      courseName: "Introduction to Space Technology",
      duration: "12 Weeks",
      modules: [
        "Space Exploration History",
        "Satellite Technology",
        "Orbital Mechanics",
        "Space Applications",
        "Hands-on Satellite Project",
      ],
      benefits: [
        "Explore space frontiers",
        "Industry connections",
        "Certification program",
        "Career in space tech",
      ],
      outcomes: [
        "Understand space technology",
        "Learn satellite systems",
        "Master orbital mechanics",
        "Apply space knowledge",
      ],
    },
    UNIVERSE_BEGINNER: {
      courseName: "Introduction to Astronomy & Universe",
      duration: "10 Weeks",
      modules: [
        "Observational Astronomy",
        "Cosmology Basics",
        "Star & Galaxy Formation",
        "Dark Matter & Energy",
        "Research Project",
      ],
      benefits: [
        "Explore the universe",
        "Hands-on observations",
        "Expert guidance",
        "Astronomy community",
      ],
      outcomes: [
        "Master astronomy concepts",
        "Conduct observations",
        "Understand cosmology",
        "Apply research methods",
      ],
    },
  };

  const key = `${department}_${level}`;
  return (
    courseMap[key] ||
    courseMap["AEROSPACE_BEGINNER"] || {
      courseName: "Nexus Orbit Academy Course",
      duration: "12 Weeks",
      modules: ["Module 1", "Module 2", "Module 3", "Final Project"],
      benefits: ["Expert instruction", "Professional certificate", "Career support"],
      outcomes: ["Gain industry skills", "Complete projects", "Earn certification"],
    }
  );
}

/**
 * Get display name for course department
 */
function getCourseDisplayName(department: string): string {
  const displayNames: Record<string, string> = {
    AEROSPACE: "Aerospace Engineering",
    AI_ML: "AI & Machine Learning",
    SPACE_TECH: "Space Technology",
    UNIVERSE: "Astronomy & Universe",
  };
  return displayNames[department] || department;
}

/**
 * Default email template if file not found
 */
function getDefaultEmailTemplate(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            .header { color: #7c3aed; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { line-height: 1.6; color: #555; }
            .detail { margin: 10px 0; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Welcome to Nexus Orbit Academy! 🚀</div>
            <div class="content">
                <p>Hello {{STUDENT_NAME}},</p>
                <p>Thank you for registering with Nexus Orbit Academy! Your learning journey begins now.</p>
                <div class="detail"><strong>Registration ID:</strong> {{REGISTRATION_ID}}</div>
                <div class="detail"><strong>Course:</strong> {{COURSE_NAME}}</div>
                <div class="detail"><strong>Email:</strong> {{STUDENT_EMAIL}}</div>
                <div class="detail"><strong>Registration Date:</strong> {{REGISTRATION_DATE}}</div>
                <a href="{{DASHBOARD_URL}}" class="button">Access Your Dashboard</a>
            </div>
        </div>
    </body>
    </html>
  `;
}

/**
 * Retry failed email delivery
 */
export async function retryFailedEmail(registrationId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const result = await processRegistrationSuccess(registrationId);
    return {
      success: result.success,
      message: result.success ? "Email retry successful" : "Email retry failed",
      error: result.error,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: "Email retry failed",
      error: errorMessage,
    };
  }
}
