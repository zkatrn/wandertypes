"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithGoogle, signOut } from "@/lib/auth";
import { Button } from "./ui/Button";
import { LogOut, ChevronDown, Plus, Share2, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import balloonImage from "@/lib/assets/balloon.png";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isResultsPage = pathname?.startsWith('/results');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <header className="sticky top-0 z-[100] bg-white/40 backdrop-blur-xl border-b border-white/20 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src={balloonImage} alt="VoyageBlitz" width={32} height={32} />
            <span className="text-lg font-serif font-bold text-primary">
              VoyageBlitz
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-10 bg-stone-100 animate-pulse rounded-lg" />
          ) : user ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-stone-600 hidden sm:inline">
                    {user.displayName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-600" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/85 backdrop-blur-xl border border-white/30 rounded-lg shadow-lg py-1 z-[110]">
                    <Link
                      href="/"
                      className="block w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      New Trip
                    </Link>
                    {isResultsPage && (
                      <button
                        onClick={() => {
                          handleShare();
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4" />
                            Share
                          </>
                        )}
                      </button>
                    )}
                    <Link
                      href="/trips"
                      className="block w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 border-t border-stone-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Trips
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 flex items-center gap-2 border-t border-stone-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button onClick={handleSignIn}>Sign In with Google</Button>
          )}
        </div>
      </div>
    </header>
  );
}
