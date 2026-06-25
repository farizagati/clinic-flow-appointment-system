import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FieldError } from '../components/FieldError';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState(''); // top-level server/auth error
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '' };
    let valid = true;

    if (!name.trim()) {
      errors.name = 'Full name is required';
      valid = false;
    }
    if (!email.trim()) {
      errors.email = 'Email address is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }
    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      valid = false;
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (password && confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    try {
      register(email, name, password, role);
      setSuccess('Registration successful! You can now log in.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  // Clear per-field error when user starts correcting
  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div id="register-page" data-testid="register-page" className="flex-grow flex flex-col w-full h-full">
      <main className="flex-grow flex items-center justify-center p-md md:p-lg w-full">
        <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-xl overflow-hidden relative z-10 border border-surface-variant mx-auto">
          <div className="text-center mb-xl">
            <h1 id="register-title" data-testid="register-title" className="font-headline-lg text-headline-lg mb-sm text-on-surface">
              ClinicFlow
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Create your account to streamline healthcare management.</p>
          </div>

          {error && (
            <div id="register-error" data-testid="register-error" className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-sm">
              {error}
            </div>
          )}

          {success && (
            <div id="register-success" data-testid="register-success" className="mb-md p-sm bg-primary-container/20 text-on-primary-container rounded-lg font-body-sm">
              {success}
            </div>
          )}

          <form id="register-form" data-testid="register-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-lg">
            {/* Full Name */}
            <div>
              <div className="relative group input-focus-ring rounded-lg transition-shadow duration-200">
                <input
                  type="text"
                  id="register-name"
                  data-testid="register-name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                  placeholder="John Doe"
                  className={`form-input block w-full rounded-lg border bg-transparent px-md py-md text-on-surface focus:outline-none focus:ring-0 peer placeholder-transparent transition-colors ${
                    fieldErrors.name ? 'input-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'register-name-error' : undefined}
                />
                <label htmlFor="register-name" className="absolute left-md top-md font-body-md text-body-md text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:text-primary">
                  Full Name
                </label>
              </div>
              <FieldError message={fieldErrors.name} fieldId="register-name" />
            </div>

            {/* Email */}
            <div>
              <div className="relative group input-focus-ring rounded-lg transition-shadow duration-200">
                <input
                  type="email"
                  id="register-email"
                  data-testid="register-email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                  placeholder="john@example.com"
                  className={`form-input block w-full rounded-lg border bg-transparent px-md py-md text-on-surface focus:outline-none focus:ring-0 peer placeholder-transparent transition-colors ${
                    fieldErrors.email ? 'input-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
                />
                <label htmlFor="register-email" className="absolute left-md top-md font-body-md text-body-md text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:text-primary">
                  Email Address
                </label>
              </div>
              <FieldError message={fieldErrors.email} fieldId="register-email" />
            </div>

            {/* Password */}
            <div>
              <div className="relative group input-focus-ring rounded-lg transition-shadow duration-200">
                <input
                  type="password"
                  id="register-password"
                  data-testid="register-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                  placeholder="••••••••"
                  className={`form-input block w-full rounded-lg border bg-transparent px-md py-md text-on-surface focus:outline-none focus:ring-0 peer placeholder-transparent transition-colors ${
                    fieldErrors.password ? 'input-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
                />
                <label htmlFor="register-password" className="absolute left-md top-md font-body-md text-body-md text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:text-primary">
                  Password
                </label>
              </div>
              <FieldError message={fieldErrors.password} fieldId="register-password" />
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative group input-focus-ring rounded-lg transition-shadow duration-200">
                <input
                  type="password"
                  id="register-confirm-password"
                  data-testid="register-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
                  placeholder="••••••••"
                  className={`form-input block w-full rounded-lg border bg-transparent px-md py-md text-on-surface focus:outline-none focus:ring-0 peer placeholder-transparent transition-colors ${
                    fieldErrors.confirmPassword ? 'input-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? 'register-confirm-password-error' : undefined}
                />
                <label htmlFor="register-confirm-password" className="absolute left-md top-md font-body-md text-body-md text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:text-primary">
                  Confirm Password
                </label>
              </div>
              <FieldError message={fieldErrors.confirmPassword} fieldId="register-confirm-password" />
            </div>

            {/* Account Role */}
            <div className="flex flex-col gap-xs">
              <label htmlFor="register-role" className="font-label-md text-label-md text-on-surface-variant">Account Role</label>
              <select
                id="register-role"
                data-testid="register-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-transparent px-md py-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button 
              type="submit" 
              id="register-submit" 
              data-testid="register-submit"
              className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] hover:bg-surface-tint transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 flex items-center justify-center active:scale-[0.98]"
            >
              Create Account
            </button>

            <div id="register-footer" data-testid="register-footer" className="text-center mt-sm">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Already have an account?{' '}
                <Link to="/login" id="register-login-link" data-testid="register-login-link" className="text-primary font-label-md text-label-md hover:underline hover:text-primary-fixed-dim transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
