import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.chatMessage.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("nexus123", 12);

  const alice = await prisma.user.create({
    data: {
      name: "Alice Sharma",
      email: "alice@nexusorbit.example",
      passwordHash,
      role: "STUDENT",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@nexusorbit.example",
      passwordHash,
      role: "ADMIN",
    },
  });

  const aiCourse = await prisma.course.create({
    data: {
      title: "AI Research & Engineering",
      slug: "ai-research-engineering",
      description: "Master AI models, data pipelines, and engineering best practices for real-world systems.",
      longDescription: "A hands-on course covering AI architecture, training workflows, and deployment for modern products.",
      department: "AI_ML",
      level: "BEGINNER",
      price: 0,
      thumbnail: "/images/courses/ai-foundations.jpg",
      instructor: "Dr. Priya Menon",
      instructorBio: "AI systems expert with 10+ years of research and product engineering experience.",
      syllabusOverview: "Foundations of ML, neural networks, model evaluation, prompt engineering, and deployment.",
      durationHours: 18,
      isPublished: true,
    },
  });

  const spaceCourse = await prisma.course.create({
    data: {
      title: "Space Systems Engineering",
      slug: "space-systems-engineering",
      description: "Build aerospace systems from mission planning through flight test and launch readiness.",
      longDescription: "Learn spacecraft design, propulsion, guidance, and avionics through applied engineering modules.",
      department: "AEROSPACE",
      level: "ADVANCED",
      price: 499,
      thumbnail: "/images/courses/space-systems.jpg",
      instructor: "Prof. Karan Iyer",
      instructorBio: "Aerospace program director with leadership experience on launch vehicles and satellites.",
      syllabusOverview: "Spacecraft subsystems, mission planning, systems integration, and verification.",
      durationHours: 42,
      isPublished: true,
    },
  });

  const aiLessons = [
    { chapterTitle: "Intro to AI", title: "AI Systems Overview", orderIndex: 1, videoUrl: "https://example.com/video/ai-1.mp4", durationSeconds: 420, notes: "Overview of AI models and workflows.", quiz: JSON.stringify([{ id: "q1", type: "MCQ", question: "What is supervised learning?", options: ["Learning from labeled data", "Learning without labels", "Learning by reinforcement"], correct: 0, points: 5, negMarks: 1, explanation: "Supervised learning uses labeled examples." }]), isPreview: true },
    { chapterTitle: "Core Concepts", title: "Model Training Basics", orderIndex: 2, videoUrl: "https://example.com/video/ai-2.mp4", durationSeconds: 540, notes: "Understanding loss functions, optimization, and validation.", quiz: JSON.stringify([{ id: "q2", type: "MCQ", question: "Which metric is used for classification?", options: ["Accuracy", "Mean Squared Error", "Spectral Norm"], correct: 0, points: 5, negMarks: 1, explanation: "Accuracy is common for classification tasks." }]), isPreview: false },
  ];
  const spaceLessons = [
    { chapterTitle: "Orbital Mechanics", title: "Launch Vehicle Design", orderIndex: 1, videoUrl: "https://example.com/video/space-1.mp4", durationSeconds: 480, notes: "Principles of launch vehicle architecture and staging.", quiz: JSON.stringify([{ id: "q3", type: "MCQ", question: "What is delta-v?", options: ["Change in velocity", "Reaction force", "Mass flow rate"], correct: 0, points: 5, negMarks: 1, explanation: "Delta-v is the total velocity change required." }]), isPreview: true },
    { chapterTitle: "Systems Integration", title: "Avionics & Controls", orderIndex: 2, videoUrl: "https://example.com/video/space-2.mp4", durationSeconds: 560, notes: "Guidance systems, sensors, and control loops.", quiz: JSON.stringify([{ id: "q4", type: "MCQ", question: "Which system manages vehicle attitude?", options: ["Avionics", "Thermal control", "Payload bay"], correct: 0, points: 5, negMarks: 1, explanation: "Avionics includes guidance and attitude control." }]), isPreview: false },
  ];

  const examAi = await prisma.exam.create({
    data: {
      courseId: aiCourse.id,
      type: "FINAL",
      title: "AI Foundations Final Exam",
      timeLimitMinutes: 45,
      passingScore: 60,
      negativeMarking: 0.25,
      questions: JSON.stringify([
        { id: "e1", type: "MCQ", question: "Which algorithm is used for classification?", options: ["Linear regression", "Decision tree", "K-means"], correct: 1, points: 10, negMarks: 2, explanation: "Decision trees are used for classification." },
        { id: "e2", type: "MCQ", question: "In ML, overfitting means?", options: ["Model generalizes well", "Model memorizes training data", "Model underperforms"], correct: 1, points: 10, negMarks: 2, explanation: "Overfitting occurs when the model memorizes training data." },
      ]),
    },
  });

  const examSpace = await prisma.exam.create({
    data: {
      courseId: spaceCourse.id,
      type: "FINAL",
      title: "Space Systems Final Exam",
      timeLimitMinutes: 60,
      passingScore: 70,
      negativeMarking: 0.5,
      questions: JSON.stringify([
        { id: "e3", type: "MCQ", question: "What is a launch window?", options: ["Time to start countdown", "Optimal time for launch", "Payload separation event"], correct: 1, points: 10, negMarks: 2, explanation: "A launch window is the optimal timing for launch." },
        { id: "e4", type: "MCQ", question: "Which system manages thrust vectoring?", options: ["Thermal system", "Guidance system", "Structure"], correct: 1, points: 10, negMarks: 2, explanation: "Guidance systems manage vectoring." },
      ]),
    },
  });

  await Promise.all(
    aiLessons.map((data) => prisma.lesson.create({ data: { ...data, courseId: aiCourse.id } }))
  );

  await Promise.all(
    spaceLessons.map((data) => prisma.lesson.create({ data: { ...data, courseId: spaceCourse.id } }))
  );

  const aiEnrollment = await prisma.enrollment.create({
    data: {
      userId: alice.id,
      courseId: aiCourse.id,
      entranceExamPassed: true,
    },
  });

  await prisma.lessonProgress.create({
    data: { enrollmentId: aiEnrollment.id, lessonId: (await prisma.lesson.findFirst({ where: { courseId: aiCourse.id, orderIndex: 1 } }))!.id, watchPercent: 100, videoCompleted: true, quizPassed: true, completed: true }
  });
  await prisma.lessonProgress.create({
    data: { enrollmentId: aiEnrollment.id, lessonId: (await prisma.lesson.findFirst({ where: { courseId: aiCourse.id, orderIndex: 2 } }))!.id, watchPercent: 40, videoCompleted: false, quizPassed: false, completed: false }
  });

  const payment = await prisma.payment.create({
    data: {
      userId: alice.id,
      courseId: spaceCourse.id,
      amount: 499,
      currency: "INR",
      status: "SUCCESS",
      razorpayOrderId: "sandbox_order_001",
      razorpayPaymentId: "sandbox_payment_001",
    },
  });

  const spaceEnrollment = await prisma.enrollment.create({
    data: {
      userId: alice.id,
      courseId: spaceCourse.id,
      entranceExamPassed: true,
    },
  });

  await prisma.certificate.create({
    data: {
      userId: alice.id,
      courseId: spaceCourse.id,
      certificateUid: `NEXUS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    },
  });

  console.log("Seeding complete.");
  console.log("Use the following credentials:");
  console.log("  Student: alice@nexusorbit.example / nexus123");
  console.log("  Admin: admin@nexusorbit.example / nexus123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
