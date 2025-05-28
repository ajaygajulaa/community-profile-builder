import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/utils/mockData";

interface LoginFormProps {
  onLogin: (user: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    occupation: "",
    interests: ""
  });
  const { toast } = useToast();

  const handleLogin = () => {
    const user = mockUsers.find(u => u.email === loginEmail);
    
    if (user) {
      // Check for admin credentials
      if (user.role === "admin" && loginEmail === "admin@gmail.com" && loginPassword === "admin@123") {
        onLogin(user);
        toast({
          title: "Welcome back Admin!",
          description: `Successfully logged in as ${user.name}`,
        });
        return;
      }
      
      // For regular users, any password works (demo purposes)
      if (user.role === "member") {
        onLogin(user);
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${user.name}`,
        });
        return;
      }
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
  };

  const handleRegister = () => {
    const newUser = {
      id: mockUsers.length + 1,
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      age: parseInt(registerData.age),
      occupation: registerData.occupation,
      interests: registerData.interests.split(",").map(i => i.trim()),
      role: "member",
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    mockUsers.push(newUser);
    onLogin(newUser);
    toast({
      title: "Registration successful!",
      description: `Welcome to our community, ${newUser.name}!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Village Youth Hub</h1>
          <p className="text-gray-600">Connect with your community</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Join our growing community of young changemakers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@village.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
                  Sign In
                </Button>
                <div className="text-sm text-gray-600 mt-4">
                  <p className="font-medium">Demo Accounts:</p>
                  <p>User: priya.sharma@gmail.com (any password)</p>
                  <p>Admin: admin@gmail.com</p>
                  <p>Admin Password: admin@123</p>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={registerData.age}
                      onChange={(e) => setRegisterData({...registerData, age: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your.email@village.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="Student, Teacher, Farmer, etc."
                    value={registerData.occupation}
                    onChange={(e) => setRegisterData({...registerData, occupation: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests (comma separated)</Label>
                  <Input
                    id="interests"
                    placeholder="Sports, Education, Technology"
                    value={registerData.interests}
                    onChange={(e) => setRegisterData({...registerData, interests: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  />
                </div>
                <Button onClick={handleRegister} className="w-full bg-green-600 hover:bg-green-700">
                  Join Community
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
