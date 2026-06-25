import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FieldError } from '../components/FieldError';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // top-level server/auth error
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = { email: '', password: '' };
    let valid = true;

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
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      const user = login(email, password);
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/my-appointments');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  // Clear per-field error as the user corrects the value
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
  };

  return (
    <div id="login-page" data-testid="login-page" className="flex-grow flex flex-col w-full h-full">
      <main className="flex-grow flex items-center justify-center p-md md:p-lg w-full">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-xl">
            <h1 id="login-title" data-testid="login-title" className="font-headline-lg text-headline-lg text-primary md:font-headline-lg md:text-headline-lg font-headline-lg-mobile text-headline-lg-mobile mb-sm">
              ClinicFlow
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Secure access to your healthcare portal.</p>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-xl mb-lg border border-surface-variant">
            {error && (
              <div id="login-error" data-testid="login-error" className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-sm">
                {error}
              </div>
            )}
            
            <form id="login-form" data-testid="login-form" onSubmit={handleSubmit} noValidate className="space-y-lg">
              {/* Email */}
              <div>
                <div className="relative group input-focus-ring rounded-lg transition-shadow duration-200">
                  <input
                    type="email"
                    id="login-email"
                    data-testid="login-email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="johnyjohnyyespapa@mail.com"
                    className={`form-input block w-full rounded-lg border bg-transparent px-md py-md text-on-surface focus:outline-none focus:ring-0 peer placeholder-transparent transition-colors ${
                      fieldErrors.email ? 'input-error' : 'border-outline-variant focus:border-primary'
                    }`}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                  />
                  <label htmlFor="login-email" className="absolute left-md top-md font-body-md text-body-md text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:text-primary">
                    Email Address
                  </label>
                </div>
                <FieldError message={fieldErrors.email} fieldId="login-email" />
              </div>

              {/* Password */}
              <div>
                <div className="relative group input-focus-ring rounded-lg transition-shadow duration-200">
                  <input
                    type="password"
                    id="login-password"
                    data-testid="login-password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className={`form-input block w-full rounded-lg border bg-transparent px-md py-md text-on-surface focus:outline-none focus:ring-0 peer placeholder-transparent transition-colors ${
                      fieldErrors.password ? 'input-error' : 'border-outline-variant focus:border-primary'
                    }`}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                  />
                  <label htmlFor="login-password" className="absolute left-md top-md font-body-md text-body-md text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:text-primary">
                    Password
                  </label>
                </div>
                <FieldError message={fieldErrors.password} fieldId="login-password" />
              </div>

              <button 
                type="submit" 
                id="login-submit" 
                data-testid="login-submit"
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-md px-lg rounded-lg hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest transition-colors shadow-sm active:scale-[0.98]"
              >
                Log In
              </button>
            </form>
            
            <div id="login-footer" data-testid="login-footer" className="mt-lg text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/register" id="login-register-link" data-testid="login-register-link" className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors">
                  Register Here
                </Link>
              </p>
            </div>
          </div>
          
          {/* Test Credentials Box */}
          <div className="bg-surface-container-low rounded-lg p-md border border-surface-variant">
            <div className="flex items-center gap-sm mb-sm text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>info</span>
              <h3 className="font-label-md text-label-md">Test Credentials</h3>
            </div>
            <div className="overflow-x-auto rounded border border-outline-variant">
              <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                <thead className="bg-surface-container-high text-on-surface-variant">
                  <tr>
                    <th className="px-md py-sm font-semibold border-b border-outline-variant whitespace-nowrap">Role</th>
                    <th className="px-md py-sm font-semibold border-b border-outline-variant whitespace-nowrap">Email</th>
                    <th className="px-md py-sm font-semibold border-b border-outline-variant whitespace-nowrap">Password</th>
                  </tr>
                </thead>
                <tbody className="bg-surface-container-lowest text-on-surface-variant">
                  <tr className="border-b border-outline-variant">
                    <td className="px-md py-sm font-bold text-on-surface whitespace-nowrap">Member</td>
                    <td className="px-md py-sm whitespace-nowrap">johnyjohnyyespapa@mail.com</td>
                    <td className="px-md py-sm text-label-sm whitespace-nowrap">EatingSugarNoPapa</td>
                  </tr>
                  <tr className="border-b border-outline-variant last:border-0">
                    <td className="px-md py-sm font-bold text-on-surface whitespace-nowrap">Admin</td>
                    <td className="px-md py-sm whitespace-nowrap">admin@example.com</td>
                    <td className="px-md py-sm text-label-sm whitespace-nowrap">ThisIsNotAdmin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
