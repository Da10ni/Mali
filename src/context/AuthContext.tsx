"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getUserProfile } from "../services/Auth";

interface User {
  username: string;
  email: string;
  profilepicture: string;
}

// Define the context state types
interface AuthContextType {
  user: User;
  loading: boolean;
  error: string | null;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component with types for props
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({ username: "", email: "", profilepicture: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setUser({
          username: userProfile.username,
          email: userProfile.email,
          profilepicture: userProfile.profilepicture,
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export context and provider
export { AuthContext, AuthProvider };
