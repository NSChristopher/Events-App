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

// Get all events (public events for discovery)
router.get('/', async (req, res) => {
  try {
    const events = await db.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
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
      },
      orderBy: {
        eventDate: 'asc'
      }
    });

    // Add attendee count to each event
    const eventsWithCount = events.map(event => ({
      ...event,
      attendeeCount: event._count.rsvps
    }));

    res.json(eventsWithCount);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        invitations: {
          include: {
            invitee: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
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
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventWithCount = {
      ...event,
      attendeeCount: event._count.rsvps
    };

    res.json(eventWithCount);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's events (events they created)
router.get('/user/my-events', authenticateToken, async (req, res) => {
  try {
    const events = await db.event.findMany({
      where: { creatorId: req.user.userId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
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
      },
      orderBy: {
        eventDate: 'asc'
      }
    });

    const eventsWithCount = events.map(event => ({
      ...event,
      attendeeCount: event._count.rsvps
    }));

    res.json(eventsWithCount);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new event (auth required)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, location, eventDate } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({ error: 'Title and event date are required' });
    }

    const event = await db.event.create({
      data: {
        title,
        description,
        location,
        eventDate: new Date(eventDate),
        creatorId: req.user.userId
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true
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
    });

    const eventWithCount = {
      ...event,
      attendeeCount: event._count.rsvps
    };

    res.status(201).json(eventWithCount);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update event (auth required, only creator can update)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, eventDate } = req.body;

    // Check if event exists and user is the creator
    const existingEvent = await db.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existingEvent.creatorId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only edit your own events' });
    }

    const updatedEvent = await db.event.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
        ...(eventDate && { eventDate: new Date(eventDate) })
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
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
    });

    const eventWithCount = {
      ...updatedEvent,
      attendeeCount: updatedEvent._count.rsvps
    };

    res.json(eventWithCount);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete event (auth required, only creator can delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists and user is the creator
    const existingEvent = await db.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existingEvent.creatorId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own events' });
    }

    await db.event.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// RSVP to an event
router.post('/:id/rsvp', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!['attending', 'not_attending', 'maybe'].includes(response)) {
      return res.status(400).json({ error: 'Invalid RSVP response' });
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Upsert RSVP (create or update)
    const rsvp = await db.rsvp.upsert({
      where: {
        eventId_userId: {
          eventId: parseInt(id),
          userId: req.user.userId
        }
      },
      update: {
        response,
        respondedAt: new Date()
      },
      create: {
        eventId: parseInt(id),
        userId: req.user.userId,
        response
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.json(rsvp);
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's RSVPs
router.get('/user/rsvps', authenticateToken, async (req, res) => {
  try {
    const rsvps = await db.rsvp.findMany({
      where: { userId: req.user.userId },
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
        }
      },
      orderBy: {
        event: {
          eventDate: 'asc'
        }
      }
    });

    // Add attendee count to each event
    const rsvpsWithCount = rsvps.map(rsvp => ({
      ...rsvp,
      event: {
        ...rsvp.event,
        attendeeCount: rsvp.event._count.rsvps
      }
    }));

    res.json(rsvpsWithCount);
  } catch (error) {
    console.error('Get user RSVPs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;