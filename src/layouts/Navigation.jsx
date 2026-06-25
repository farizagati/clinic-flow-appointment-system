import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav id="app-navigation" data-testid="app-navigation" className="bg-surface dark:bg-inverse-surface shadow-sm dark:bg-surface-container-low sticky top-0 z-50 flex items-center justify-between px-lg py-sm w-full max-w-container-max mx-auto docked full-width">
      <div className="flex items-center gap-md">
        <Link to="/" id="nav-brand" data-testid="nav-brand" className="font-headline-sm text-headline-sm font-bold text-primary dark:text-inverse-primary tracking-tight">
          ClinicFlow
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-lg">
        <Link to="/" id="nav-home" data-testid="nav-home" className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md">
          Home
        </Link>

        {currentUser && currentUser.role === 'member' && (
          <>
            <Link to="/book-appointment" id="nav-book-appointment" data-testid="nav-book-appointment" className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md">
              Book Appointment
            </Link>
            <Link to="/my-appointments" id="nav-my-appointments" data-testid="nav-my-appointments" className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md">
              My Appointments
            </Link>
          </>
        )}

        {currentUser && currentUser.role === 'admin' && (
          <Link to="/admin-dashboard" id="nav-admin-dashboard" data-testid="nav-admin-dashboard" className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md">
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-sm">
        <button onClick={toggleTheme} className="p-sm text-secondary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {!currentUser ? (
          <>
            <Link to="/login" id="nav-login" data-testid="nav-login" className="px-md py-sm font-label-md text-label-md text-secondary hover:bg-surface-container-high rounded-lg transition-colors active:scale-95 duration-200 inline-block text-center">
              Login
            </Link>
            <Link to="/register" id="nav-register" data-testid="nav-register" className="px-md py-sm font-label-md text-label-md bg-primary text-on-primary rounded-lg hover:bg-surface-tint shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] transition-all active:scale-95 duration-200 inline-block text-center">
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-md">
            <span id="nav-user-profile" data-testid="nav-user-profile" className="font-label-sm text-label-sm text-on-surface-variant hidden md:inline">
              {currentUser.name} ({currentUser.role})
            </span>
            <Link to="/settings" id="nav-settings" data-testid="nav-settings" className="p-xs text-secondary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <button id="nav-logout" data-testid="nav-logout" onClick={handleLogout} className="px-md py-sm font-label-md text-label-md bg-error text-on-error rounded-lg hover:bg-error-container hover:text-on-error-container shadow-[0px_4px_12px_rgba(0,0,0,0.08)] transition-all active:scale-95 duration-200 inline-block text-center">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
