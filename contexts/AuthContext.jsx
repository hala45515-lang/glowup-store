"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signUp(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
      setUser({ ...auth.currentUser });
    }
    return cred.user;
  }

  async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function signInWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  }

  async function logOut() {
    await firebaseSignOut(auth);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function updateDisplayName(displayName) {
    await updateProfile(auth.currentUser, { displayName });
    setUser({ ...auth.currentUser });
  }

  async function updateAvatar(photoURL) {
    await updateProfile(auth.currentUser, { photoURL });
    setUser({ ...auth.currentUser });
  }

  async function changePassword(currentPassword, newPassword) {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    resetPassword,
    updateDisplayName,
    updateAvatar,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
