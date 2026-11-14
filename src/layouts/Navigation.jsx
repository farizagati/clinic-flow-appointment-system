import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [{ key: 'home', to: '/', label: 'Home' }];
  if (currentUser?.role === 'member') {
    links.push({ key: 'book-appointment', to: '/book-appointment', label: 'Book Appointment' });
    links.push({ key: 'my-appointments', to: '/my-appointments', label: 'My Appointments' });
  }
  if (currentUser?.role === 'admin') {
    links.push({ key: 'admin-dashboard', to: '/admin-dashboard', label: 'Admin Dashboard' });
  }

  return (
    <nav id="app-navigation" data-testid="app-navigation" className="bg-surface dark:bg-inverse-surface shadow-sm dark:bg-surface-container-low sticky top-0 z-50 flex items-center justify-between px-lg py-sm w-full max-w-container-max mx-auto docked full-width">
      <div className="flex items-center gap-md">
        <Link to="/" id="nav-brand" data-testid="nav-brand" className="font-headline-sm text-headline-sm font-bold text-primary dark:text-inverse-primary tracking-tight">
          ClinicFlow
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-lg">
        {links.map((link) => (
          <Link key={link.key} to={link.to} id={`nav-${link.key}`} data-testid={`nav-${link.key}`} className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md">
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-sm">
        <button
          onClick={toggleTheme}
          data-testid="nav-theme-toggle"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="p-sm text-secondary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined" aria-hidden="true">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
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

        <button
          onClick={() => setMenuOpen((open) => !open)}
          data-testid="nav-menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          className="md:hidden p-sm text-secondary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {menuOpen && (
        <div id="nav-mobile-menu" data-testid="nav-mobile-menu" className="md:hidden absolute top-full left-0 right-0 bg-surface dark:bg-surface-container-low border-t border-outline-variant shadow-md flex flex-col p-sm">
          {links.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              data-testid={`nav-mobile-${link.key}`}
              onClick={() => setMenuOpen(false)}
              className="px-md py-sm rounded-lg text-on-surface hover:bg-surface-variant transition-colors font-body-md text-body-md"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
