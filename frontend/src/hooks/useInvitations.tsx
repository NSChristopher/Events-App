import { useState, useEffect } from 'react';
import { Invitation, User } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useInvitations = () => {
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const [sentResponse, receivedResponse] = await Promise.all([
        api.get('/invitations/sent'),
        api.get('/invitations/received'),
      ]);
      setSentInvitations(sentResponse.data);
      setReceivedInvitations(receivedResponse.data);
    } catch (error: any) {
      console.error('Failed to fetch invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (eventId: number, inviteeId: number) => {
    try {
      const response = await api.post('/invitations', { eventId, inviteeId });
      const newInvitation = response.data;
      setSentInvitations(prev => [newInvitation, ...prev]);
      toast.success('Invitation sent successfully!');
      return newInvitation;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to send invitation';
      toast.error(message);
      throw error;
    }
  };

  const respondToInvitation = async (invitationId: number, status: 'accepted' | 'declined') => {
    try {
      const response = await api.put(`/invitations/${invitationId}/respond`, { status });
      const updatedInvitation = response.data;
      
      setReceivedInvitations(prev => prev.map(invitation =>
        invitation.id === invitationId ? updatedInvitation : invitation
      ));
      
      toast.success(`Invitation ${status}!`);
      return updatedInvitation;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to respond to invitation';
      toast.error(message);
      throw error;
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      if (query.length < 2) return [];
      const response = await api.get(`/invitations/search-users?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to search users:', error);
      return [];
    }
  };

  return {
    sentInvitations,
    receivedInvitations,
    loading,
    sendInvitation,
    respondToInvitation,
    searchUsers,
    fetchInvitations,
    refetch: fetchInvitations,
  };
};