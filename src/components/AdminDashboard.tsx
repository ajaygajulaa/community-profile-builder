
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, Upload, Coins, Heart, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUsers, getFinancialData, updateFinancialData, deleteUser, uploadMediaFile, type User, type FinancialData } from "@/services/database";

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const AdminDashboard = ({ currentUser, onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [ganeshAmount, setGaneshAmount] = useState(0);
  const [goldAmount, setGoldAmount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, financialDataResult] = await Promise.all([
        getUsers(),
        getFinancialData()
      ]);
      
      setUsers(usersData);
      setFinancialData(financialDataResult);
      
      const ganeshData = financialDataResult.find(f => f.type === 'ganesh_chanda');
      const goldData = financialDataResult.find(f => f.type === 'marriage_gold');
      
      setGaneshAmount(ganeshData?.current_amount || 0);
      setGoldAmount(goldData?.total_fund || 0);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast({
        title: "User removed",
        description: "User has been removed from the community",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  const updateGaneshAmount = async () => {
    setIsLoading(true);
    try {
      await updateFinancialData('ganesh_chanda', { current_amount: ganeshAmount });
      toast({
        title: "Ganesh Chanda Updated",
        description: `Amount updated to ₹${ganeshAmount.toLocaleString()}`,
      });
    } catch (error) {
      console.error('Error updating Ganesh amount:', error);
      toast({
        title: "Error",
        description: "Failed to update Ganesh Chanda amount",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoldAmount = async () => {
    setIsLoading(true);
    try {
      await updateFinancialData('marriage_gold', { total_fund: goldAmount });
      toast({
        title: "Marriage Gold Fund Updated",
        description: `Amount updated to ₹${goldAmount.toLocaleString()}`,
      });
    } catch (error) {
      console.error('Error updating Gold amount:', error);
      toast({
        title: "Error",
        description: "Failed to update Marriage Gold Fund",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await uploadMediaFile(selectedFile, uploadDescription, currentUser.id);
      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} has been uploaded to the gallery`,
      });
      setSelectedFile(null);
      setUploadDescription("");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Welcome, {currentUser.name}</span>
              </CardTitle>
              <CardDescription>
                Manage your village youth community
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Financial Management */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-orange-600" />
                  <span>Ganesh Chanda Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ganesh-amount">Current Amount (₹)</Label>
                  <Input
                    id="ganesh-amount"
                    type="number"
                    value={ganeshAmount}
                    onChange={(e) => setGaneshAmount(Number(e.target.value))}
                  />
                </div>
                <Button 
                  onClick={updateGaneshAmount} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Ganesh Chanda Amount"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span>Marriage Gold Fund</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gold-amount">Total Fund (₹)</Label>
                  <Input
                    id="gold-amount"
                    type="number"
                    value={goldAmount}
                    onChange={(e) => setGoldAmount(Number(e.target.value))}
                  />
                </div>
                <Button 
                  onClick={updateGoldAmount} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Marriage Gold Fund"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Files & Videos</span>
              </CardTitle>
              <CardDescription>
                Upload photos and videos to the community gallery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this file..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleFileUpload} 
                className="w-full" 
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? "Uploading..." : "Upload File"}
              </Button>
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </CardContent>
          </Card>

          {/* Community Members */}
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>
                Total members: {users.filter(u => u.role === 'member').length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.filter(u => u.role === 'member').map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-green-600">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.occupation} • Age {user.age}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Joined {user.join_date}
                      </Badge>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Total Members</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.role === 'member').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <span>Ganesh Fund</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  ₹{ganeshAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Marriage Fund</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-pink-600">
                  ₹{goldAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
