'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './Register.module.css';

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function RegisterPage() {
  const router = useRouter();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.registerSection}>
      <div className={styles.registerContainer}>
        <h1 className={styles.heading}>Girl Hype Register</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" {...formRegister('fullName')} />
            {errors.fullName && <p>{errors.fullName.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" {...formRegister('email')} />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" {...formRegister('password')} />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
