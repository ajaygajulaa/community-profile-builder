
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Heart, MapPin, ArrowLeft } from "lucide-react";
import { getUsers, type User } from "@/services/database";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  currentUser: User;
  onLogout: () => void;
  onBackToHome: () => void;
}

const UserProfile = ({ currentUser, onLogout, onBackToHome }: UserProfileProps) => {
  const [totalMembers, setTotalMembers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadMemberCount();
  }, []);

  const loadMemberCount = async () => {
    try {
      const users = await getUsers();
      setTotalMembers(users.filter(u => u.role === 'member').length);
    } catch (error) {
      console.error('Error loading member count:', error);
      toast({
        title: "Error",
        description: "Failed to load member count",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button onClick={onBackToHome} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Village Youth Hub</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Community Member since {currentUser.join_date}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-gray-900">{currentUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-gray-900">{currentUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Age</Label>
                    <p className="text-gray-900">{currentUser.age ? `${currentUser.age} years old` : 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Occupation</Label>
                    <p className="text-gray-900">{currentUser.occupation || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {currentUser.interests && currentUser.interests.length > 0 ? (
                        currentUser.interests.map((interest: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No interests listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{totalMembers}</p>
                  <p className="text-sm text-gray-600">Active Members</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Events This Month</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">5</p>
                  <p className="text-sm text-gray-600">Years Established</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout Button at Bottom */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Button 
                  onClick={onLogout} 
                  variant="destructive" 
                  size="lg"
                  className="w-full md:w-auto"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
