import React, { createContext, useEffect, useState } from 'react'
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, sendPasswordResetEmail, updateProfile, signOut } from 'firebase/auth'
import app from '../firebase/firebase.init'

// Declare auth from firebase sdk & import the app from firebase.init.js
const auth = getAuth(app);

// Create a context
export const AuthContext = createContext();

const AuthProvider = ({children}) => {

  // User state
  const [user, setUser] = useState('');

  // Loader state
  const [loading, setLoading] = useState(true);

  // Get the currently signed-in user
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      // Set user to the state
      setUser(currentUser);
      // Set loader to false once we got the user
      setLoading(false);
    });
    return () => unSubscribe();
  },[]);

  // Create a password-based account
  const signupWithEmailPassword = (email, password) => {
    // Set loader true to show the loader until we got the user
    // setLoading(true);
    // Return the firebase api function
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in a user with email address and password
  const logInWithEmailPassword = (email, password) => {
    // Set loader true to show the loader until we got the user
    // setLoading(true);
    // Return the firebase api function
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Social media providers
  const googleProvider = new GoogleAuthProvider();
  const twitterProvider = new TwitterAuthProvider();
  const githubProvider = new GithubAuthProvider();

  // Authenticate using social media (Popup)
  const logInWithPopup = provider => {
    // Set loader true to show the loader until we got the user
    // setLoading(true);
    // Return the firebase api function
    return signInWithPopup(auth, provider);
  };

  // Send verification email [skipped for this assignment, after result just import "sendEmailVerification" then enable the bellow code and send context value "verifyEmail"]
  // const verifyEmail = () => {
  //   // Return the firebase api function
  //   return sendEmailVerification(auth.currentUser);
  // };

  // Update user details
  const updateUserProfile = info => {
    // Return the firebase api function
    return updateProfile(auth.currentUser, info);
  };

  // Send a password reset email
  const passwordResetEmail = email => {
    // Return the firebase api function
    return sendPasswordResetEmail(auth, email);
  };

  // Sign out
  const userLogOut = () => {
    // Empty the user state
    setUser('');
    // Return the firebase api function
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{user, googleProvider, twitterProvider, githubProvider, signupWithEmailPassword, logInWithEmailPassword, logInWithPopup, passwordResetEmail, updateUserProfile, userLogOut, loading, setLoading}}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthProvider;