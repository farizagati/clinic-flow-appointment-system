import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div id="app-layout" data-testid="app-layout" className="flex flex-col min-h-screen">
      <header id="layout-header" data-testid="layout-header">
        <Navigation />
      </header>
      
      <main id="layout-main" data-testid="layout-main" className="flex-grow">
        <Outlet />
      </main>
      
      <footer id="layout-footer" data-testid="layout-footer" className="bg-surface-container dark:bg-surface-container-highest w-full py-xl px-lg mt-auto flex flex-col md:flex-row justify-between items-center gap-md border-t border-outline-variant dark:border-outline">
        <div className="font-label-md text-label-md font-bold text-on-surface dark:text-on-surface-variant">
          <span id="footer-text" data-testid="footer-text">
            © 2026 ClinicFlow Management Systems. All rights reserved.
          </span>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-md">
          <Link data-testid="footer-privacy-link" className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/privacy-policy">Privacy Policy</Link>
          <Link data-testid="footer-terms-link" className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/terms-of-service">Terms of Service</Link>
          <Link data-testid="footer-support-link" className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/contact-support">Contact Support</Link>
          <Link data-testid="footer-help-link" className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/help-center">Help Center</Link>
        </div>
      </footer>
    </div>
  );
}
