'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import styles from './Login.module.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [backendError, setBackendError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setBackendError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      router.push('/dashboard');
    } catch (err) {
      setBackendError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Girl Hype Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              {...register('email')}
              className={styles.inputField}
            />
            {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={styles.inputField}
                onChange={(e) => {
                  register('password').onChange(e);
                  const hasValue = e.target.value.length > 0;

                  if (hasValue && !showPasswordIcon) {
                    setFadeOut(false);
                    setShowPasswordIcon(true);
                  } else if (!hasValue && showPasswordIcon) {
                    setFadeOut(true);
                    setTimeout(() => {
                      setShowPasswordIcon(false);
                      setFadeOut(false);
                    }, 200);
                  }
                }}
              />

              {showPasswordIcon && (
                <button
                  type="button"
                  className={`${styles.showHideButton} ${fadeOut ? styles.fadeOut : styles.fadeIn}`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              )}
            </div>

            {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
          </div>

          {backendError && <p className={styles.errorMessage}>{backendError}</p>}

          <button type="submit" className={styles.loginButton} disabled={isSubmitting || !isValid}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className={styles.loginFooter}>
          Don’t have an account?{' '}
          <a href="/register" className={styles.link}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
