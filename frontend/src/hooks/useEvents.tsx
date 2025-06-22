import { useState, useEffect } from 'react';
import { Event, CreateEventData, UpdateEventData, RsvpData } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error: any) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/user/my-events');
      setEvents(response.data);
    } catch (error: any) {
      console.error('Failed to fetch my events:', error);
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRSVPs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/user/rsvps');
      const eventsFromRSVPs = response.data.map((rsvp: any) => ({
        ...rsvp.event,
        userRsvp: rsvp.response
      }));
      setEvents(eventsFromRSVPs);
    } catch (error: any) {
      console.error('Failed to fetch RSVPs:', error);
      toast.error('Failed to load your RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData) => {
    try {
      const response = await api.post('/events', eventData);
      const newEvent = response.data;
      setEvents(prev => [newEvent, ...prev]);
      toast.success('Event created successfully!');
      return newEvent;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create event';
      toast.error(message);
      throw error;
    }
  };

  const updateEvent = async (id: number, eventData: UpdateEventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      const updatedEvent = response.data;
      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ));
      toast.success('Event updated successfully!');
      return updatedEvent;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update event';
      toast.error(message);
      throw error;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete event';
      toast.error(message);
      throw error;
    }
  };

  const rsvpToEvent = async (eventId: number, response: RsvpData['response']) => {
    try {
      await api.post(`/events/${eventId}/rsvp`, { response });
      // Update the event in the local state to reflect the RSVP
      await fetchEvents(); // Refresh events to get updated attendee counts
      toast.success(`RSVP updated: ${response.replace('_', ' ')}`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to RSVP';
      toast.error(message);
      throw error;
    }
  };

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    fetchEvents,
    fetchMyEvents,
    fetchMyRSVPs,
    refetch: fetchEvents,
  };
};