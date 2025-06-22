import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useInvitations } from '@/hooks/useInvitations';
import { Calendar, MapPin, Users, ArrowLeft, UserPlus, Check, X, Heart } from 'lucide-react';

const Discover = () => {
  const { user } = useAuth();
  const { events, loading, rsvpToEvent, fetchEvents } = useEvents();
  const { receivedInvitations, respondToInvitation } = useInvitations();
  const [activeTab, setActiveTab] = useState<'discover' | 'invitations'>('discover');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (activeTab === 'discover') {
      fetchEvents();
    }
  }, [activeTab]);

  const handleRSVP = async (eventId: number, response: 'attending' | 'not_attending' | 'maybe') => {
    try {
      await rsvpToEvent(eventId, response);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleInvitationResponse = async (invitationId: number, status: 'accepted' | 'declined') => {
    try {
      await respondToInvitation(invitationId, status);
    } catch (error) {
      // Error handled in hook
    }
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

  const filteredEvents = events.filter(event => event.creatorId !== user?.id);
  const pendingInvitations = receivedInvitations.filter(inv => inv.status === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Discovering amazing events...</p>
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
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover Events
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'discover' ? 'default' : 'outline'}
                onClick={() => setActiveTab('discover')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Discover
              </Button>
              <Button
                variant={activeTab === 'invitations' ? 'default' : 'outline'}
                onClick={() => setActiveTab('invitations')}
                className="bg-pink-600 hover:bg-pink-700 text-white relative"
              >
                Invitations
                {pendingInvitations.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingInvitations.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Explore Vibrant Events</h2>
              <p className="text-gray-600">Discover amazing events happening around you!</p>
            </div>

            {filteredEvents.length === 0 ? (
              <Card className="border-2 border-dashed border-purple-300 bg-white/70">
                <CardContent className="text-center py-12">
                  <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No events to discover yet</h3>
                  <p className="text-gray-500 mb-4">
                    Be the first to create an exciting event for the community!
                  </p>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Create First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="border-l-4 border-l-pink-500 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm hover:transform hover:scale-105"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-gray-800 mb-2">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        by {event.creator.username}
                      </CardDescription>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-green-500" />
                          <span>{event.attendeeCount || 0} attending</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {event.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {event.description}
                        </p>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRSVP(event.id, 'attending')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Going
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRSVP(event.id, 'maybe')}
                          className="flex-1 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Maybe
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRSVP(event.id, 'not_attending')}
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Pass
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Invitations</h2>
              <p className="text-gray-600">Respond to event invitations from friends!</p>
            </div>

            {receivedInvitations.length === 0 ? (
              <Card className="border-2 border-dashed border-pink-300 bg-white/70">
                <CardContent className="text-center py-12">
                  <UserPlus className="h-16 w-16 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No invitations yet</h3>
                  <p className="text-gray-500">
                    When friends invite you to events, they'll appear here!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {receivedInvitations.map((invitation) => (
                  <Card 
                    key={invitation.id} 
                    className={`shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm ${
                      invitation.status === 'pending' 
                        ? 'border-l-4 border-l-yellow-500' 
                        : invitation.status === 'accepted'
                        ? 'border-l-4 border-l-green-500'
                        : 'border-l-4 border-l-red-500'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-800 mb-1">
                            {invitation.event?.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mb-3">
                            Invited by {invitation.inviter?.username}
                          </CardDescription>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                              <span>{invitation.event && formatDate(invitation.event.eventDate)}</span>
                            </div>
                            {invitation.event?.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                                <span>{invitation.event.location}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-green-500" />
                              <span>{invitation.event?.attendeeCount || 0} attending</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invitation.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : invitation.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {invitation.event?.description && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {invitation.event.description}
                        </p>
                      )}
                      {invitation.status === 'pending' && (
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Discover;