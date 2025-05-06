'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/loading-screen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Only perform the auth check after the AuthContext has finished loading
    if (!loading) {
      console.log(
        'ProtectedRoute: Auth loading complete, authenticated:',
        isAuthenticated
      );

      if (!isAuthenticated) {
        console.log('ProtectedRoute: Not authenticated, redirecting to login');
        router.push('/login');
      } else {
        console.log('ProtectedRoute: User is authenticated');
      }

      // Mark that we've checked authentication status
      setHasCheckedAuth(true);
    }
  }, [isAuthenticated, loading, router]);

  // While auth is loading or we haven't completed our check, show loading screen
  if (loading || (!hasCheckedAuth && !isAuthenticated)) {
    console.log('ProtectedRoute: Showing loading screen');
    return <LoadingScreen finishLoading={() => {}} />;
  }

  // If auth check is complete and user is authenticated, show the content
  // Otherwise return null (the redirect will happen from the useEffect)
  return isAuthenticated ? <>{children}</> : null;
}
