import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { PrismaClient, SkillLevel, UserSkill } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = Router();
const db = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// interface UserSkill{
//   userId:string
//   name:String
//   level:SkillLevel
  
// }


// Get user profile
// @ts-ignore
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userProfile = await db.user.findFirst({
      where: { id: req.user?.id },
      include: {
        // Include user's skills
        skills: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        
        // Include user's interests
        interests: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        
        // Include skill requests created by the user
        skillRequests: {
          include: {
            applications: {
              select: {
                id: true,
                status: true,
                applicant: {
                  select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    avatar: true
                  }
                }
              }
            },
            _count: {
              select: {
                applications: true,
                views: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        
        // Include applications made by the user
        applications: {
          include: {
            skillRequest: {
              select: {
                id: true,
                title: true,
                skillNeeded: true,
                skillOffered: true,
                status: true,
                author: {
                  select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        
        // Include reviews received
        reviewsReceived: {
          include: {
            giver: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
                avatar: true
              }
            },
            application: {
              select: {
                skillRequest: {
                  select: {
                    title: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        
        // Include skill request views for analytics
        skillRequestViews: {
          select: {
            skillRequest: {
              select: {
                title: true
              }
            },
            viewedAt: true
          },
          orderBy: {
            viewedAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate completed trades
    const completedTrades = userProfile.applications.filter(
      app => app.skillRequest.status === 'COMPLETED'
    ).length;

    // Calculate average rating
    const totalRating = userProfile.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    const rating = userProfile.reviewsReceived.length > 0 
      ? (totalRating / userProfile.reviewsReceived.length) 
      : 0;

    // Transform the data to match frontend expectations
    const transformedProfile = {
      id: userProfile.id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      username: userProfile.username,
      email: userProfile.email,
      avatar: userProfile.avatar,
      bio: userProfile.bio,
      location: userProfile.location,
      rating: Number(rating.toFixed(1)),
      totalRatings: userProfile.reviewsReceived.length,
      completedTrades: completedTrades,
      isVerified: userProfile.isVerified,
      joinedAt: userProfile.createdAt,
      
      // Use actual skills from database
      skills: userProfile.skills.map(skill => ({
        name: skill.name,
        level: skill.level,
        category: skill.category
      })),
      
      // Use actual interests from database
      interests: userProfile.interests.map(interest => ({
        name: interest.name,
        category: interest.category
      })),
      
      // Calculate achievements based on actual data
      achievements: [
        { 
          name: 'Top Trader', 
          description: `Completed ${completedTrades}+ successful skill exchanges`, 
          icon: 'Award' 
        },
        { 
          name: 'Verified Expert', 
          description: 'Skills verified by the community', 
          icon: 'CheckCircle' 
        },
        { 
          name: 'Mentor', 
          description: `Helped ${userProfile.applications.length}+ people learn new skills`, 
          icon: 'Star' 
        }
      ],

      // Include the raw data for dashboard/analytics
      skillRequests: userProfile.skillRequests,
      applications: userProfile.applications,
      reviewsReceived: userProfile.reviewsReceived,
      skillRequestViews: userProfile.skillRequestViews
    };

    res.json(transformedProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile (including skills and interests)
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      firstName, 
      lastName, 
      bio, 
      avatar,
      location,
      skills,
      interests
    } = req.body;

    // Start a transaction to update user and skills/interests
    const result = await db.$transaction(async (prisma) => {
      // Update basic user info
      const updatedUser = await prisma.user.update({
        where: { id: req.user?.id },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          bio: bio !== undefined ? bio : undefined,
          location: location !== undefined ? location : undefined,
          avatar: avatar !== undefined ? avatar : undefined,
          updatedAt: new Date()
        }
      });

      // Update skills if provided
      if (skills && Array.isArray(skills)) {
        // Delete existing skills
        await prisma.userSkill.deleteMany({
          where: { userId: req.user?.id }
        });

        // Create new skills
        if (skills.length > 0) {
          await prisma.userSkill.createMany({
            data: skills.map((skill: UserSkill) => ({
              userId: req.user!.id,
              name: skill.name,
              level: skill.level.toUpperCase() as SkillLevel,
              category: skill.category
            }))
          });
        }
      }

      // Update interests if provided
      if (interests && Array.isArray(interests)) {
        // Delete existing interests
        await prisma.userInterest.deleteMany({
          where: { userId: req.user?.id }
        });

        // Create new interests
        if (interests.length > 0) {
          await prisma.userInterest.createMany({
            data: interests.map((interest: any) => ({
              userId: req.user!.id,
              name: interest.name,
              category: interest.category
            }))
          });
        }
      }

      return updatedUser;
    });

    res.json({ 
      message: 'Profile updated successfully', 
      user: result
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add skill to user profile
// @ts-ignore
router.post('/skills', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, level, category } = req.body;

    if (!name || !level || !category) {
      return res.status(400).json({ error: 'Name, level, and category are required' });
    }

    const skill = await db.userSkill.create({
      data: {
        userId: req.user?.id!,
        name,
        level: level.toUpperCase(),
        category
      }
    });

    res.json({ message: 'Skill added successfully', skill });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// Remove skill from user profile
router.delete('/skills/:skillId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { skillId } = req.params;

    await db.userSkill.delete({
      where: {
        id: skillId,
        userId: req.user?.id // Ensure user can only delete their own skills
      }
    });

    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ error: 'Failed to remove skill' });
  }
});

// Add interest to user profile
// @ts-ignore
router.post('/interests', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const interest = await db.userInterest.create({
      data: {
        userId: req.user?.id!,
        name,
        category
      }
    });

    res.json({ message: 'Interest added successfully', interest });
  } catch (error) {
    console.error('Add interest error:', error);

    res.status(500).json({ error: 'Failed to add interest' });
  }
});

// Keep your existing routes (avatar upload, get user by ID, etc.)
// @ts-ignore
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user!.id;
      const avatarPath = `/uploads/${req.file.filename}`;

      // Get user's current avatar to delete old file
      const currentUser = await db.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      });

      // Delete old avatar file if it exists
      if (currentUser?.avatar) {
        const oldFilePath = path.join(process.cwd(), 'uploads', path.basename(currentUser.avatar));
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Update user with new avatar
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          avatar: avatarPath,
          updatedAt: new Date()
        },
        select: {
          id: true,
          avatar: true
        }
      });

      res.json({
        message: 'Avatar uploaded successfully',
        avatar: updatedUser.avatar
      });

    } catch (error) {
      console.error('Upload avatar error:', error);
      
      // Delete uploaded file if there was an error
      if (req.file) {
        const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({ error: 'Failed to upload avatar' });
    }
});

// For public View ->
// @ts-ignore
router.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const isId = identifier.startsWith('c');
    
    const user = await db.user.findUnique({
      where: isId ? { id: identifier } : { username: identifier },
      select: {
        id: true,
        email: true,
        avatar: true,
        firstName: true,  // This matches your schema
        lastName: true,   // Add this too
        rating: true,
        // You could calculate completed trades from reviews or applications
        reviewsReceived: {
          select: { id: true }  // Just count them
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Transform the response to include calculated fields
    const response = {
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,    // Keep original case
      fullName: `${user.firstName} ${user.lastName}`, // Add full name
      rating: user.rating,
      completedTrades: user.reviewsReceived.length, // Calculate from reviews
    };

    res.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
