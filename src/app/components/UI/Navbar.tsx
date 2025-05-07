
"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMoreVertical } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
// import { useSelector, useDispatch } from 'react-redux'
import { setfield } from "@/src/store/slices/userSlice";
import { logout } from "@/src/services/Auth";


interface NavbarProps {
  links?: boolean;
}

interface JWTPayload {
  email?: string;
  exp?: number;
  [key: string]: any;
}

const Navbar: React.FC<NavbarProps> = ({ links = true }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locale, setLocale] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  // const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in with NextAuth (Google)
    if (session && session.user?.email) {
      setUserEmail(session.user.email);
      return;
    }

    const storedSession = sessionStorage.getItem("session");
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        if (sessionData.email) {
          setUserEmail(sessionData.email);
          return;
        }
      } catch {
        console.error("Invalid session format");
        sessionStorage.removeItem("session");
      }
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;

        if (payload.exp && Date.now() < payload.exp * 1000) {
          setUserEmail(payload.email ?? null);
          console.log('vlaue got ', payload);
          
          // dispatch(setfield({name: "gmail", value : payload.email}))
          // dispatch(setfield({name: "username", value : payload.username}))
        } else {
          console.warn("Token expired");
          localStorage.removeItem("token");
        }
      } catch {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    } else {
      console.warn("No session or token found");
    }
  }, [session]);
  
  const handleLogout = () => {
    logout();
    if (session) {
      signOut({ callbackUrl: '/' });
    } 
    else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("session");
    }
    
    setUserEmail(null);
    setMenuOpen(false);
  };

 const handlemyShop=() => {

  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="bg-white w-[90%] mx-auto rounded-full flex items-center justify-between mt-4 px-8 py-8 shadow-md">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <h1 className="font-bold text-2xl">Mali*</h1>
        </Link>
      </div>

      <div className="flex items-center space-x-4 relative">
        {userEmail ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">{userEmail}</span>
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <FiMoreVertical size={20} />
            </button>

            {menuOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-lg w-32 z-50"
              >
                <button
                  onClick={() => {
                    router.push("/profile");
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                 onClick={() => {
                  router.push("/myshop");
                  setMenuOpen(false);
                }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  My Shop
                </button>
                <button
                 onClick={() => {
                  router.push("/mylinks");
                  setMenuOpen(false);
                }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  My Links
                </button>
                <button
                 onClick={() => {
                  router.push("/mybookings");
                  setMenuOpen(false);
                }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  My Bookings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
                
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-gray-200 font-medium text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Log In now
            </Link>
            <Link
              href="/signup"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Sign up free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

 //onMonthChange?: (newMonth: string) => void; // Callback for month changes
// onMonthChange