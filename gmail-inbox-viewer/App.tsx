import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from './types';
import { MailboxScreen } from './components/MailboxScreen';
import { LoginScreen } from './components/LoginScreen';
import { authService } from './services/authService';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    try {
      setError(null);
      const { profile, accessToken: token } = await authService.signIn();
      setUserProfile(profile);
      setAccessToken(token);
    } catch (err) {
        const error = err as Error;
        console.error("Authentication Error:", error.message);
        setError(`Failed to sign in. Please check console for details.`);
        setAccessToken(null);
        setUserProfile(null);
    }
  }, []);
  
  const handleSignOut = useCallback(() => {
    if (accessToken) {
        authService.signOut(accessToken);
    }
    setAccessToken(null);
    setUserProfile(null);
  }, [accessToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.initClient();
        setIsAuthReady(true);
      } catch (err) {
        const error = err as Error;
        console.error("Auth initialization error:", error);
        setError(`Could not initialize authentication: ${error.message}`);
        setIsAuthReady(true);
      }
    };
    initializeAuth();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg">
        <Spinner />
      </div>
    );
  }

  const isAuthenticated = !!(accessToken && userProfile);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary font-sans">
      {isAuthenticated && userProfile ? (
        <MailboxScreen user={userProfile} accessToken={accessToken} onSignOut={handleSignOut} />
      ) : (
        <LoginScreen onSignIn={handleSignIn} error={error} />
      )}
    </div>
  );
};

export default App;
