// Import necessary modules
import { Router } from 'express';
import {authenticateToken} from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware';

// Local imports
import { PrismaClient } from '@prisma/client'; 
import fs from 'fs';
import path from 'path';


const router = Router();
const db = new PrismaClient();

//to get the User profile, we need to define the type of the request object
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Get user profile
// @ts-ignore
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest,res: Response) => {
  try {
    const userProfile = await db.user.findFirst({
      where: { id: req.user?.id },
      include: {
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
})
    // Remove password from response?
    res.json(userProfile);
    }catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
})

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest,res: Response) => {
  try {
    const { 
      firstName, 
      lastName, 
      bio, 
      avatar,
      location
    } = req.body;

    const updatedUser = await db.user.update({
      where: { id: req.user?.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        bio: bio !== undefined ? bio : undefined,
        location: location !== undefined ? location : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        location: true,
        rating: true,
        totalRatings: true,
        isVerified: true,
        updatedAt: true
      }
    });

    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload avatar   -- Verify Later 
router.post('/avatar', 
  authenticateToken, 
  upload.single('avatar'), 
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Fix: Use req.user.id (not req.user.userId)
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

      if (error instanceof Error && error.message.includes('Only image files')) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Failed to upload avatar' });
    }
});



// Get user by ID or username (public profile)
router.get('/:identifier', async  (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;


    // Check if identifier is a cuid (starts with 'c') or username
    const isId = identifier.startsWith('c');
    
    const user = await db.user.findUnique({
      where: isId ? { id: identifier } : { username: identifier },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        location: true,
        totalRatings: true,
        isVerified: true,
        createdAt: true,
        reviewsReceived: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            giver: {
              select: {
                firstName: true,
                lastName: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return ;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;