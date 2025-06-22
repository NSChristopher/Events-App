import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types';
import { Plus, Edit, Trash2, LogOut, User, Calendar, MapPin, Users, UserPlus } from 'lucide-react';
import InviteUsersModal from '@/components/InviteUsersModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { events, loading, createEvent, updateEvent, deleteEvent, fetchMyEvents } = useEvents();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'my-events' | 'all-events'>('my-events');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedEventForInvite, setSelectedEventForInvite] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (viewMode === 'my-events') {
      fetchMyEvents();
    }
  }, [viewMode]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // Error handled in auth hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.eventDate) return;

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
        setEditingEvent(null);
      } else {
        await createEvent(formData);
        setShowCreateForm(false);
      }
      setFormData({ title: '', description: '', location: '', eventDate: '' });
    } catch (error) {
      // Error handled in hooks
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
    });
    setShowCreateForm(true);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setShowCreateForm(false);
    setFormData({ title: '', description: '', location: '', eventDate: '' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
      } catch (error) {
        // Error handled in hooks
      }
    }
  };

  const handleInviteUsers = (event: Event) => {
    setSelectedEventForInvite(event);
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setSelectedEventForInvite(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your vibrant events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                VividEvents
              </h1>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'my-events' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('my-events')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  My Events
                </Button>
                <Button
                  variant={viewMode === 'all-events' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setViewMode('all-events');
                    navigate('/discover');
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Discover
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Event Button */}
        <div className="mb-8">
          {!showCreateForm && (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Event
            </Button>
          )}
        </div>

        {/* Create/Edit Event Form */}
        {showCreateForm && (
          <Card className="mb-8 border-2 border-purple-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-2xl text-purple-800">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </CardTitle>
              <CardDescription className="text-purple-600">
                {editingEvent ? 'Update your event details' : 'Fill in the details for your vibrant event'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-700 font-medium">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter an exciting event title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] rounded-md border border-purple-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2"
                    placeholder="Describe what makes this event special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where will the magic happen?"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="eventDate" className="text-gray-700 font-medium">Event Date & Time *</Label>
                  <Input
                    id="eventDate"
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <Card className="border-2 border-dashed border-purple-300 bg-white/70">
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {viewMode === 'my-events' ? 'No events created yet' : 'No events found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {viewMode === 'my-events' 
                    ? 'Create your first vibrant event to get started!' 
                    : 'Try browsing all events or create your own.'
                  }
                </p>
                {viewMode === 'my-events' && (
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card 
                key={event.id} 
                className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm hover:transform hover:scale-[1.02]"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-800 mb-2">
                        {event.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-pink-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-green-500" />
                          <span>{event.attendeeCount || 0} attending</span>
                        </div>
                      </div>
                    </div>
                    {viewMode === 'my-events' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInviteUsers(event)}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                {event.description && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Invite Users Modal */}
      {selectedEventForInvite && (
        <InviteUsersModal
          eventId={selectedEventForInvite.id}
          eventTitle={selectedEventForInvite.title}
          isOpen={inviteModalOpen}
          onClose={handleCloseInviteModal}
        />
      )}
    </div>
  );
};

export default Dashboard;