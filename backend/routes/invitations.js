const express = require('express');
const db = require('../db');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Send invitation to user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { eventId, inviteeId } = req.body;

    if (!eventId || !inviteeId) {
      return res.status(400).json({ error: 'Event ID and invitee ID are required' });
    }

    // Check if event exists and user is the creator
    const event = await db.event.findUnique({
      where: { id: parseInt(eventId) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.creatorId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only invite users to your own events' });
    }

    // Check if invitee exists
    const invitee = await db.user.findUnique({
      where: { id: parseInt(inviteeId) }
    });

    if (!invitee) {
      return res.status(404).json({ error: 'User to invite not found' });
    }

    // Check if invitation already exists
    const existingInvitation = await db.invitation.findUnique({
      where: {
        eventId_inviteeId: {
          eventId: parseInt(eventId),
          inviteeId: parseInt(inviteeId)
        }
      }
    });

    if (existingInvitation) {
      return res.status(400).json({ error: 'User has already been invited to this event' });
    }

    // Create invitation
    const invitation = await db.invitation.create({
      data: {
        eventId: parseInt(eventId),
        inviterId: req.user.userId,
        inviteeId: parseInt(inviteeId)
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            location: true
          }
        },
        inviter: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        invitee: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(invitation);
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invitations received by user
router.get('/received', authenticateToken, async (req, res) => {
  try {
    const invitations = await db.invitation.findMany({
      where: { inviteeId: req.user.userId },
      include: {
        event: {
          include: {
            creator: {
              select: {
                id: true,
                username: true
              }
            },
            _count: {
              select: {
                rsvps: {
                  where: {
                    response: 'attending'
                  }
                }
              }
            }
          }
        },
        inviter: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        sentAt: 'desc'
      }
    });

    // Add attendee count to each event
    const invitationsWithCount = invitations.map(invitation => ({
      ...invitation,
      event: {
        ...invitation.event,
        attendeeCount: invitation.event._count.rsvps
      }
    }));

    res.json(invitationsWithCount);
  } catch (error) {
    console.error('Get received invitations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invitations sent by user
router.get('/sent', authenticateToken, async (req, res) => {
  try {
    const invitations = await db.invitation.findMany({
      where: { inviterId: req.user.userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            location: true
          }
        },
        invitee: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        sentAt: 'desc'
      }
    });

    res.json(invitations);
  } catch (error) {
    console.error('Get sent invitations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Respond to invitation (accept/decline)
router.put('/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid response status' });
    }

    // Check if invitation exists and user is the invitee
    const invitation = await db.invitation.findUnique({
      where: { id: parseInt(id) },
      include: {
        event: true
      }
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.inviteeId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only respond to your own invitations' });
    }

    // Update invitation status
    const updatedInvitation = await db.invitation.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        event: {
          include: {
            creator: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        inviter: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    // If accepted, create or update RSVP
    if (status === 'accepted') {
      await db.rsvp.upsert({
        where: {
          eventId_userId: {
            eventId: invitation.eventId,
            userId: req.user.userId
          }
        },
        update: {
          response: 'attending',
          respondedAt: new Date()
        },
        create: {
          eventId: invitation.eventId,
          userId: req.user.userId,
          response: 'attending'
        }
      });
    }

    res.json(updatedInvitation);
  } catch (error) {
    console.error('Respond to invitation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users to invite (search users by username/email)
router.get('/search-users', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await db.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: req.user.userId // Exclude current user
            }
          },
          {
            OR: [
              {
                username: {
                  contains: q,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: q,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true
      },
      take: 10 // Limit results
    });

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;