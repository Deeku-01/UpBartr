"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const db = new client_1.PrismaClient();
// Get all Skill requests
// This route will be used to fetch all skill requests
router.get('/requests', async (req, res) => {
    const skills = await db.skillRequest.findMany({
        select: {
            id: true,
            title: true,
            category: true,
            skillNeeded: true,
            skillOffered: true,
            estimatedDuration: true,
            isRemote: true,
            tags: true,
            location: true,
            // Get author information
            author: {
                select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    rating: true,
                    location: true,
                }
            },
            // Get applications count
            applications: {
                select: {
                    id: true // We only need to count, so just select id
                }
            }
        }
    });
    const transformedData = skills.map(request => ({
        id: request.id,
        title: request.title,
        category: request.category,
        author: `${request.author.firstName} ${request.author.lastName}`,
        avatar: request.author.avatar,
        rating: request.author.rating,
        location: request.location || request.author.location, // Use request location first, fallback to author location
        skillNeeded: request.skillNeeded,
        skillOffered: request.skillOffered,
        duration: request.estimatedDuration,
        applications: request.applications.length,
        isRemote: request.isRemote,
        tags: request.tags
    }));
    res.json(transformedData);
});
// This route will be used to fetch all skill requests except the ones created by the user
// @ts-ignore
router.get('/requests/user', async (req, res) => {
    try {
        const { excludeUser } = req.query;
        const skills = await db.skillRequest.findMany({
            select: {
                id: true,
                title: true,
                category: true,
                skillNeeded: true,
                skillOffered: true,
                estimatedDuration: true,
                isRemote: true,
                tags: true,
                location: true,
                // Get author information
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        rating: true,
                        location: true,
                    }
                },
                // Get applications count
                applications: {
                    select: {
                        id: true // We only need to count, so just select id
                    }
                }
            },
            where: {
                author: {
                    id: {
                        not: excludeUser ? excludeUser : undefined // Exclude the user if excludeUser is provided
                    }
                }
            }
        });
        const transformedData = skills.map(request => ({
            id: request.id,
            title: request.title,
            category: request.category,
            author: `${request.author.firstName} ${request.author.lastName}`,
            avatar: request.author.avatar,
            rating: request.author.rating,
            location: request.location || request.author.location,
            skillNeeded: request.skillNeeded,
            skillOffered: request.skillOffered,
            duration: request.estimatedDuration,
            applications: request.applications.length,
            isRemote: request.isRemote,
            tags: request.tags
        }));
        res.json(transformedData);
    }
    catch (error) {
        console.error('Error fetching skill requests:', error);
        res.status(500).json({ error: 'Failed to fetch skill requests' });
    }
});
// @route   GET /api/skillreqs/:id
// @desc    Get a single Skill request by ID
// @access  Public (or Private if you add authenticateToken)
// @ts-ignore
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const skillRequest = await db.skillRequest.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        username: true,
                        avatar: true,
                        rating: true,
                        location: true,
                        bio: true,
                        isVerified: true,
                    },
                },
                applications: {
                    include: {
                        applicant: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                username: true,
                                avatar: true,
                                rating: true,
                            },
                        },
                    },
                },
                views: true, // Include all view records
            },
        });
        if (!skillRequest) {
            return res.status(404).json({ error: 'Skill request not found.' });
        }
        // Transform data for consistent frontend usage
        const transformedRequest = {
            ...skillRequest,
            deadline: skillRequest.deadline?.toISOString() || null,
            createdAt: skillRequest.createdAt.toISOString(),
            updatedAt: skillRequest.updatedAt.toISOString(),
            author: {
                id: skillRequest.author.id,
                firstName: skillRequest.author.firstName,
                lastName: skillRequest.author.lastName,
                username: skillRequest.author.username,
                avatar: skillRequest.author.avatar,
                rating: skillRequest.author.rating,
                location: skillRequest.author.location,
                bio: skillRequest.author.bio,
                isVerified: skillRequest.author.isVerified,
            },
            applications: skillRequest.applications.map(app => ({
                ...app,
                createdAt: app.createdAt.toISOString(),
                respondedAt: app.respondedAt?.toISOString() || null,
                startedAt: app.startedAt?.toISOString() || null,
                completedAt: app.completedAt?.toISOString() || null,
            })),
            viewsCount: skillRequest.views.length, // Add a count for views
        };
        res.json(transformedRequest);
    }
    catch (error) {
        console.error('Error fetching skill request by ID:', error);
        res.status(500).json({ error: 'Failed to fetch skill request.' });
    }
});
// @route   POST /api/skillreqs
// @desc    Create a new Skill request
// @access  Private
// @ts-ignore
router.post('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const { title, description, skillNeeded, skillOffered, category, estimatedDuration, deadline, location, isRemote, requirements, deliverables, tags, } = req.body;
    const authorId = req.user?.id;
    if (!authorId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    // Basic validation
    if (!title || !description || !skillNeeded || !skillOffered || !category || !requirements || !deliverables || !tags) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }
    try {
        const newSkillRequest = await db.skillRequest.create({
            data: {
                authorId,
                title,
                description,
                skillNeeded,
                skillOffered,
                category,
                estimatedDuration: estimatedDuration || null,
                deadline: deadline ? new Date(deadline) : null,
                location: location || null,
                isRemote: isRemote || false,
                requirements,
                deliverables,
                tags,
                status: client_1.SkillRequestStatus.OPEN, // Default status
            },
        });
        res.status(201).json(newSkillRequest);
    }
    catch (error) {
        console.error('Error creating skill request:', error);
        res.status(500).json({ error: 'Failed to create skill request.' });
    }
});
// @route   PUT /api/skillreqs/:id
// @desc    Update a Skill request
// @access  Private (only author can update)
// @ts-ignore
router.put('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, skillNeeded, skillOffered, category, estimatedDuration, deadline, location, isRemote, requirements, deliverables, tags, status, // Allow status update
    acceptedApplicantId, // Allow updating accepted applicant
     } = req.body;
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        const existingRequest = await db.skillRequest.findUnique({
            where: { id },
        });
        if (!existingRequest) {
            return res.status(404).json({ error: 'Skill request not found.' });
        }
        if (existingRequest.authorId !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this skill request.' });
        }
        const updatedSkillRequest = await db.skillRequest.update({
            where: { id },
            data: {
                title: title ?? existingRequest.title,
                description: description ?? existingRequest.description,
                skillNeeded: skillNeeded ?? existingRequest.skillNeeded,
                skillOffered: skillOffered ?? existingRequest.skillOffered,
                category: category ?? existingRequest.category,
                estimatedDuration: estimatedDuration ?? existingRequest.estimatedDuration,
                deadline: deadline ? new Date(deadline) : existingRequest.deadline,
                location: location ?? existingRequest.location,
                isRemote: isRemote ?? existingRequest.isRemote,
                requirements: requirements ?? existingRequest.requirements,
                deliverables: deliverables ?? existingRequest.deliverables,
                tags: tags ?? existingRequest.tags,
                status: status ?? existingRequest.status,
                acceptedApplicantId: acceptedApplicantId ?? existingRequest.acceptedApplicantId,
            },
        });
        res.json(updatedSkillRequest);
    }
    catch (error) {
        console.error('Error updating skill request:', error);
        res.status(500).json({ error: 'Failed to update skill request.' });
    }
});
// @route   DELETE /api/skillreqs/:id
// @desc    Delete a Skill request
// @access  Private (only author can delete)
// @ts-ignore
router.delete('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        const existingRequest = await db.skillRequest.findUnique({
            where: { id },
        });
        if (!existingRequest) {
            return res.status(404).json({ error: 'Skill request not found.' });
        }
        if (existingRequest.authorId !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this skill request.' });
        }
        await db.skillRequest.delete({
            where: { id },
        });
        res.status(204).send(); // No content
    }
    catch (error) {
        console.error('Error deleting skill request:', error);
        res.status(500).json({ error: 'Failed to delete skill request.' });
    }
});
exports.default = router;
