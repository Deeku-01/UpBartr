"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
// Local imports
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const db = new client_1.PrismaClient();
// Get user profile
// @ts-ignore
router.get('/profile', authMiddleware_1.authenticateToken, async (req, res) => {
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
        });
        // Remove password from response?
        res.json(userProfile);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});
// Update user profile
router.put('/profile', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, bio, avatar, location } = req.body;
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// Upload avatar   -- Verify Later 
router.post('/avatar', authMiddleware_1.authenticateToken, uploadMiddleware_1.upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        // Fix: Use req.user.id (not req.user.userId)
        const userId = req.user.id;
        const avatarPath = `/uploads/${req.file.filename}`;
        // Get user's current avatar to delete old file
        const currentUser = await db.user.findUnique({
            where: { id: userId },
            select: { avatar: true }
        });
        // Delete old avatar file if it exists
        if (currentUser?.avatar) {
            const oldFilePath = path_1.default.join(process.cwd(), 'uploads', path_1.default.basename(currentUser.avatar));
            if (fs_1.default.existsSync(oldFilePath)) {
                fs_1.default.unlinkSync(oldFilePath);
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
    }
    catch (error) {
        console.error('Upload avatar error:', error);
        // Delete uploaded file if there was an error
        if (req.file) {
            const filePath = path_1.default.join(process.cwd(), 'uploads', req.file.filename);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
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
router.get('/:identifier', async (req, res) => {
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
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
exports.default = router;
