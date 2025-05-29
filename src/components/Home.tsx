
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Coins, Heart, Camera, Video, User } from "lucide-react";
import { getFinancialData, getMediaFiles, type User as UserType, type FinancialData, type MediaFile } from "@/services/database";
import { useToast } from "@/hooks/use-toast";

interface HomeProps {
  currentUser: UserType;
  onLogout: () => void;
  onProfileClick: () => void;
}

const Home = ({ currentUser, onLogout, onProfileClick }: HomeProps) => {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [financialDataResult, mediaFilesResult] = await Promise.all([
        getFinancialData(),
        getMediaFiles()
      ]);
      
      setFinancialData(financialDataResult);
      setMediaFiles(mediaFilesResult);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const ganeshData = financialData.find(f => f.type === 'ganesh_chanda');
  const goldData = financialData.find(f => f.type === 'marriage_gold');

  const photoFiles = mediaFiles.filter(file => file.file_type === 'image');
  const videoFiles = mediaFiles.filter(file => file.file_type === 'video');

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
                    <p className="text-2xl font-bold text-orange-600">₹{ganeshData?.current_amount?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-orange-600">Target: ₹{ganeshData?.target_amount?.toLocaleString() || '50,000'}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Contributors</h3>
                    <p className="text-2xl font-bold text-green-600">{ganeshData?.contributors || 0}</p>
                    <p className="text-sm text-green-600">out of {ganeshData?.total_members || 0} members</p>
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
                    <p className="text-2xl font-bold text-pink-600">₹{goldData?.total_fund?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-pink-600">Available for distribution</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Recent Support</h3>
                    <p className="text-2xl font-bold text-purple-600">₹{goldData?.recent_support?.toLocaleString() || '0'}</p>
                    <p className="text-sm text-purple-600">Given to {goldData?.last_recipient || 'N/A'}</p>
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
                  Community memories and event photos ({photoFiles.length} photos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photoFiles.length > 0 ? (
                    photoFiles.slice(0, 8).map((file) => (
                      <div key={file.id} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center p-2">
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500 truncate">{file.filename}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6">
                  <Button className="mr-2" disabled>Upload Photos (Admin Only)</Button>
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
                  Event videos and community highlights ({videoFiles.length} videos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {videoFiles.length > 0 ? (
                    videoFiles.slice(0, 6).map((file) => (
                      <div key={file.id} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center p-2">
                          <Video className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500 truncate">{file.filename}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    Array.from({ length: 6 }, (_, i) => (
                      <div key={i} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6">
                  <Button className="mr-2" disabled>Upload Video (Admin Only)</Button>
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
