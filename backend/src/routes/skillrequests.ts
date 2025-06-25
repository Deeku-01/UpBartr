import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const db = new PrismaClient();

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
        })

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


export default router;