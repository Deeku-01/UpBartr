import { PrismaClient,SkillRequest,User,Application } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sample data arrays
const skillCategories = [
  'Technology',
  'Creative',
  'Business',
  'Education',
  'Health',
  'Music',
  'Language',
  'Crafts',
  'Sports',
  'Cooking'
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Denver, CO',
  'Portland, OR',
  'Miami, FL',
  'Chicago, IL',
  'Boston, MA',
  'Los Angeles, CA',
  'Atlanta, GA',
  'Nashville, TN'
];

const avatarUrls = [
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
];

const sampleUsers = [
  {
    email: 'sarah.chen@example.com',
    username: 'sarahchen',
    firstName: 'Sarah',
    lastName: 'Chen',
    bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and TypeScript. Passionate about clean code and user experience.',
    location: 'San Francisco, CA',
    rating: 4.9,
    totalRatings: 23,
    isVerified: true
  },
  {
    email: 'marcus.johnson@example.com',
    username: 'marcusj',
    firstName: 'Marcus',
    lastName: 'Johnson',
    bio: 'Professional photographer specializing in portraits and events. Love capturing moments and teaching others the art of photography.',
    location: 'Austin, TX',
    rating: 4.8,
    totalRatings: 31,
    isVerified: true
  },
  {
    email: 'elena.rodriguez@example.com',
    username: 'elenarod',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    bio: 'Digital marketing strategist with expertise in SEO, social media, and content marketing. Helping businesses grow online.',
    location: 'Miami, FL',
    rating: 5.0,
    totalRatings: 18,
    isVerified: true
  },
  {
    email: 'david.park@example.com',
    username: 'davidpark',
    firstName: 'David',
    lastName: 'Park',
    bio: 'Multilingual educator fluent in Spanish, Korean, and English. Passionate about language learning and cultural exchange.',
    location: 'Seattle, WA',
    rating: 4.7,
    totalRatings: 42,
    isVerified: false
  },
  {
    email: 'maya.thompson@example.com',
    username: 'mayat',
    firstName: 'Maya',
    lastName: 'Thompson',
    bio: 'Certified personal trainer and yoga instructor. Helping people achieve their fitness goals and find inner peace.',
    location: 'Denver, CO',
    rating: 4.9,
    totalRatings: 27,
    isVerified: true
  },
  {
    email: 'alex.kumar@example.com',
    username: 'alexk',
    firstName: 'Alex',
    lastName: 'Kumar',
    bio: 'Creative graphic designer with a passion for branding and illustration. Always looking to learn new creative skills.',
    location: 'Portland, OR',
    rating: 4.8,
    totalRatings: 35,
    isVerified: true
  },
  {
    email: 'jessica.white@example.com',
    username: 'jessicaw',
    firstName: 'Jessica',
    lastName: 'White',
    bio: 'Professional chef and culinary instructor. Love sharing cooking techniques and exploring international cuisines.',
    location: 'New York, NY',
    rating: 4.6,
    totalRatings: 19,
    isVerified: false
  },
  {
    email: 'ryan.mitchell@example.com',
    username: 'ryanm',
    firstName: 'Ryan',
    lastName: 'Mitchell',
    bio: 'Music producer and guitar instructor with 10+ years of experience. Passionate about helping others discover their musical talents.',
    location: 'Nashville, TN',
    rating: 4.7,
    totalRatings: 28,
    isVerified: true
  },
  {
    email: 'lisa.anderson@example.com',
    username: 'lisaa',
    firstName: 'Lisa',
    lastName: 'Anderson',
    bio: 'Business consultant specializing in startup strategy and operations. Love helping entrepreneurs turn ideas into reality.',
    location: 'Chicago, IL',
    rating: 4.8,
    totalRatings: 22,
    isVerified: true
  },
  {
    email: 'tom.garcia@example.com',
    username: 'tomg',
    firstName: 'Tom',
    lastName: 'Garcia',
    bio: 'Woodworking craftsman and furniture maker. Enjoy teaching traditional woodworking techniques and sustainable practices.',
    location: 'Portland, OR',
    rating: 4.5,
    totalRatings: 15,
    isVerified: false
  }
];

const sampleSkillRequests = [
  // Tech & Development
  {
    title: "Need React Developer for E-commerce Frontend",
    description: "I'm building an online marketplace and need help creating a modern, responsive frontend using React and TypeScript. The project includes product listings, shopping cart, user authentication, and payment integration.",
    skillNeeded: "React Development",
    skillOffered: "UI/UX Design",
    category: "Technology",
    estimatedDuration: "6 weeks",
    deadline: new Date('2024-03-15'),
    location: "San Francisco, CA",
    isRemote: true,
    requirements: [
      "3+ years React experience",
      "TypeScript proficiency",
      "Experience with state management (Redux/Zustand)",
      "Knowledge of REST APIs",
      "Responsive design skills"
    ],
    deliverables: [
      "Complete React frontend application",
      "Responsive design for mobile/desktop",
      "Integration with backend APIs",
      "Unit tests for components",
      "Documentation"
    ],
    tags: ["react", "typescript", "frontend", "ecommerce", "javascript"],
    status: "OPEN"
  },
  {
    title: "Python Backend API Development",
    description: "Looking for a Python developer to help build a RESTful API for a social media analytics platform. Need expertise in FastAPI, PostgreSQL, and data processing.",
    skillNeeded: "Python Backend Development",
    skillOffered: "Data Analysis & Visualization",
    category: "Technology",
    estimatedDuration: "4 weeks",
    deadline: new Date('2024-02-28'),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Strong Python skills",
      "FastAPI or Django experience",
      "PostgreSQL database knowledge",
      "API design best practices",
      "Docker containerization"
    ],
    deliverables: [
      "Complete REST API",
      "Database schema design",
      "API documentation",
      "Docker deployment setup",
      "Unit and integration tests"
    ],
    tags: ["python", "fastapi", "backend", "api", "postgresql"],
    status: "OPEN"
  },
  {
    title: "Mobile App Development - Flutter",
    description: "Need help developing a cross-platform mobile app for fitness tracking. The app should include workout logging, progress tracking, and social features.",
    skillNeeded: "Flutter Development",
    skillOffered: "Fitness Coaching & Program Design",
    category: "Technology",
    estimatedDuration: "8 weeks",
    deadline: new Date('2024-04-01'),
    location: "Austin, TX",
    isRemote: true,
    requirements: [
      "Flutter/Dart proficiency",
      "Mobile app architecture knowledge",
      "State management (Bloc/Provider)",
      "Firebase integration experience",
      "App store deployment experience"
    ],
    deliverables: [
      "Complete Flutter mobile app",
      "iOS and Android builds",
      "Firebase backend integration",
      "App store ready builds",
      "User documentation"
    ],
    tags: ["flutter", "mobile", "dart", "firebase", "fitness"],
    status: "OPEN"
  },

  // Design & Creative
  {
    title: "Brand Identity Design for Tech Startup",
    description: "Looking for a talented graphic designer to create a complete brand identity for my AI-powered productivity app. Need logo, color palette, typography, and brand guidelines.",
    skillNeeded: "Brand Identity Design",
    skillOffered: "Digital Marketing Strategy",
    category: "Design",
    estimatedDuration: "3 weeks",
    deadline: new Date('2024-02-20'),
    location: "New York, NY",
    isRemote: true,
    requirements: [
      "Strong portfolio in brand design",
      "Experience with tech/startup branding",
      "Proficiency in Adobe Creative Suite",
      "Understanding of modern design trends",
      "Ability to create scalable brand systems"
    ],
    deliverables: [
      "Logo design (multiple variations)",
      "Brand color palette",
      "Typography system",
      "Brand guidelines document",
      "Business card and letterhead designs"
    ],
    tags: ["branding", "logo", "design", "startup", "identity"],
    status: "OPEN"
  },
  {
    title: "Website Redesign - Modern & Minimalist",
    description: "My consulting business needs a complete website redesign. Looking for someone who can create a modern, minimalist design that converts visitors into clients.",
    skillNeeded: "Web Design",
    skillOffered: "Business Consulting",
    category: "Design",
    estimatedDuration: "4 weeks",
    deadline: new Date('2024-03-10'),
    location: "Chicago, IL",
    isRemote: true,
    requirements: [
      "Strong web design portfolio",
      "UX/UI design experience",
      "Figma or Sketch proficiency",
      "Understanding of conversion optimization",
      "Responsive design expertise"
    ],
    deliverables: [
      "Complete website design mockups",
      "Mobile responsive designs",
      "Style guide and components",
      "Prototype/wireframes",
      "Design handoff files"
    ],
    tags: ["webdesign", "ux", "ui", "figma", "consulting"],
    status: "OPEN"
  },
  {
    title: "Product Photography for E-commerce",
    description: "Need professional product photography for my handmade jewelry business. Looking for someone who can create stunning, consistent product images for online sales.",
    skillNeeded: "Product Photography",
    skillOffered: "Jewelry Making & Design",
    category: "Design",
    estimatedDuration: "2 weeks",
    deadline: new Date('2024-02-15'),
    location: "Los Angeles, CA",
    isRemote: false,
    requirements: [
      "Professional photography equipment",
      "Product photography experience",
      "Photo editing skills (Lightroom/Photoshop)",
      "Understanding of e-commerce requirements",
      "Portfolio of product photography"
    ],
    deliverables: [
      "50+ high-quality product photos",
      "Edited and retouched images",
      "Multiple angles per product",
      "Consistent lighting and style",
      "Web-optimized image files"
    ],
    tags: ["photography", "product", "ecommerce", "jewelry", "editing"],
    status: "OPEN"
  },

  // Marketing & Business
  {
    title: "Social Media Marketing Strategy",
    description: "Looking for a social media expert to help grow my fitness coaching business on Instagram and TikTok. Need content strategy, posting schedule, and engagement tactics.",
    skillNeeded: "Social Media Marketing",
    skillOffered: "Personal Training & Nutrition Coaching",
    category: "Marketing",
    estimatedDuration: "6 weeks",
    deadline: new Date('2024-03-20'),
    location: "Miami, FL",
    isRemote: true,
    requirements: [
      "Proven social media growth experience",
      "Content creation skills",
      "Understanding of fitness/wellness niche",
      "Analytics and reporting abilities",
      "Knowledge of Instagram and TikTok algorithms"
    ],
    deliverables: [
      "Complete social media strategy",
      "Content calendar (3 months)",
      "Hashtag research and strategy",
      "Engagement growth plan",
      "Monthly analytics reports"
    ],
    tags: ["socialmedia", "marketing", "instagram", "tiktok", "fitness"],
    status: "OPEN"
  },
  {
    title: "SEO Optimization for Local Business",
    description: "My restaurant needs help with local SEO to attract more customers. Looking for someone to optimize our website, Google My Business, and local search presence.",
    skillNeeded: "SEO & Local Search Optimization",
    skillOffered: "Culinary Training & Recipe Development",
    category: "Marketing",
    estimatedDuration: "5 weeks",
    deadline: new Date('2024-03-05'),
    location: "Portland, OR",
    isRemote: true,
    requirements: [
      "Local SEO expertise",
      "Google My Business optimization experience",
      "Keyword research skills",
      "Technical SEO knowledge",
      "Restaurant/hospitality industry experience preferred"
    ],
    deliverables: [
      "Complete SEO audit",
      "Optimized Google My Business profile",
      "Local keyword strategy",
      "Website SEO improvements",
      "Monthly progress reports"
    ],
    tags: ["seo", "local", "restaurant", "google", "optimization"],
    status: "OPEN"
  },
  {
    title: "Email Marketing Campaign Setup",
    description: "Need help setting up automated email marketing campaigns for my online course business. Looking for someone experienced with email automation and copywriting.",
    skillNeeded: "Email Marketing & Automation",
    skillOffered: "Online Course Creation & Teaching",
    category: "Marketing",
    estimatedDuration: "3 weeks",
    deadline: new Date('2024-02-25'),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Email marketing platform experience (Mailchimp, ConvertKit, etc.)",
      "Marketing automation setup",
      "Email copywriting skills",
      "A/B testing experience",
      "Analytics and optimization knowledge"
    ],
    deliverables: [
      "Complete email automation sequences",
      "Welcome series (5-7 emails)",
      "Sales funnel email campaigns",
      "Email templates and designs",
      "Performance tracking setup"
    ],
    tags: ["email", "marketing", "automation", "copywriting", "courses"],
    status: "OPEN"
  },

  // Education & Language
  {
    title: "Spanish Language Tutoring",
    description: "Looking for a native Spanish speaker to help me become conversational in Spanish for business purposes. Need structured lessons and conversation practice.",
    skillNeeded: "Spanish Language Tutoring",
    skillOffered: "English Language Tutoring",
    category: "Education",
    estimatedDuration: "12 weeks",
    deadline: new Date('2024-05-01'),
    location: "Denver, CO",
    isRemote: true,
    requirements: [
      "Native or near-native Spanish fluency",
      "Teaching or tutoring experience",
      "Business Spanish knowledge",
      "Structured lesson planning abilities",
      "Patience and communication skills"
    ],
    deliverables: [
      "Customized learning curriculum",
      "Weekly 1-hour lessons",
      "Homework assignments and materials",
      "Progress assessments",
      "Business Spanish conversation practice"
    ],
    tags: ["spanish", "language", "tutoring", "business", "conversation"],
    status: "OPEN"
  },
  {
    title: "Piano Lessons for Adult Beginner",
    description: "Adult beginner looking for patient piano instructor to teach classical and contemporary pieces. Prefer someone who can work with busy professional schedule.",
    skillNeeded: "Piano Instruction",
    skillOffered: "Financial Planning & Investment Advice",
    category: "Education",
    estimatedDuration: "16 weeks",
    deadline: new Date('2024-06-01'),
    location: "Boston, MA",
    isRemote: true,
    requirements: [
      "Piano teaching experience",
      "Adult education experience preferred",
      "Flexible scheduling",
      "Classical and contemporary repertoire knowledge",
      "Online lesson capability"
    ],
    deliverables: [
      "Structured lesson plans",
      "Weekly 45-minute lessons",
      "Practice exercises and sheet music",
      "Progress evaluations",
      "Performance preparation"
    ],
    tags: ["piano", "music", "lessons", "adult", "classical"],
    status: "OPEN"
  },
  {
    title: "Data Science Mentoring",
    description: "Career changer looking for a data science mentor to guide me through machine learning concepts, portfolio projects, and job search preparation.",
    skillNeeded: "Data Science Mentoring",
    skillOffered: "Project Management & Agile Coaching",
    category: "Education",
    estimatedDuration: "10 weeks",
    deadline: new Date('2024-04-15'),
    location: "Seattle, WA",
    isRemote: true,
    requirements: [
      "Professional data science experience",
      "Machine learning expertise",
      "Python and R proficiency",
      "Portfolio development guidance",
      "Industry insights and networking"
    ],
    deliverables: [
      "Personalized learning roadmap",
      "Weekly mentoring sessions",
      "Portfolio project guidance",
      "Resume and interview preparation",
      "Industry networking introductions"
    ],
    tags: ["datascience", "mentoring", "machinelearning", "python", "career"],
    status: "OPEN"
  },

  // Health & Wellness
  {
    title: "Nutrition Coaching for Athletes",
    description: "Competitive runner looking for sports nutrition coaching to optimize performance and recovery. Need meal planning and supplement guidance.",
    skillNeeded: "Sports Nutrition Coaching",
    skillOffered: "Running Training & Coaching",
    category: "Health",
    estimatedDuration: "8 weeks",
    deadline: new Date('2024-03-30'),
    location: "Phoenix, AZ",
    isRemote: true,
    requirements: [
      "Sports nutrition certification",
      "Endurance athlete experience",
      "Meal planning expertise",
      "Supplement knowledge",
      "Performance optimization focus"
    ],
    deliverables: [
      "Personalized nutrition plan",
      "Weekly meal prep guides",
      "Supplement recommendations",
      "Performance tracking",
      "Race day nutrition strategy"
    ],
    tags: ["nutrition", "sports", "running", "performance", "coaching"],
    status: "OPEN"
  },
  {
    title: "Yoga Instruction for Beginners",
    description: "Looking for a patient yoga instructor to teach basic poses and breathing techniques. Prefer someone experienced with beginners and injury modifications.",
    skillNeeded: "Yoga Instruction",
    skillOffered: "Massage Therapy",
    category: "Health",
    estimatedDuration: "6 weeks",
    deadline: new Date('2024-03-15'),
    location: "San Diego, CA",
    isRemote: true,
    requirements: [
      "Certified yoga instructor",
      "Beginner-friendly teaching style",
      "Injury modification knowledge",
      "Hatha or gentle yoga specialization",
      "Online class capability"
    ],
    deliverables: [
      "Beginner yoga curriculum",
      "Weekly 1-hour classes",
      "Pose modification guides",
      "Breathing exercise instruction",
      "Home practice routines"
    ],
    tags: ["yoga", "beginner", "wellness", "breathing", "flexibility"],
    status: "OPEN"
  },

  // Creative & Arts
  {
    title: "Pottery Wheel Throwing Lessons",
    description: "Complete beginner wanting to learn pottery wheel throwing techniques. Looking for hands-on instruction and guidance on clay preparation and glazing.",
    skillNeeded: "Pottery & Ceramics Instruction",
    skillOffered: "Woodworking & Furniture Making",
    category: "Arts",
    estimatedDuration: "8 weeks",
    deadline: new Date('2024-04-01'),
    location: "Asheville, NC",
    isRemote: false,
    requirements: [
      "Professional pottery experience",
      "Teaching experience preferred",
      "Access to pottery studio/wheel",
      "Kiln firing knowledge",
      "Glazing technique expertise"
    ],
    deliverables: [
      "Basic wheel throwing techniques",
      "Clay preparation instruction",
      "8 completed pottery pieces",
      "Glazing and firing guidance",
      "Studio practice time"
    ],
    tags: ["pottery", "ceramics", "art", "handson", "creative"],
    status: "OPEN"
  },
  {
    title: "Digital Illustration for Children's Book",
    description: "Author seeking digital illustrator for a children's picture book about friendship. Need 15-20 colorful, engaging illustrations that appeal to ages 4-8.",
    skillNeeded: "Digital Illustration",
    skillOffered: "Creative Writing & Storytelling",
    category: "Arts",
    estimatedDuration: "6 weeks",
    deadline: new Date('2024-03-25'),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Children's book illustration experience",
      "Digital art proficiency (Procreate, Photoshop, etc.)",
      "Colorful, engaging art style",
      "Character design skills",
      "Print-ready file preparation"
    ],
    deliverables: [
      "15-20 full-page illustrations",
      "Character design sheets",
      "Cover illustration",
      "Print-ready high-resolution files",
      "Revision rounds included"
    ],
    tags: ["illustration", "childrens", "digital", "book", "art"],
    status: "OPEN"
  },

  // Lifestyle & Personal
  {
    title: "Home Organization & Decluttering",
    description: "Need help organizing and decluttering my home office and bedroom. Looking for someone with experience in space optimization and minimalist principles.",
    skillNeeded: "Home Organization",
    skillOffered: "Interior Design Consultation",
    category: "Lifestyle",
    estimatedDuration: "2 weeks",
    deadline: new Date('2024-02-20'),
    location: "Nashville, TN",
    isRemote: false,
    requirements: [
      "Professional organizing experience",
      "Space optimization skills",
      "Decluttering methodology",
      "Storage solution knowledge",
      "Before/after documentation"
    ],
    deliverables: [
      "Complete room organization",
      "Decluttering action plan",
      "Storage system setup",
      "Maintenance guidelines",
      "Before/after photos"
    ],
    tags: ["organization", "decluttering", "home", "minimalist", "space"],
    status: "OPEN"
  },
  {
    title: "Personal Styling & Wardrobe Consultation",
    description: "Professional looking to update wardrobe for new executive role. Need help with style assessment, shopping guidance, and outfit coordination.",
    skillNeeded: "Personal Styling",
    skillOffered: "Career Coaching & Resume Writing",
    category: "Lifestyle",
    estimatedDuration: "4 weeks",
    deadline: new Date('2024-03-01'),
    location: "Atlanta, GA",
    isRemote: false,
    requirements: [
      "Personal styling certification or experience",
      "Professional wardrobe expertise",
      "Color analysis knowledge",
      "Shopping and budget guidance",
      "Executive presence understanding"
    ],
    deliverables: [
      "Style assessment and analysis",
      "Wardrobe audit and recommendations",
      "Personal shopping session",
      "Outfit coordination guide",
      "Seasonal wardrobe plan"
    ],
    tags: ["styling", "wardrobe", "professional", "fashion", "executive"],
    status: "OPEN"
  },

  // Technical Skills
  {
    title: "3D Modeling for Product Prototyping",
    description: "Inventor needs help creating 3D models of a new kitchen gadget for prototyping and manufacturing. Need expertise in CAD software and design for manufacturing.",
    skillNeeded: "3D Modeling & CAD Design",
    skillOffered: "Product Development & Innovation Consulting",
    category: "Technology",
    estimatedDuration: "5 weeks",
    deadline: new Date('2024-03-10'),
    location: "Remote",
    isRemote: true,
    requirements: [
      "Professional CAD software experience (SolidWorks, Fusion 360)",
      "Product design background",
      "Manufacturing considerations knowledge",
      "3D printing preparation",
      "Technical drawing skills"
    ],
    deliverables: [
      "Complete 3D product model",
      "Technical drawings and specifications",
      "3D printing ready files",
      "Manufacturing considerations report",
      "Design iteration rounds"
    ],
    tags: ["3dmodeling", "cad", "product", "prototyping", "manufacturing"],
    status: "OPEN"
  },
  {
    title: "Video Editing for YouTube Channel",
    description: "Educational content creator needs help editing weekly YouTube videos. Looking for someone who can create engaging edits with graphics, transitions, and audio optimization.",
    skillNeeded: "Video Editing",
    skillOffered: "Educational Content Creation & Curriculum Design",
    category: "Technology",
    estimatedDuration: "Ongoing",
    deadline: null,
    location: "Remote",
    isRemote: true,
    requirements: [
      "Professional video editing experience",
      "YouTube content optimization knowledge",
      "Motion graphics skills",
      "Audio editing and enhancement",
      "Fast turnaround capability"
    ],
    deliverables: [
      "Weekly edited YouTube videos (10-15 minutes)",
      "Custom intro/outro graphics",
      "Thumbnail design templates",
      "Audio optimization and cleanup",
      "SEO-optimized video descriptions"
    ],
    tags: ["videoediting", "youtube", "content", "graphics", "education"],
    status: "OPEN"
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.application.deleteMany();
  await prisma.skillRequestView.deleteMany();
  await prisma.skillRequest.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  let createdUsers = [] as User[];
  for (let i = 0; i < sampleUsers.length; i++) {
    const userData = sampleUsers[i];
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        avatar: avatarUrls[i % avatarUrls.length]
      }
    });
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.firstName} ${user.lastName}`);
  }

  // Create skill requests
  console.log('📋 Creating skill requests...');
  let createdSkillRequests: SkillRequest[]= [];
  for (let i = 0; i < sampleSkillRequests.length; i++) {
    const requestData = sampleSkillRequests[i];
    const randomAuthor = createdUsers[i % createdUsers.length];
    
    const skillRequest = await prisma.skillRequest.create({
      data: {
        ...requestData,
        authorId: randomAuthor.id,
        deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random deadline within 30 days
        status: Math.random() > 0.7 ? 'IN_PROGRESS' : 'OPEN' // 30% chance of being in progress
      }
    });
    createdSkillRequests.push(skillRequest);
    console.log(`✅ Created skill request: ${skillRequest.title}`);
  }

  // Create applications
  console.log('📝 Creating applications...');
  let createdApplications: Application[] = [];
  for (const skillRequest of createdSkillRequests) {
    // Each skill request gets 1-4 applications
    const numApplications = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < numApplications; i++) {
      // Pick a random user who isn't the author
      const availableApplicants = createdUsers.filter(user => user.id !== skillRequest.authorId);
      const randomApplicant = availableApplicants[Math.floor(Math.random() * availableApplicants.length)];
      
      // Check if this user already applied
      const existingApplication = createdApplications.find(
        app => app.skillRequestId === skillRequest.id && app.applicantId === randomApplicant.id
      );
      
      if (!existingApplication) {
        const applicationMessages = [
          "I'm very interested in this opportunity and believe my skills would be a perfect match. I have extensive experience in this area and would love to discuss how we can help each other.",
          "This sounds like an exciting collaboration! I've been looking for exactly this type of skill exchange. My background aligns well with what you're seeking.",
          "I'd love to work with you on this project. I have a strong portfolio and can provide references from previous collaborations. Let's connect!",
          "Your skill request caught my attention because it's exactly what I've been hoping to find. I'm confident we can create great value for each other.",
          "I'm passionate about skill sharing and this opportunity seems perfect. I have the experience you're looking for and am excited about what you're offering in return."
        ];

        const whyChooseMeOptions = [
          "I bring years of professional experience and a track record of successful collaborations. I'm reliable, communicative, and always deliver quality work.",
          "My unique combination of technical skills and creative thinking allows me to approach problems from multiple angles and find innovative solutions.",
          "I'm not just skilled in this area - I'm passionate about teaching and sharing knowledge. You'll get both expertise and mentorship.",
          "I have a proven methodology that ensures consistent results and clear communication throughout the process.",
          "My diverse background gives me a unique perspective that can add extra value to our collaboration."
        ];

        const statuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
        const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
        
        const application = await prisma.application.create({
          data: {
            skillRequestId: skillRequest.id,
            applicantId: randomApplicant.id,
            message: applicationMessages[Math.floor(Math.random() * applicationMessages.length)],
            proposedTimeline: `${Math.floor(Math.random() * 4) + 1} weeks`,
            portfolio: [
              'https://example.com/portfolio1',
              'https://example.com/portfolio2'
            ],
            experience: `${Math.floor(Math.random() * 8) + 2} years of professional experience`,
            whyChooseMe: whyChooseMeOptions[Math.floor(Math.random() * whyChooseMeOptions.length)],
            status: status,
            responseMessage: status !== 'PENDING' ? 'Thank you for your application!' : null,
            respondedAt: status !== 'PENDING' ? new Date() : null
          }
        });
        createdApplications.push(application);
      }
    }
  }
  console.log(`✅ Created ${createdApplications.length} applications`);

  // Create skill request views
  console.log('👀 Creating skill request views...');
  let viewCount = 0;
  for (const skillRequest of createdSkillRequests) {
    // Each skill request gets 5-20 views
    const numViews = Math.floor(Math.random() * 16) + 5;
    
    for (let i = 0; i < numViews; i++) {
      const randomViewer = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      try {
        await prisma.skillRequestView.create({
          data: {
            userId: randomViewer.id,
            skillRequestId: skillRequest.id,
            viewedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time within last 7 days
          }
        });
        viewCount++;
      } catch (error) {
        // Skip if duplicate view (user already viewed this request)
      }
    }
  }
  console.log(`✅ Created ${viewCount} skill request views`);

  // Create reviews for completed applications
  console.log('⭐ Creating reviews...');
  const completedApplications = createdApplications.filter(app => app.status === 'ACCEPTED');
  let reviewCount = 0;
  
  for (const application of completedApplications.slice(0, 5)) { // Create reviews for first 5 completed applications
    const reviewComments = [
      "Excellent collaboration! Very professional, delivered exactly what was promised, and was great to work with.",
      "Outstanding experience. Clear communication, high-quality work, and went above and beyond expectations.",
      "Fantastic skill exchange. Learned so much and the teaching style was perfect for my learning pace.",
      "Highly recommend! Professional, reliable, and the quality of work exceeded my expectations.",
      "Great experience overall. Good communication and delivered quality results on time."
    ];

    const skillRequest = await prisma.skillRequest.findUnique({
      where: { id: application.skillRequestId }
    });

    if (skillRequest) {
      await prisma.review.create({
        data: {
          applicationId: application.id,
          giverId: skillRequest.authorId,
          receiverId: application.applicantId,
          rating: Math.floor(Math.random() * 2) + 4, // Rating between 4-5
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)]
        }
      });
      reviewCount++;
    }
  }
  console.log(`✅ Created ${reviewCount} reviews`);

  // Update user ratings based on reviews
  console.log('📊 Updating user ratings...');
  for (const user of createdUsers) {
    const reviews = await prisma.review.findMany({
      where: { receiverId: user.id }
    });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          totalRatings: reviews.length
        }
      });
    }
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log(`
📊 Summary:
- Users: ${createdUsers.length}
- Skill Requests: ${createdSkillRequests.length}
- Applications: ${createdApplications.length}
- Views: ${viewCount}
- Reviews: ${reviewCount}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });