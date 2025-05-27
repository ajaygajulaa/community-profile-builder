
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Coins, Heart, Camera, Video, User } from "lucide-react";

interface HomeProps {
  currentUser: any;
  onLogout: () => void;
  onProfileClick: () => void;
}

const Home = ({ currentUser, onLogout, onProfileClick }: HomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Village Youth Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={onProfileClick} variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button onClick={onLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {currentUser.name}!</h2>
          <p className="text-gray-600">Manage community activities and stay connected</p>
        </div>

        <Tabs defaultValue="ganesh-chanda" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ganesh-chanda">Ganesh Chanda</TabsTrigger>
            <TabsTrigger value="marriage-gold">Marriage Gold</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="ganesh-chanda">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-6 h-6 mr-2 text-orange-600" />
                  Ganesh Chanda Management
                </CardTitle>
                <CardDescription>
                  Manage community funds for festival celebrations and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-2">Current Collection</h3>
                    <p className="text-2xl font-bold text-orange-600">₹25,500</p>
                    <p className="text-sm text-orange-600">Target: ₹50,000</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Contributors</h3>
                    <p className="text-2xl font-bold text-green-600">18</p>
                    <p className="text-sm text-green-600">out of 25 members</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="mr-2">Add Contribution</Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marriage-gold">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-pink-600" />
                  Marriage Gold Fund
                </CardTitle>
                <CardDescription>
                  Support youth members for their marriage celebrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-pink-800 mb-2">Total Fund</h3>
                    <p className="text-2xl font-bold text-pink-600">₹1,25,000</p>
                    <p className="text-sm text-pink-600">Available for distribution</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Recent Support</h3>
                    <p className="text-2xl font-bold text-purple-600">₹15,000</p>
                    <p className="text-sm text-purple-600">Given to Rahul Patel</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="mr-2">Request Support</Button>
                  <Button variant="outline">View Recipients</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-6 h-6 mr-2 text-blue-600" />
                  Photo Gallery
                </CardTitle>
                <CardDescription>
                  Community memories and event photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button className="mr-2">Upload Photos</Button>
                  <Button variant="outline">View All</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-6 h-6 mr-2 text-red-600" />
                  Video Gallery
                </CardTitle>
                <CardDescription>
                  Event videos and community highlights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button className="mr-2">Upload Video</Button>
                  <Button variant="outline">View All</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
