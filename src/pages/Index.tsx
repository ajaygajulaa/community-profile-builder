
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/LoginForm";
import Home from "@/components/Home";
import UserProfile from "@/components/UserProfile";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState("home"); // "home" or "profile"
  const { toast } = useToast();

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentView("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("home");
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  const handleProfileClick = () => {
    setCurrentView("profile");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  // Login/Register Page
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Admin Dashboard
  if (currentUser.role === "admin") {
    return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  // User Profile Page
  if (currentView === "profile") {
    return (
      <UserProfile 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Home Page (default for members)
  return (
    <Home 
      currentUser={currentUser} 
      onLogout={handleLogout}
      onProfileClick={handleProfileClick}
    />
  );
};

export default Index;
