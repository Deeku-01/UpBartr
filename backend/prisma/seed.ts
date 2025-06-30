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
  
  // Additional 20 requests
  {
    title: "Mobile App Development - Flutter/Dart",
    description:
      "Building a meditation and mindfulness app that needs cross-platform mobile development. Looking for Flutter expertise to create a beautiful, performant app with offline capabilities.",
    skillNeeded: "Flutter Mobile Development",
    skillOffered: "Content Writing & Copy",
    category: "Technology",
    estimatedDuration: "10 weeks",
    deadline: new Date("2024-04-15"),
    location: "Austin, TX",
    isRemote: true,
    requirements: [
      "2+ years Flutter/Dart experience",
      "State management (Provider/Riverpod)",
      "SQLite local database",
      "Push notifications implementation",
      "App store deployment experience",
    ],
    deliverables: [
      "Cross-platform mobile app",
      "Offline data synchronization",
      "Push notification system",
      "App store ready builds",
      "User onboarding flow",
    ],
    tags: ["flutter", "dart", "mobile", "meditation", "crossplatform"],
    status: "OPEN",
  },
  {
    title: "DevOps & AWS Cloud Infrastructure",
    description:
      "Need help setting up scalable cloud infrastructure for a SaaS product. Looking for AWS expertise including ECS, RDS, CloudFormation, and monitoring setup.",
    skillNeeded: "DevOps & Cloud Infrastructure",
    skillOffered: "Product Management Consulting",
    category: "Technology",
    estimatedDuration: "5 weeks",
    deadline: new Date("2024-03-01"),
    location: "Seattle, WA",
    isRemote: true,
    requirements: [
      "AWS certification preferred",
      "Docker and containerization",
      "Infrastructure as Code (Terraform/CloudFormation)",
      "CI/CD pipeline setup",
      "Monitoring and logging (CloudWatch)",
    ],
    deliverables: [
      "Complete AWS infrastructure setup",
      "Automated deployment pipelines",
      "Monitoring and alerting system",
      "Security best practices implementation",
      "Documentation and runbooks",
    ],
    tags: ["aws", "devops", "cloud", "infrastructure", "docker"],
    status: "OPEN",
  },
  {
    title: "Video Editing for YouTube Channel",
    description:
      "Starting a tech education YouTube channel and need professional video editing services. Looking for someone who can create engaging content with animations and graphics.",
    skillNeeded: "Video Editing & Post-Production",
    skillOffered: "Script Writing & Storytelling",
    category: "Creative",
    estimatedDuration: "Ongoing",
    deadline: new Date("2024-12-31"),
    location: "Los Angeles, CA",
    isRemote: true,
    requirements: [
      "Proficiency in Adobe Premiere Pro or Final Cut",
      "Motion graphics and animation skills",
      "YouTube content optimization knowledge",
      "Color grading and audio editing",
      "Fast turnaround capabilities",
    ],
    deliverables: [
      "Weekly edited video content",
      "Custom intro/outro animations",
      "Thumbnail design templates",
      "Social media clips extraction",
      "YouTube SEO optimization",
    ],
    tags: ["video", "editing", "youtube", "content", "animation"],
    status: "OPEN",
  },
  {
    title: "French Language Conversation Partner",
    description:
      "Intermediate French learner seeking native speaker for weekly conversation practice. Planning to take DELF B2 exam and need help with fluency and pronunciation.",
    skillNeeded: "French Language Tutoring",
    skillOffered: "Photography & Photo Editing",
    category: "Language",
    estimatedDuration: "16 weeks",
    deadline: new Date("2024-06-01"),
    location: "Boston, MA",
    isRemote: true,
    requirements: [
      "Native French speaker",
      "Experience with exam preparation",
      "Patient and encouraging teaching style",
      "Flexible scheduling availability",
      "Cultural knowledge sharing",
    ],
    deliverables: [
      "Weekly 90-minute conversation sessions",
      "DELF B2 exam preparation materials",
      "Pronunciation correction feedback",
      "Cultural context explanations",
      "Progress tracking and assessments",
    ],
    tags: ["french", "language", "conversation", "delf", "exam"],
    status: "OPEN",
  },
  {
    title: "Yoga Instruction for Beginners",
    description:
      "Complete yoga beginner looking for patient instructor to teach fundamentals. Interested in stress relief and flexibility improvement through gentle practice.",
    skillNeeded: "Yoga Instruction",
    skillOffered: "Bookkeeping & Financial Planning",
    category: "Health",
    estimatedDuration: "12 weeks",
    deadline: new Date("2024-05-15"),
    location: "Portland, OR",
    isRemote: true,
    requirements: [
      "200-hour yoga teacher certification",
      "Beginner-friendly teaching approach",
      "Stress relief and flexibility focus",
      "Online class delivery experience",
      "Modification and prop usage knowledge",
    ],
    deliverables: [
      "Customized beginner program",
      "Bi-weekly 1-hour sessions",
      "Home practice routine development",
      "Proper alignment instruction",
      "Stress management techniques",
    ],
    tags: ["yoga", "beginners", "stress", "flexibility", "wellness"],
    status: "OPEN",
  },
  {
    title: "SEO & Content Marketing Strategy",
    description:
      "Small business owner needing help with SEO optimization and content marketing strategy. Want to improve organic search rankings and drive more qualified traffic.",
    skillNeeded: "SEO & Content Marketing",
    skillOffered: "Social Media Management",
    category: "Marketing",
    estimatedDuration: "6 weeks",
    deadline: new Date("2024-03-20"),
    location: "Chicago, IL",
    isRemote: true,
    requirements: [
      "Proven SEO track record",
      "Keyword research expertise",
      "Content strategy development",
      "Google Analytics proficiency",
      "Local SEO knowledge",
    ],
    deliverables: [
      "Complete SEO audit and recommendations",
      "Keyword research and strategy",
      "Content calendar for 3 months",
      "On-page optimization guidelines",
      "Performance tracking setup",
    ],
    tags: ["seo", "content", "marketing", "analytics", "keywords"],
    status: "OPEN",
  },
  {
    title: "Data Science & Machine Learning Consultation",
    description:
      "E-commerce company needs help implementing recommendation algorithms and customer segmentation. Looking for ML expertise to improve personalization and sales.",
    skillNeeded: "Data Science & Machine Learning",
    skillOffered: "Business Strategy Consulting",
    category: "Technology",
    estimatedDuration: "8 weeks",
    deadline: new Date("2024-04-01"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Strong Python/R programming skills",
      "Machine learning algorithms expertise",
      "E-commerce analytics experience",
      "Statistical analysis proficiency",
      "Model deployment knowledge",
    ],
    deliverables: [
      "Customer segmentation analysis",
      "Recommendation system implementation",
      "Predictive analytics models",
      "Performance metrics dashboard",
      "Model documentation and training",
    ],
    tags: ["datascience", "machinelearning", "ecommerce", "analytics", "python"],
    status: "OPEN",
  },
  {
    title: "Wedding Photography Services",
    description:
      "Getting married in spring and looking for a talented photographer to capture our special day. Need someone with experience in outdoor ceremonies and natural lighting.",
    skillNeeded: "Wedding Photography",
    skillOffered: "Event Planning & Coordination",
    category: "Creative",
    estimatedDuration: "1 day + editing",
    deadline: new Date("2024-04-20"),
    location: "Nashville, TN",
    isRemote: false,
    requirements: [
      "Professional wedding photography portfolio",
      "Outdoor ceremony experience",
      "Natural light photography expertise",
      "Quick turnaround for edited photos",
      "Backup equipment and contingency plans",
    ],
    deliverables: [
      "8-hour wedding day coverage",
      "500+ edited high-resolution photos",
      "Online gallery for sharing",
      "Print-ready files",
      "2-3 week delivery timeline",
    ],
    tags: ["wedding", "photography", "outdoor", "ceremony", "portraits"],
    status: "OPEN",
  },
  {
    title: "German Language Immersion Coaching",
    description:
      "Advanced German student preparing for C1 certification and job interviews in Germany. Need intensive coaching focusing on business German and cultural nuances.",
    skillNeeded: "German Language Coaching",
    skillOffered: "Technical Writing & Documentation",
    category: "Language",
    estimatedDuration: "10 weeks",
    deadline: new Date("2024-04-30"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Native German speaker",
      "Business German expertise",
      "C1 exam preparation experience",
      "Job interview coaching skills",
      "Cultural integration guidance",
    ],
    deliverables: [
      "Intensive weekly coaching sessions",
      "Business German curriculum",
      "Mock interview practice",
      "Cultural etiquette guidance",
      "C1 exam preparation materials",
    ],
    tags: ["german", "business", "c1", "interviews", "cultural"],
    status: "OPEN",
  },
  {
    title: "Nutrition Counseling for Athletes",
    description:
      "Competitive runner training for marathons needs specialized nutrition guidance. Looking for sports nutrition expertise to optimize performance and recovery.",
    skillNeeded: "Sports Nutrition Counseling",
    skillOffered: "Running & Endurance Coaching",
    category: "Health",
    estimatedDuration: "12 weeks",
    deadline: new Date("2024-06-15"),
    location: "Boulder, CO",
    isRemote: true,
    requirements: [
      "Registered dietitian certification",
      "Sports nutrition specialization",
      "Endurance athlete experience",
      "Meal planning expertise",
      "Supplement knowledge",
    ],
    deliverables: [
      "Personalized nutrition plan",
      "Race day fueling strategy",
      "Recovery meal guidelines",
      "Supplement recommendations",
      "Monthly progress assessments",
    ],
    tags: ["nutrition", "sports", "marathon", "performance", "recovery"],
    status: "OPEN",
  },
  {
    title: "Blockchain Smart Contract Development",
    description:
      "DeFi project needs Solidity developer to create secure smart contracts for yield farming platform. Must have experience with DeFi protocols and security audits.",
    skillNeeded: "Blockchain Development",
    skillOffered: "Cryptocurrency Trading Strategy",
    category: "Technology",
    estimatedDuration: "7 weeks",
    deadline: new Date("2024-03-25"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Solidity programming expertise",
      "DeFi protocol development experience",
      "Smart contract security best practices",
      "Gas optimization knowledge",
      "Testing framework proficiency",
    ],
    deliverables: [
      "Secure smart contracts",
      "Comprehensive testing suite",
      "Gas optimization implementation",
      "Security audit preparation",
      "Technical documentation",
    ],
    tags: ["blockchain", "solidity", "defi", "smartcontracts", "ethereum"],
    status: "OPEN",
  },
  {
    title: "Music Production & Mixing",
    description:
      "Singer-songwriter with demo tracks needs professional mixing and mastering. Looking for producer who can enhance acoustic recordings with subtle electronic elements.",
    skillNeeded: "Music Production & Mixing",
    skillOffered: "Vocal Coaching & Performance",
    category: "Creative",
    estimatedDuration: "4 weeks",
    deadline: new Date("2024-02-25"),
    location: "Nashville, TN",
    isRemote: true,
    requirements: [
      "Professional mixing experience",
      "Acoustic music specialization",
      "Electronic elements integration",
      "Mastering capabilities",
      "Industry-standard equipment/software",
    ],
    deliverables: [
      "Mixed and mastered 5-song EP",
      "Stems for live performance",
      "Radio-ready masters",
      "Mixing notes and feedback",
      "Revision rounds included",
    ],
    tags: ["music", "production", "mixing", "acoustic", "electronic"],
    status: "OPEN",
  },
  {
    title: "3D Modeling & Animation for Game",
    description:
      "Indie game developer needs 3D artist for character modeling and animation. Creating a fantasy RPG with stylized art direction requiring creative and technical skills.",
    skillNeeded: "3D Modeling & Animation",
    skillOffered: "Game Design & Programming",
    category: "Creative",
    estimatedDuration: "12 weeks",
    deadline: new Date("2024-05-30"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Proficiency in Blender or Maya",
      "Character modeling expertise",
      "Animation and rigging skills",
      "Game-ready asset optimization",
      "Fantasy art style experience",
    ],
    deliverables: [
      "6 fully rigged character models",
      "Animation sets for each character",
      "Game-optimized textures",
      "Asset integration documentation",
      "Style guide adherence",
    ],
    tags: ["3d", "modeling", "animation", "game", "fantasy"],
    status: "OPEN",
  },
  {
    title: "Italian Cooking Classes",
    description:
      "Food enthusiast wanting to learn authentic Italian cooking techniques from a native chef. Interested in regional specialties and traditional family recipes.",
    skillNeeded: "Italian Cooking Instruction",
    skillOffered: "Wine Tasting & Sommelier Knowledge",
    category: "Culinary",
    estimatedDuration: "8 weeks",
    deadline: new Date("2024-04-10"),
    location: "San Francisco, CA",
    isRemote: false,
    requirements: [
      "Native Italian or extensive Italy experience",
      "Professional cooking background",
      "Regional cuisine knowledge",
      "Teaching and demonstration skills",
      "Traditional technique expertise",
    ],
    deliverables: [
      "Weekly hands-on cooking classes",
      "Traditional recipe collection",
      "Technique demonstration videos",
      "Regional cuisine exploration",
      "Shopping and ingredient guidance",
    ],
    tags: ["italian", "cooking", "traditional", "regional", "handson"],
    status: "OPEN",
  },
  {
    title: "Mandarin Chinese Business Language",
    description:
      "Business professional expanding into Chinese markets needs intensive Mandarin training focused on business communications, negotiations, and cultural protocols.",
    skillNeeded: "Mandarin Chinese Tutoring",
    skillOffered: "International Business Consulting",
    category: "Language",
    estimatedDuration: "20 weeks",
    deadline: new Date("2024-07-01"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Native Mandarin speaker",
      "Business Chinese specialization",
      "Cultural communication expertise",
      "HSK exam preparation ability",
      "Flexible scheduling for time zones",
    ],
    deliverables: [
      "Intensive business Chinese curriculum",
      "Weekly conversation practice",
      "Cultural etiquette training",
      "Business document translation practice",
      "HSK Level 4-5 preparation",
    ],
    tags: ["mandarin", "business", "chinese", "cultural", "hsk"],
    status: "OPEN",
  },
  {
    title: "Mental Health Counseling Support",
    description:
      "Young professional dealing with work stress and anxiety seeking therapeutic support. Looking for licensed counselor specializing in anxiety and work-life balance.",
    skillNeeded: "Mental Health Counseling",
    skillOffered: "Life Coaching & Goal Setting",
    category: "Health",
    estimatedDuration: "16 weeks",
    deadline: new Date("2024-06-30"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Licensed mental health professional",
      "Anxiety and stress specialization",
      "Young adult therapy experience",
      "Work-life balance expertise",
      "Online therapy platform familiarity",
    ],
    deliverables: [
      "Weekly therapy sessions",
      "Coping strategy development",
      "Stress management techniques",
      "Goal-setting frameworks",
      "Progress tracking and evaluation",
    ],
    tags: ["mentalhealth", "anxiety", "stress", "therapy", "worklife"],
    status: "OPEN",
  },
  {
    title: "Architectural Visualization & Rendering",
    description:
      "Architecture firm needs 3D visualization expert for client presentations. Require photorealistic renderings of residential and commercial projects with landscape integration.",
    skillNeeded: "Architectural Visualization",
    skillOffered: "AutoCAD Drafting Services",
    category: "Creative",
    estimatedDuration: "6 weeks",
    deadline: new Date("2024-03-10"),
    location: "Miami, FL",
    isRemote: true,
    requirements: [
      "3ds Max or SketchUp proficiency",
      "V-Ray or Corona rendering experience",
      "Photorealistic visualization skills",
      "Landscape integration ability",
      "Client presentation experience",
    ],
    deliverables: [
      "High-resolution architectural renderings",
      "Multiple angle perspectives",
      "Day/night lighting scenarios",
      "Landscape and context integration",
      "Client presentation materials",
    ],
    tags: ["architecture", "visualization", "rendering", "3d", "photorealistic"],
    status: "OPEN",
  },
  {
    title: "Podcast Production & Audio Engineering",
    description:
      "Starting a business podcast and need professional audio production. Looking for someone to handle recording, editing, sound design, and distribution optimization.",
    skillNeeded: "Podcast Production",
    skillOffered: "Content Strategy & Marketing",
    category: "Creative",
    estimatedDuration: "Ongoing",
    deadline: new Date("2024-12-31"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Professional audio editing skills",
      "Podcast production experience",
      "Sound design and mixing",
      "Distribution platform knowledge",
      "Consistent quality delivery",
    ],
    deliverables: [
      "Weekly episode production",
      "Professional audio editing",
      "Intro/outro music and branding",
      "Multi-platform distribution",
      "Audio quality optimization",
    ],
    tags: ["podcast", "audio", "production", "editing", "distribution"],
    status: "OPEN",
  },
  {
    title: "Cybersecurity Penetration Testing",
    description:
      "Small business needs comprehensive security assessment of web applications and network infrastructure. Looking for ethical hacker to identify vulnerabilities.",
    skillNeeded: "Cybersecurity & Penetration Testing",
    skillOffered: "IT Infrastructure Consulting",
    category: "Technology",
    estimatedDuration: "3 weeks",
    deadline: new Date("2024-02-15"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Certified Ethical Hacker (CEH) or similar",
      "Web application security testing",
      "Network penetration testing",
      "Vulnerability assessment experience",
      "Detailed reporting capabilities",
    ],
    deliverables: [
      "Comprehensive security assessment",
      "Vulnerability identification report",
      "Risk prioritization matrix",
      "Remediation recommendations",
      "Executive summary presentation",
    ],
    tags: ["cybersecurity", "pentesting", "security", "vulnerabilities", "assessment"],
    status: "OPEN",
  },
  {
    title: "Interior Design Consultation",
    description:
      "Recently purchased home needs complete interior design overhaul. Looking for designer to create modern, functional spaces that reflect personal style and maximize natural light.",
    skillNeeded: "Interior Design",
    skillOffered: "Real Estate Market Analysis",
    category: "Design",
    estimatedDuration: "10 weeks",
    deadline: new Date("2024-05-01"),
    location: "Atlanta, GA",
    isRemote: false,
    requirements: [
      "Interior design degree or certification",
      "Modern design aesthetic expertise",
      "Space planning and functionality focus",
      "Natural light optimization skills",
      "Budget-conscious design approach",
    ],
    deliverables: [
      "Complete home design concept",
      "Room-by-room design plans",
      "Furniture and decor recommendations",
      "Color palette and material selections",
      "3D visualizations of key spaces",
    ],
    tags: ["interior", "design", "modern", "space", "consultation"],
    status: "OPEN",
  },
  {
    title: "Legal Document Review & Drafting",
    description:
      "Startup founder needs legal expertise for contract review and business document drafting. Require help with vendor agreements, employment contracts, and terms of service.",
    skillNeeded: "Legal Document Services",
    skillOffered: "Business Development Strategy",
    category: "Legal",
    estimatedDuration: "4 weeks",
    deadline: new Date("2024-02-20"),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Licensed attorney with business law focus",
      "Contract drafting and review experience",
      "Startup and small business expertise",
      "Employment law knowledge",
      "Tech industry familiarity preferred",
    ],
    deliverables: [
      "Contract templates and standards",
      "Legal document review and revisions",
      "Compliance recommendations",
      "Risk assessment and mitigation",
      "Legal strategy consultation",
    ],
    tags: ["legal", "contracts", "business", "startup", "compliance"],
    status: "OPEN",
  }
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
