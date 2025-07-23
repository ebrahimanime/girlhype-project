'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../../firebase/config';
// import { useAuth } from '@/components/AuthProvider';

import styles from './Login.module.css'; // ✅ import CSS module

export default function LoginPage() {
  const router = useRouter();
  // const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // useEffect(() => {
  //   if (user) {
  //     router.push('/home');
  //   }
  // }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Girl Hype Login</h1>

        <form onSubmit={handleLogin}>
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <button type="submit" className={styles.loginButton}>Log In</button>
        </form>

        <p className={styles.loginFooter}>
          Don’t have an account?{' '}
          <a href="/register" className={styles.link}>Register</a>
        </p>
      </div>
    </div>
  );
}
        