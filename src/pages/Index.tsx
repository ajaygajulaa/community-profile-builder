
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/LoginForm";
import UserProfile from "@/components/UserProfile";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();

  const handleLogin = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  // Login/Register Page
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // User Profile Page
  if (currentUser.role === "member") {
    return <UserProfile currentUser={currentUser} onLogout={handleLogout} />;
  }

  // Admin Dashboard
  return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
};

export default Index;
