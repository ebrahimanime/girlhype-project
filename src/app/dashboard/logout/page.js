'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear user data (example)
    localStorage.removeItem('girlhype_isAuthenticated');
    localStorage.removeItem('girlhype_user');
    router.push('/login'); // Redirect to login page
  }, [router]);

  return <p>Logging out...</p>;
}
