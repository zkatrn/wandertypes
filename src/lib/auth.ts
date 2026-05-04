"use client";

import { auth } from "./firebase";
import { trackEvent } from "./analytics";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  deleteUser,
  reauthenticateWithPopup,
} from "firebase/auth";
import { deleteAllTripSessionsForUser } from "./firestore";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    void trackEvent("login", { method: "google" });
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

/**
 * Google re-auth (required by Firebase before delete), removes saved trip sessions,
 * then deletes the Firebase Auth account.
 */
export async function deleteAccountWithReauth(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not signed in");
  }

  const provider = new GoogleAuthProvider();
  await reauthenticateWithPopup(user, provider);
  await deleteAllTripSessionsForUser(user.uid);
  await deleteUser(user);
}
