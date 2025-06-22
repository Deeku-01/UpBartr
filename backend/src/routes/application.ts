import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { Request, Response } from 'express';

const router = Router();
const db = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// These routes will handle the complete application lifecycle from submission to completion.


// Helper function to safely parse query parameters
const parseQueryParam = (param: any, defaultValue: string): string => {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && param.length > 0 && typeof param[0] === 'string') {
    return param[0];
  }
  return defaultValue;
};

const parseIntParam = (param: any, defaultValue: number): number => {
  const parsed = parseQueryParam(param, defaultValue.toString());
  const num = parseInt(parsed, 10);
  return isNaN(num) ? defaultValue : num;
};



// Submit application to a skill request  by other user 
// @ts-ignore
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      skillRequestId,
      message,
      proposedTimeline,
      portfolio,
      experience,
      whyChooseMe
    } = req.body;

    if (!skillRequestId || !message) {
      return res.status(400).json({
        error: 'Skill request ID and message are required'
      });
    }

    // Check if skill request exists and is open
    const skillRequest = await db.skillRequest.findFirst({
      where: { id: skillRequestId },
      select: {
        id: true,
        authorId: true,
        status: true,
        title: true,
        skillNeeded: true,
        skillOffered: true
      }
    });

    if (!skillRequest) {
      return res.status(404).json({ error: 'Skill request not found' });
    }

    if (skillRequest.status !== 'OPEN') {
      return res.status(400).json({
        error: 'This skill request is no longer accepting applications'
      });
    }

    if (skillRequest.authorId === req.user?.id) {
      return res.status(400).json({
        error: 'Cannot apply to your own skill request'
      });
    }

    // Check if user already applied
    const existingApplication = await db.application.findFirst({
      where: {
        skillRequestId,
        applicantId: req.user?.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        error: 'You have already applied to this skill request'
      });
    }

    // Create application
    const application = await db.application.create({
      data: {
        skillRequestId,
        applicantId: req.user!.id,
        message,
        proposedTimeline: proposedTimeline || null,
        portfolio: portfolio || [],
        experience: experience || null,
        whyChooseMe: whyChooseMe || null,
        status: 'PENDING'
      },
      include: {
        applicant: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            rating: true,
            totalRatings: true,
            bio: true,
            location: true
          }
        },
        skillRequest: {
          select: {
            id: true,
            title: true,
            skillNeeded: true,
            skillOffered: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
                username: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's own applications (applications they submitted)
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    // Parse query parameters with defaults
    const status = parseQueryParam(req.query.status, 'ALL');
    const page = parseIntParam(req.query.page, 1);
    const limit = parseIntParam(req.query.limit, 10);
    const sortBy = parseQueryParam(req.query.sortBy, 'createdAt');
    const sortOrder = parseQueryParam(req.query.sortOrder, 'desc');

    const skip = (page - 1) * limit;
    const take = limit;

    let whereClause: any = { applicantId: req.user!.id };

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    const [applications, totalCount] = await Promise.all([
      db.application.findMany({
        where: whereClause,
        include: {
          skillRequest: {
            select: {
              id: true,
              title: true,
              description: true,
              skillNeeded: true,
              skillOffered: true,
              category: true,
              status: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatar: true,
                  rating: true
                }
              }
            }
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true
            }
          }
        },
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc'
        }
      }),
      db.application.count({ where: whereClause })
    ]);

    res.json({
      applications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        hasNext: skip + take < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});


// Get applications received for user's skill requests
router.get('/received', authenticateToken, async (req, res) => {
  try {
    const {
      skillRequestId
    } = req.query;

    const status = parseQueryParam(req.query.status, 'ALL');
    const page = parseIntParam(req.query.page, 1);
    const limit = parseIntParam(req.query.limit, 10);

    const skip = (page - 1) * limit;
    const take = limit;


    let whereClause:any = {
      skillRequest: {
        authorId: req.user!.id
      }
    };

    if (skillRequestId) {
      whereClause.skillRequestId = skillRequestId;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    const [applications, totalCount] = await Promise.all([
      db.application.findMany({
        where: whereClause,
        include: {
          applicant: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              rating: true,
              totalRatings: true,
              location: true,
              createdAt: true
            }
          },
          skillRequest: {
            select: {
              id: true,
              title: true,
              skillNeeded: true,
              skillOffered: true,
              category: true,
              status: true
            }
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true
            }
          }
        },
        skip,
        take,
        orderBy: [
          { status: 'asc' }, // Pending first
          { createdAt: 'desc' }
        ]
      }),
      db.application.count({ where: whereClause })
    ]);

    res.json({
      applications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / take),
        totalCount,
        hasNext: skip + take < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get received applications error:', error);
    res.status(500).json({ error: 'Failed to fetch received applications' });
  }
});


// Get specific application details
// @ts-ignore
router.get('/:applicationId', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await db.application.findFirst({
      where: { id: applicationId },
      include: {
        applicant: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            rating: true,
            totalRatings: true,
            location: true,
            createdAt: true
          }
        },
        skillRequest: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
                rating: true
              }
            }
          }
        },
        review: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is authorized to view this application
    const isApplicant = application.applicantId === req.user!.id;
    const isSkillRequestAuthor = application.skillRequest.authorId === req.user!.id;

    if (!isApplicant && !isSkillRequestAuthor) {
      return res.status(403).json({
        error: 'Not authorized to view this application'
      });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Update application (only by applicant before it's accepted)
// @ts-ignore
router.put('/:applicationId', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const {
      message,
      proposedTimeline,
      portfolio,
      experience,
      whyChooseMe
    } = req.body;

    // Check if application exists and user owns it
    const existingApplication = await db.application.findFirst({
      where: { id: applicationId },
      select: {
        applicantId: true,
        status: true,
        skillRequest: {
          select: {
            status: true
          }
        }
      }
    });

    if (!existingApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (existingApplication.applicantId !== req.user!.id) {
      return res.status(403).json({
        error: 'Not authorized to update this application'
      });
    }

    if (existingApplication.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Cannot update application that has already been responded to'
      });
    }

    if (existingApplication.skillRequest.status !== 'OPEN') {
      return res.status(400).json({
        error: 'Cannot update application for closed skill request'
      });
    }

    const updatedApplication = await db.application.update({
      where: { id: applicationId },
      data: {
        message: message || undefined,
        proposedTimeline: proposedTimeline !== undefined ? proposedTimeline : undefined,
        portfolio: portfolio || undefined,
        experience: experience !== undefined ? experience : undefined,
        whyChooseMe: whyChooseMe !== undefined ? whyChooseMe : undefined
      },
      include: {
        applicant: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            avatar: true
          }
        },
        skillRequest: {
          select: {
            title: true
          }
        }
      }
    });

    res.json({
      message: 'Application updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Withdraw application (only by applicant)
// @ts-ignore
router.delete('/:applicationId', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Check if application exists and user owns it
    const existingApplication = await db.application.findFirst({
      where: { id: applicationId },
      select: {
        applicantId: true,
        status: true
      }
    });

    if (!existingApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (existingApplication.applicantId !== req.user!.id) {
      return res.status(403).json({
        error: 'Not authorized to withdraw this application'
      });
    }

    if (['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(existingApplication.status)) {
      return res.status(400).json({
        error: 'Cannot withdraw application that is already in progress or completed'
      });
    }

    // Update status to WITHDRAWN instead of deleting
    await db.application.update({
      where: { id: applicationId },
      data: {
        status: 'WITHDRAWN'
      }
    });

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

// Accept/Reject application (only by skill request author)
// @ts-ignore
router.put('/:applicationId/respond', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, responseMessage } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be either ACCEPTED or REJECTED'
      });
    }

    // Get application with skill request details
    const application = await db.application.findFirst({
      where: { id: applicationId },
      include: {
        skillRequest: {
          select: {
            id: true,
            authorId: true,
            status: true,
            title: true
          }
        },
        applicant: {
          select: {
            firstName: true,
            lastName: true,
            username: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check authorization
    if (application.skillRequest.authorId !== req.user!.id) {
      return res.status(403).json({
        error: 'Not authorized to respond to this application'
      });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Application has already been responded to'
      });
    }

    if (application.skillRequest.status !== 'OPEN') {
      return res.status(400).json({
        error: 'Cannot respond to applications for closed skill requests'
      });
    }

    // Start transaction to update application and potentially skill request
    const result = await db.$transaction(async (tx) => {
      // Update the application
      const updatedApplication = await tx.application.update({
        where: { id: applicationId },
        data: {
          status,
          responseMessage: responseMessage || null,
          respondedAt: new Date(),
          ...(status === 'ACCEPTED' && { startedAt: new Date() })
        },
        include: {
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatar: true
            }
          },
          skillRequest: {
            select: {
              title: true
            }
          }
        }
      });

      // If accepted, update skill request status and reject other applications
      if (status === 'ACCEPTED') {
        // Update skill request status
        await tx.skillRequest.update({
          where: { id: application.skillRequest.id },
          data: {
            status: 'IN_PROGRESS',
            acceptedApplicantId: application.applicantId
          }
        });

        // Reject all other pending applications for this skill request
        await tx.application.updateMany({
          where: {
            skillRequestId: application.skillRequest.id,
            id: { not: applicationId },
            status: 'PENDING'
          },
          data: {
            status: 'REJECTED',
            responseMessage: 'Another applicant was selected for this skill request',
            respondedAt: new Date()
          }
        });
      }

      return updatedApplication;
    });

    res.json({
      message: `Application ${status.toLowerCase()} successfully`,
      application: result
    });
  } catch (error) {
    console.error('Respond to application error:', error);
    res.status(500).json({ error: 'Failed to respond to application' });
  }
});

// Mark application as completed (by either party)
// @ts-ignore
router.put('/:applicationId/complete', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await db.application.findFirst({
      where: { id: applicationId },
      include: {
        skillRequest: {
          select: {
            authorId: true,
            title: true
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is either the applicant or skill request author
    const isApplicant = application.applicantId === req.user!.id;
    const isSkillRequestAuthor = application.skillRequest.authorId === req.user!.id;

    if (!isApplicant && !isSkillRequestAuthor) {
      return res.status(403).json({
        error: 'Not authorized to complete this application'
      });
    }

    if (application.status !== 'ACCEPTED' && application.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        error: 'Can only complete accepted or in-progress applications'
      });
    }

    // Update application and skill request status
    const result = await db.$transaction(async (tx) => {
      const updatedApplication = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        },
        include: {
          applicant: {
            select: {
              firstName: true,
              lastName: true,
              username: true
            }
          },
          skillRequest: {
            select: {
              title: true,
              author: {
                select: {
                  firstName: true,
                  lastName: true,
                  username: true
                }
              }
            }
          }
        }
      });

      // Update skill request status
      await tx.skillRequest.update({
        where: { id: application.skillRequestId },
        data: {
          status: 'COMPLETED'
        }
      });

      return updatedApplication;
    });

    res.json({
      message: 'Application marked as completed successfully',
      application: result
    });
  } catch (error) {
    console.error('Complete application error:', error);
    res.status(500).json({ error: 'Failed to complete application' });
  }
});

// Get application statistics for dashboard
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const [
      totalApplicationsSubmitted,
      pendingApplications,
      acceptedApplications,
      completedApplications,
      applicationsReceived,
      pendingReceivedApplications
    ] = await Promise.all([
      // Applications submitted by user
      db.application.count({
        where: { applicantId: req.user!.id }
      }),
      db.application.count({
        where: { applicantId: req.user!.id, status: 'PENDING' }
      }),
      db.application.count({
        where: { applicantId: req.user!.id, status: 'ACCEPTED' }
      }),
      db.application.count({
        where: { applicantId: req.user!.id, status: 'COMPLETED' }
      }),
      
      // Applications received for user's skill requests
      db.application.count({
        where: {
          skillRequest: {
            authorId: req.user!.id
          }
        }
      }),
      db.application.count({
        where: {
          skillRequest: {
            authorId: req.user!.id
          },
          status: 'PENDING'
        }
      })
    ]);

    const stats = {
      submitted: {
        total: totalApplicationsSubmitted,
        pending: pendingApplications,
        accepted: acceptedApplications,
        completed: completedApplications
      },
      received: {
        total: applicationsReceived,
        pending: pendingReceivedApplications
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ error: 'Failed to fetch application statistics' });
  }
});

export default router;