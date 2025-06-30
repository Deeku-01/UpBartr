import { PrismaClient, type SkillRequest, type User, type Application, type SkillLevel, UserSkill } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Sample data arrays
const skillCategories = [
  "Technology",
  "Creative",
  "Business",
  "Education",
  "Health",
  "Music",
  "Language",
  "Crafts",
  "Sports",
  "Cooking",
]



const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Denver, CO",
  "Portland, OR",
  "Miami, FL",
  "Chicago, IL",
  "Boston, MA",
  "Los Angeles, CA",
  "Atlanta, GA",
  "Nashville, TN",
]

const avatarUrls = [
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
]

// Skills data for seeding
const sampleSkills = [
  // Technology Skills
  { name: "React Development", level: "EXPERT" as SkillLevel, category: "Technology" },
  { name: "Node.js", level: "ADVANCED" as SkillLevel, category: "Technology" },
  { name: "Python Programming", level: "INTERMEDIATE" as SkillLevel, category: "Technology" },
  { name: "JavaScript", level: "EXPERT" as SkillLevel, category: "Technology" },
  { name: "TypeScript", level: "ADVANCED" as SkillLevel, category: "Technology" },
  { name: "Vue.js", level: "INTERMEDIATE" as SkillLevel, category: "Technology" },
  { name: "Angular", level: "BEGINNER" as SkillLevel, category: "Technology" },
  { name: "PHP Development", level: "INTERMEDIATE" as SkillLevel, category: "Technology" },
  { name: "Java Programming", level: "ADVANCED" as SkillLevel, category: "Technology" },
  { name: "C# Development", level: "INTERMEDIATE" as SkillLevel, category: "Technology" },
  { name: "Flutter Development", level: "ADVANCED" as SkillLevel, category: "Technology" },
  { name: "Swift Development", level: "INTERMEDIATE" as SkillLevel, category: "Technology" },
  { name: "DevOps", level: "ADVANCED" as SkillLevel, category: "Technology" },
  { name: "AWS Cloud", level: "INTERMEDIATE" as SkillLevel, category: "Technology" },
  { name: "Docker", level: "ADVANCED" as SkillLevel, category: "Technology" },

  // Design Skills
  { name: "UI/UX Design", level: "ADVANCED" as SkillLevel, category: "Creative" },
  { name: "Graphic Design", level: "EXPERT" as SkillLevel, category: "Creative" },
  { name: "Logo Design", level: "INTERMEDIATE" as SkillLevel, category: "Creative" },
  { name: "Web Design", level: "ADVANCED" as SkillLevel, category: "Creative" },
  { name: "Illustration", level: "INTERMEDIATE" as SkillLevel, category: "Creative" },
  { name: "Photography", level: "ADVANCED" as SkillLevel, category: "Creative" },
  { name: "Video Editing", level: "INTERMEDIATE" as SkillLevel, category: "Creative" },
  { name: "Motion Graphics", level: "ADVANCED" as SkillLevel, category: "Creative" },
  { name: "3D Modeling", level: "INTERMEDIATE" as SkillLevel, category: "Creative" },

  // Business Skills
  { name: "Digital Marketing", level: "EXPERT" as SkillLevel, category: "Business" },
  { name: "SEO Optimization", level: "ADVANCED" as SkillLevel, category: "Business" },
  { name: "Social Media Marketing", level: "INTERMEDIATE" as SkillLevel, category: "Business" },
  { name: "Project Management", level: "ADVANCED" as SkillLevel, category: "Business" },
  { name: "Business Analysis", level: "INTERMEDIATE" as SkillLevel, category: "Business" },
  { name: "Content Writing", level: "ADVANCED" as SkillLevel, category: "Business" },
  { name: "Email Marketing", level: "INTERMEDIATE" as SkillLevel, category: "Business" },
  { name: "Sales Strategy", level: "ADVANCED" as SkillLevel, category: "Business" },

  // Creative Skills
  { name: "Music Production", level: "INTERMEDIATE" as SkillLevel, category: "Music" },
  { name: "Guitar Playing", level: "ADVANCED" as SkillLevel, category: "Music" },
  { name: "Piano Playing", level: "INTERMEDIATE" as SkillLevel, category: "Music" },
  { name: "Creative Writing", level: "ADVANCED" as SkillLevel, category: "Creative" },
  { name: "Pottery", level: "BEGINNER" as SkillLevel, category: "Crafts" },
  { name: "Woodworking", level: "INTERMEDIATE" as SkillLevel, category: "Crafts" },

  // Language Skills
  { name: "Spanish Language", level: "INTERMEDIATE" as SkillLevel, category: "Language" },
  { name: "French Language", level: "BEGINNER" as SkillLevel, category: "Language" },
  { name: "German Language", level: "INTERMEDIATE" as SkillLevel, category: "Language" },
  { name: "Mandarin Chinese", level: "BEGINNER" as SkillLevel, category: "Language" },
  { name: "Japanese Language", level: "INTERMEDIATE" as SkillLevel, category: "Language" },

  // Health & Fitness
  { name: "Personal Training", level: "EXPERT" as SkillLevel, category: "Health" },
  { name: "Yoga Instruction", level: "ADVANCED" as SkillLevel, category: "Health" },
  { name: "Nutrition Coaching", level: "INTERMEDIATE" as SkillLevel, category: "Health" },
  { name: "Meditation", level: "ADVANCED" as SkillLevel, category: "Health" },
  { name: "Massage Therapy", level: "EXPERT" as SkillLevel, category: "Health" },

  // Education
  { name: "Math Tutoring", level: "ADVANCED" as SkillLevel, category: "Education" },
  { name: "Science Teaching", level: "EXPERT" as SkillLevel, category: "Education" },
  { name: "English Tutoring", level: "ADVANCED" as SkillLevel, category: "Education" },
  { name: "Test Preparation", level: "INTERMEDIATE" as SkillLevel, category: "Education" },

  // Cooking
  { name: "Italian Cooking", level: "ADVANCED" as SkillLevel, category: "Cooking" },
  { name: "Baking", level: "INTERMEDIATE" as SkillLevel, category: "Cooking" },
  { name: "Vegetarian Cooking", level: "EXPERT" as SkillLevel, category: "Cooking" },
  { name: "Wine Pairing", level: "ADVANCED" as SkillLevel, category: "Cooking" },
]

const sampleInterests = [
  { name: "Machine Learning", category: "Technology" },
  { name: "Blockchain Development", category: "Technology" },
  { name: "Mobile App Development", category: "Technology" },
  { name: "Data Science", category: "Technology" },
  { name: "Cybersecurity", category: "Technology" },
  { name: "Artificial Intelligence", category: "Technology" },

  { name: "Brand Design", category: "Creative" },
  { name: "Product Photography", category: "Creative" },
  { name: "Interior Design", category: "Creative" },
  { name: "Fashion Design", category: "Creative" },
  { name: "Animation", category: "Creative" },

  { name: "Public Speaking", category: "Business" },
  { name: "Leadership", category: "Business" },
  { name: "Entrepreneurship", category: "Business" },
  { name: "Financial Planning", category: "Business" },
  { name: "Negotiation", category: "Business" },

  { name: "Gardening", category: "Lifestyle" },
  { name: "Travel Planning", category: "Lifestyle" },
  { name: "Home Organization", category: "Lifestyle" },
  { name: "Personal Styling", category: "Lifestyle" },

  { name: "Italian Language", category: "Language" },
  { name: "Portuguese Language", category: "Language" },
  { name: "Korean Language", category: "Language" },
  { name: "Arabic Language", category: "Language" },

  { name: "Rock Climbing", category: "Sports" },
  { name: "Swimming", category: "Sports" },
  { name: "Tennis", category: "Sports" },
  { name: "Martial Arts", category: "Sports" },

  { name: "Violin Playing", category: "Music" },
  { name: "Drums", category: "Music" },
  { name: "Singing", category: "Music" },
  { name: "Music Theory", category: "Music" },
]

const sampleUsers = [
  {
    email: "sarah.chen@example.com",
    username: "sarahchen",
    firstName: "Sarah",
    lastName: "Chen",
    bio: "Full-stack developer with 5+ years of experience in React, Node.js, and TypeScript. Passionate about clean code and user experience.",
    location: "San Francisco, CA",
    rating: 4.9,
    totalRatings: 23,
    isVerified: true,
  },
  {
    email: "marcus.johnson@example.com",
    username: "marcusj",
    firstName: "Marcus",
    lastName: "Johnson",
    bio: "Professional photographer specializing in portraits and events. Love capturing moments and teaching others the art of photography.",
    location: "Austin, TX",
    rating: 4.8,
    totalRatings: 31,
    isVerified: true,
  },
  {
    email: "elena.rodriguez@example.com",
    username: "elenarod",
    firstName: "Elena",
    lastName: "Rodriguez",
    bio: "Digital marketing strategist with expertise in SEO, social media, and content marketing. Helping businesses grow online.",
    location: "Miami, FL",
    rating: 5.0,
    totalRatings: 18,
    isVerified: true,
  },
  {
    email: "david.park@example.com",
    username: "davidpark",
    firstName: "David",
    lastName: "Park",
    bio: "Multilingual educator fluent in Spanish, Korean, and English. Passionate about language learning and cultural exchange.",
    location: "Seattle, WA",
    rating: 4.7,
    totalRatings: 42,
    isVerified: false,
  },
  {
    email: "maya.thompson@example.com",
    username: "mayat",
    firstName: "Maya",
    lastName: "Thompson",
    bio: "Certified personal trainer and yoga instructor. Helping people achieve their fitness goals and find inner peace.",
    location: "Denver, CO",
    rating: 4.9,
    totalRatings: 27,
    isVerified: true,
  },
  {
    email: "alex.kumar@example.com",
    username: "alexk",
    firstName: "Alex",
    lastName: "Kumar",
    bio: "Creative graphic designer with a passion for branding and illustration. Always looking to learn new creative skills.",
    location: "Portland, OR",
    rating: 4.8,
    totalRatings: 35,
    isVerified: true,
  },
  {
    email: "jessica.white@example.com",
    username: "jessicaw",
    firstName: "Jessica",
    lastName: "White",
    bio: "Professional chef and culinary instructor. Love sharing cooking techniques and exploring international cuisines.",
    location: "New York, NY",
    rating: 4.6,
    totalRatings: 19,
    isVerified: false,
  },
  {
    email: "ryan.mitchell@example.com",
    username: "ryanm",
    firstName: "Ryan",
    lastName: "Mitchell",
    bio: "Music producer and guitar instructor with 10+ years of experience. Passionate about helping others discover their musical talents.",
    location: "Nashville, TN",
    rating: 4.7,
    totalRatings: 28,
    isVerified: true,
  },
  {
    email: "lisa.anderson@example.com",
    username: "lisaa",
    firstName: "Lisa",
    lastName: "Anderson",
    bio: "Business consultant specializing in startup strategy and operations. Love helping entrepreneurs turn ideas into reality.",
    location: "Chicago, IL",
    rating: 4.8,
    totalRatings: 22,
    isVerified: true,
  },
  {
    email: "tom.garcia@example.com",
    username: "tomg",
    firstName: "Tom",
    lastName: "Garcia",
    bio: "Woodworking craftsman and furniture maker. Enjoy teaching traditional woodworking techniques and sustainable practices.",
    location: "Portland, OR",
    rating: 4.5,
    totalRatings: 15,
    isVerified: false,
  },
]

const sampleSkillRequests = [
  // Tech & Development
  {
    title: "Need React Developer for E-commerce Frontend",
    description:
      "I'm building an online marketplace and need help creating a modern, responsive frontend using React and TypeScript. The project includes product listings, shopping cart, user authentication, and payment integration.",
    skillNeeded: "React Development",
    skillOffered: "UI/UX Design",
    category: "Technology",
    estimatedDuration: "6 weeks",
    deadline: new Date("2024-03-15"),
    location: "San Francisco, CA",
    isRemote: true,
    requirements: [
      "3+ years React experience",
      "TypeScript proficiency",
      "Experience with state management (Redux/Zustand)",
      "Knowledge of REST APIs",
      "Responsive design skills",
    ],
    deliverables: [
      "Complete React frontend application",
      "Responsive design for mobile/desktop",
      "Integration with backend APIs",
      "Unit tests for components",
      "Documentation",
    ],
    tags: ["react", "typescript", "frontend", "ecommerce", "javascript"],
    status: "OPEN",
  },
  {
    title: "Python Backend API Development",
    description:
      "Looking for a Python developer to help build a RESTful API for a social media analytics platform. Need expertise in FastAPI, PostgreSQL, and data processing.",
    skillNeeded: "Python Backend Development",
    skillOffered: "Data Analysis & Visualization",
    category: "Technology",
    estimatedDuration: "4 weeks",
    deadline: new Date("2024-02-28"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Strong Python skills",
      "FastAPI or Django experience",
      "PostgreSQL database knowledge",
      "API design best practices",
      "Docker containerization",
    ],
    deliverables: [
      "Complete REST API",
      "Database schema design",
      "API documentation",
      "Docker deployment setup",
      "Unit and integration tests",
    ],
    tags: ["python", "fastapi", "backend", "api", "postgresql"],
    status: "OPEN",
  },
  {
    title: "Brand Identity Design for Tech Startup",
    description:
      "Looking for a talented graphic designer to create a complete brand identity for my AI-powered productivity app. Need logo, color palette, typography, and brand guidelines.",
    skillNeeded: "Brand Identity Design",
    skillOffered: "Digital Marketing Strategy",
    category: "Creative",
    estimatedDuration: "3 weeks",
    deadline: new Date("2024-02-20"),
    location: "New York, NY",
    isRemote: true,
    requirements: [
      "Strong portfolio in brand design",
      "Experience with tech/startup branding",
      "Proficiency in Adobe Creative Suite",
      "Understanding of modern design trends",
      "Ability to create scalable brand systems",
    ],
    deliverables: [
      "Logo design (multiple variations)",
      "Brand color palette",
      "Typography system",
      "Brand guidelines document",
      "Business card and letterhead designs",
    ],
    tags: ["branding", "logo", "design", "startup", "identity"],
    status: "OPEN",
  },
  {
    title: "Spanish Language Tutoring",
    description:
      "Looking for a native Spanish speaker to help me become conversational in Spanish for business purposes. Need structured lessons and conversation practice.",
    skillNeeded: "Spanish Language Tutoring",
    skillOffered: "English Language Tutoring",
    category: "Language",
    estimatedDuration: "12 weeks",
    deadline: new Date("2024-05-01"),
    location: "Denver, CO",
    isRemote: true,
    requirements: [
      "Native or near-native Spanish fluency",
      "Teaching or tutoring experience",
      "Business Spanish knowledge",
      "Structured lesson planning abilities",
      "Patience and communication skills",
    ],
    deliverables: [
      "Customized learning curriculum",
      "Weekly 1-hour lessons",
      "Homework assignments and materials",
      "Progress assessments",
      "Business Spanish conversation practice",
    ],
    tags: ["spanish", "language", "tutoring", "business", "conversation"],
    status: "OPEN",
  },
  {
    title: "Personal Training Program Design",
    description:
      "Need a certified trainer to create a custom workout program for weight loss and strength building. I'm a busy professional with limited time.",
    skillNeeded: "Personal Training",
    skillOffered: "Nutrition Consulting",
    category: "Health",
    estimatedDuration: "8 weeks",
    deadline: new Date("2024-03-30"),
    location: "Phoenix, AZ",
    isRemote: true,
    requirements: [
      "Certified personal trainer",
      "Weight loss specialization",
      "Strength training expertise",
      "Busy professional experience",
      "Online coaching capability",
    ],
    deliverables: [
      "Personalized workout plan",
      "Progressive training schedule",
      "Exercise video demonstrations",
      "Progress tracking system",
      "Nutrition guidance integration",
    ],
    tags: ["fitness", "training", "weight-loss", "strength", "coaching"],
    status: "OPEN",
  },
]

interface UserSkillInput {
  userId: string;
  name: string;
  level: SkillLevel;
  category: string;
}

interface UserInterestInput {
  userId: string;
  name: string;
  category: string;
}


async function main() {
  console.log("🌱 Starting comprehensive database seed...")

  // Clear existing data in correct order (respecting foreign key constraints)
  console.log("🧹 Cleaning existing data...")
  await prisma.review.deleteMany()
  await prisma.application.deleteMany()
  await prisma.skillRequestView.deleteMany()
  await prisma.skillRequest.deleteMany()
  await prisma.userInterest.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log("👥 Creating users...")
  const hashedPassword = await bcrypt.hash("password123", 10)

  const createdUsers = [] as User[]
  for (let i = 0; i < sampleUsers.length; i++) {
    const userData = sampleUsers[i]
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        avatar: avatarUrls[i % avatarUrls.length],
      },
    })
    createdUsers.push(user)
    console.log(`✅ Created user: ${user.firstName} ${user.lastName}`)
  }

  // Create user skills
  console.log("🎯 Creating user skills...")
  let skillCount = 0
  for (const user of createdUsers) {
    // Each user gets 3-6 random skills
    const numSkills = Math.floor(Math.random() * 4) + 3
    const userSkills:UserSkillInput[] =[]

    for (let i = 0; i < numSkills; i++) {
      const randomSkill = sampleSkills[Math.floor(Math.random() * sampleSkills.length)]

      // Avoid duplicates
      if (!userSkills.find((s) => s.name === randomSkill.name)) {
        userSkills.push({
          userId: user.id,
          name: randomSkill.name,
          level: randomSkill.level as SkillLevel,
          category: randomSkill.category,
        })
      }
    }

    if (userSkills.length > 0) {
      await prisma.userSkill.createMany({
        data: userSkills,
        skipDuplicates: true,
      })
      skillCount += userSkills.length
    }
  }
  console.log(`✅ Created ${skillCount} user skills`)

  // Create user interests
  console.log("💡 Creating user interests...")
  let interestCount = 0
  for (const user of createdUsers) {
    // Each user gets 2-4 random interests
    const numInterests = Math.floor(Math.random() * 3) + 2
    const userInterests:UserInterestInput[] = []

    for (let i = 0; i < numInterests; i++) {
      const randomInterest = sampleInterests[Math.floor(Math.random() * sampleInterests.length)]

      // Avoid duplicates
      if (!userInterests.find((int) => int.name === randomInterest.name)) {
        userInterests.push({
          userId: user.id,
          name: randomInterest.name,
          category: randomInterest.category,
        })
      }
    }

    if (userInterests.length > 0) {
      await prisma.userInterest.createMany({
        data: userInterests,
        skipDuplicates: true,
      })
      interestCount += userInterests.length
    }
  }
  console.log(`✅ Created ${interestCount} user interests`)

  // Create skill requests
  console.log("📋 Creating skill requests...")
  const createdSkillRequests: SkillRequest[] = []
  for (let i = 0; i < sampleSkillRequests.length; i++) {
    const requestData = sampleSkillRequests[i]
    const randomAuthor = createdUsers[i % createdUsers.length]

    const skillRequest = await prisma.skillRequest.create({
      data: {
        ...requestData,
        authorId: randomAuthor.id,
        deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: Math.random() > 0.7 ? "IN_PROGRESS" : "OPEN",
      },
    })
    createdSkillRequests.push(skillRequest)
    console.log(`✅ Created skill request: ${skillRequest.title}`)
  }

  // Create applications
  console.log("📝 Creating applications...")
  const createdApplications: Application[] = []
  for (const skillRequest of createdSkillRequests) {
    const numApplications = Math.floor(Math.random() * 4) + 1

    for (let i = 0; i < numApplications; i++) {
      const availableApplicants = createdUsers.filter((user) => user.id !== skillRequest.authorId)
      const randomApplicant = availableApplicants[Math.floor(Math.random() * availableApplicants.length)]

      const existingApplication = createdApplications.find(
        (app) => app.skillRequestId === skillRequest.id && app.applicantId === randomApplicant.id,
      )

      if (!existingApplication) {
        const applicationMessages = [
          "I'm very interested in this opportunity and believe my skills would be a perfect match.",
          "This sounds like an exciting collaboration! I've been looking for exactly this type of skill exchange.",
          "I'd love to work with you on this project. I have a strong portfolio and can provide references.",
          "Your skill request caught my attention because it's exactly what I've been hoping to find.",
          "I'm passionate about skill sharing and this opportunity seems perfect.",
        ]

        const statuses = ["PENDING", "ACCEPTED", "REJECTED"]
        const status = statuses[Math.floor(Math.random() * statuses.length)] as any

        const application = await prisma.application.create({
          data: {
            skillRequestId: skillRequest.id,
            applicantId: randomApplicant.id,
            message: applicationMessages[Math.floor(Math.random() * applicationMessages.length)],
            proposedTimeline: `${Math.floor(Math.random() * 4) + 1} weeks`,
            portfolio: ["https://example.com/portfolio1", "https://example.com/portfolio2"],
            experience: `${Math.floor(Math.random() * 8) + 2} years of professional experience`,
            whyChooseMe: "I bring years of professional experience and a track record of successful collaborations.",
            status: status,
            responseMessage: status !== "PENDING" ? "Thank you for your application!" : null,
            respondedAt: status !== "PENDING" ? new Date() : null,
          },
        })
        createdApplications.push(application)
      }
    }
  }
  console.log(`✅ Created ${createdApplications.length} applications`)

  // Create skill request views
  console.log("👀 Creating skill request views...")
  let viewCount = 0
  for (const skillRequest of createdSkillRequests) {
    const numViews = Math.floor(Math.random() * 16) + 5

    for (let i = 0; i < numViews; i++) {
      const randomViewer = createdUsers[Math.floor(Math.random() * createdUsers.length)]

      try {
        await prisma.skillRequestView.create({
          data: {
            userId: randomViewer.id,
            skillRequestId: skillRequest.id,
            viewedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          },
        })
        viewCount++
      } catch (error) {
        // Skip if duplicate view
      }
    }
  }
  console.log(`✅ Created ${viewCount} skill request views`)

  // Create reviews for completed applications
  console.log("⭐ Creating reviews...")
  const completedApplications = createdApplications.filter((app) => app.status === "ACCEPTED")
  let reviewCount = 0

  for (const application of completedApplications.slice(0, 5)) {
    const reviewComments = [
      "Excellent collaboration! Very professional, delivered exactly what was promised.",
      "Outstanding experience. Clear communication, high-quality work, and went above and beyond.",
      "Fantastic skill exchange. Learned so much and the teaching style was perfect.",
      "Highly recommend! Professional, reliable, and exceeded my expectations.",
      "Great experience overall. Good communication and delivered quality results on time.",
    ]

    const skillRequest = await prisma.skillRequest.findUnique({
      where: { id: application.skillRequestId },
    })

    if (skillRequest) {
      await prisma.review.create({
        data: {
          applicationId: application.id,
          giverId: skillRequest.authorId,
          receiverId: application.applicantId,
          rating: Math.floor(Math.random() * 2) + 4, // Rating between 4-5
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        },
      })
      reviewCount++
    }
  }
  console.log(`✅ Created ${reviewCount} reviews`)

  // Update user ratings based on reviews
  console.log("📊 Updating user ratings...")
  for (const user of createdUsers) {
    const reviews = await prisma.review.findMany({
      where: { receiverId: user.id },
    })

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      await prisma.user.update({
        where: { id: user.id },
        data: {
          rating: Math.round(averageRating * 10) / 10,
          totalRatings: reviews.length,
        },
      })
    }
  }

  console.log("🎉 Database seeding completed successfully!")
  console.log(`
📊 Summary:
- Users: ${createdUsers.length}
- User Skills: ${skillCount}
- User Interests: ${interestCount}
- Skill Requests: ${createdSkillRequests.length}
- Applications: ${createdApplications.length}
- Views: ${viewCount}
- Reviews: ${reviewCount}
  `)
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
