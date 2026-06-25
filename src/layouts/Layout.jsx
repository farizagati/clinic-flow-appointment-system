import React from 'react';
import { Outlet } from 'react-router-dom';
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
          <a className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" href="#">Contact Support</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
}
