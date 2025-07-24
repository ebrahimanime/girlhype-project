'use client';
import React from 'react';
import styles from './register.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.registerSection}>
      <div className={styles.registerContainer}>
        <h1 className={styles.heading}>GirlHype</h1>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" placeholder="you@example.com" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Choose a username" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Your full name" required />
          </div>

          
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
