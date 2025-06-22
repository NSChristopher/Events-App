import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvitations } from '@/hooks/useInvitations';
import { User } from '@/types';
import { Search, UserPlus, X } from 'lucide-react';

interface InviteUsersModalProps {
  eventId: number;
  eventTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const InviteUsersModal: React.FC<InviteUsersModalProps> = ({
  eventId,
  eventTitle,
  isOpen,
  onClose,
}) => {
  const { searchUsers, sendInvitation } = useInvitations();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<number[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setLoading(true);
      try {
        const results = await searchUsers(query);
        setSearchResults(results);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInvite = async (userId: number) => {
    try {
      await sendInvitation(eventId, userId);
      setInvitedUsers(prev => [...prev, userId]);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setInvitedUsers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-purple-800">Invite Friends</CardTitle>
              <CardDescription className="text-purple-600">
                Invite people to "{eventTitle}"
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search" className="text-gray-700 font-medium">
                Search Users
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Searching...</p>
                </div>
              )}

              {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No users found</p>
                </div>
              )}

              {!loading && searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleInvite(user.id)}
                        disabled={invitedUsers.includes(user.id)}
                        className={
                          invitedUsers.includes(user.id)
                            ? "bg-green-600 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }
                      >
                        {invitedUsers.includes(user.id) ? (
                          "Invited!"
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Invite
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Type at least 2 characters to search for users
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteUsersModal;