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
  {
    title: 'Need React Developer for Portfolio Website',
    description: 'Looking for an experienced React developer to help me build a modern portfolio website. I have the designs ready and need someone to bring them to life with clean, responsive code.',
    skillNeeded: 'React Development',
    skillOffered: 'Professional Photography Session',
    category: 'Technology',
    estimatedDuration: '2 weeks',
    location: 'Austin, TX',
    isRemote: true,
    requirements: ['React experience', 'TypeScript knowledge', 'Responsive design skills'],
    deliverables: ['Fully functional portfolio website', 'Mobile responsive design', 'Clean, documented code'],
    tags: ['react', 'typescript', 'frontend', 'portfolio']
  },
  {
    title: 'Learn Digital Marketing Strategies',
    description: 'I want to learn modern digital marketing techniques including SEO, social media marketing, and content strategy. Looking for hands-on guidance and practical tips.',
    skillNeeded: 'Digital Marketing',
    skillOffered: 'Web Development (Full Stack)',
    category: 'Business',
    estimatedDuration: '1 month',
    location: 'San Francisco, CA',
    isRemote: true,
    requirements: ['Proven marketing results', 'Experience with SEO tools', 'Social media expertise'],
    deliverables: ['Marketing strategy document', '4 weekly mentoring sessions', 'Campaign setup guidance'],
    tags: ['marketing', 'seo', 'social-media', 'strategy']
  },
  {
    title: 'Spanish Conversation Practice Partner',
    description: 'Seeking a native Spanish speaker for regular conversation practice. I\'m intermediate level and want to improve my fluency and confidence in speaking.',
    skillNeeded: 'Spanish Language Tutoring',
    skillOffered: 'Guitar Lessons',
    category: 'Language',
    estimatedDuration: '3 months',
    location: 'Seattle, WA',
    isRemote: true,
    requirements: ['Native Spanish speaker', 'Teaching experience preferred', 'Patient and encouraging'],
    deliverables: ['Weekly 1-hour conversation sessions', 'Pronunciation feedback', 'Cultural insights'],
    tags: ['spanish', 'language', 'conversation', 'tutoring']
  },
  {
    title: 'Brand Identity Design for Startup',
    description: 'Need a talented graphic designer to create a complete brand identity for my tech startup. This includes logo, color palette, typography, and brand guidelines.',
    skillNeeded: 'Graphic Design & Branding',
    skillOffered: 'Business Strategy Consulting',
    category: 'Creative',
    estimatedDuration: '3 weeks',
    location: 'Miami, FL',
    isRemote: true,
    requirements: ['Portfolio of brand work', 'Adobe Creative Suite expertise', 'Understanding of tech industry'],
    deliverables: ['Logo design', 'Brand guidelines document', 'Business card design', 'Social media templates'],
    tags: ['branding', 'logo', 'design', 'startup']
  },
  {
    title: 'Personal Fitness Training Program',
    description: 'Looking for a certified personal trainer to help me create a custom workout routine and provide ongoing coaching. Want to focus on strength training and overall fitness.',
    skillNeeded: 'Personal Training',
    skillOffered: 'Photography Lessons',
    category: 'Health',
    estimatedDuration: '2 months',
    location: 'Denver, CO',
    isRemote: false,
    requirements: ['Certified personal trainer', 'Experience with strength training', 'Motivational coaching style'],
    deliverables: ['Custom workout plan', 'Weekly training sessions', 'Nutrition guidance', 'Progress tracking'],
    tags: ['fitness', 'training', 'health', 'strength']
  },
  {
    title: 'Learn Music Production Basics',
    description: 'Interested in learning music production and audio engineering. Want to understand DAWs, mixing, and mastering techniques for electronic music.',
    skillNeeded: 'Music Production',
    skillOffered: 'Cooking Classes (Italian Cuisine)',
    category: 'Music',
    estimatedDuration: '6 weeks',
    location: 'Nashville, TN',
    isRemote: true,
    requirements: ['Professional music production experience', 'Knowledge of Ableton or Logic Pro', 'Electronic music background'],
    deliverables: ['Introduction to DAW software', 'Basic mixing techniques', 'Sample project creation', 'Equipment recommendations'],
    tags: ['music', 'production', 'audio', 'electronic']
  },
  {
    title: 'Woodworking Workshop for Beginners',
    description: 'Complete beginner looking to learn basic woodworking skills. Interested in making simple furniture pieces and understanding wood selection and tools.',
    skillNeeded: 'Woodworking',
    skillOffered: 'Website Development',
    category: 'Crafts',
    estimatedDuration: '1 month',
    location: 'Portland, OR',
    isRemote: false,
    requirements: ['Experienced woodworker', 'Own workshop space', 'Patient teaching style'],
    deliverables: ['Basic tool usage training', 'Wood selection guidance', 'Complete a simple project', 'Safety training'],
    tags: ['woodworking', 'crafts', 'furniture', 'beginner']
  },
  {
    title: 'Advanced Photography Techniques',
    description: 'Experienced amateur photographer looking to learn advanced techniques including studio lighting, portrait photography, and post-processing workflows.',
    skillNeeded: 'Advanced Photography',
    skillOffered: 'Digital Marketing Consultation',
    category: 'Creative',
    estimatedDuration: '4 weeks',
    location: 'Los Angeles, CA',
    isRemote: false,
    requirements: ['Professional photographer', 'Studio experience', 'Lightroom/Photoshop expertise'],
    deliverables: ['Studio lighting workshop', 'Portrait session practice', 'Post-processing tutorials', 'Portfolio review'],
    tags: ['photography', 'portrait', 'lighting', 'advanced']
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