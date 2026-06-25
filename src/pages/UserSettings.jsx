import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserSettings() {
  const { currentUser, updateUserSettings, purgeAndResetData } = useAuth();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Name field cannot be empty');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      updateUserSettings(name, password || null);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    }
  };

  const handlePurge = () => {
    setError('');
    setSuccess('');
    try {
      purgeAndResetData();
      setSuccess('All data cleared and reset to defaults successfully!');
      setTimeout(() => {
        window.location.hash = '/login';
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to purge data');
    }
  };

  return (
    <div id="user-settings-page" data-testid="user-settings-page" className="flex-grow w-full max-w-container-max mx-auto px-md md:px-lg py-xl">
      <div className="mb-xl">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-xs">User Settings</h1>
        <p className="font-body-md text-body-md text-secondary">Manage your personal information and clinical profile preferences.</p>
      </div>
      
      {error && (
        <div id="settings-error" data-testid="settings-error" className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-sm">
          {error}
        </div>
      )}

      {success && (
        <div id="settings-success" data-testid="settings-success" className="mb-md p-sm bg-primary-container/20 text-on-primary-container rounded-lg font-body-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Left Column: Profile Avatar & Actions */}
        <div className="md:col-span-1 flex flex-col gap-lg">
          <div className="bg-surface rounded-xl p-md w-full flex flex-col items-center shadow-sm border border-outline-variant/30 text-center">
            <div className="relative w-48 h-48 mb-lg rounded-full border-4 border-surface shadow-sm">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  alt="User Profile Picture" 
                  className="object-cover w-full h-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFwcd3R-nhKhYIDu4Kj64jLGymQ7hW_s4ZNtiVTOGsD4q2C2lCi6XN6ZtIteQO_W0kDu3h3e53TZcGvIXwOlhcVcVFbJ6OaVVEQwo_P00kYchJwx67X6DykgzucgTtFlNMA3y-glNZqE3mHHZEGheSGDcQRU65LdaxErnJsnTgHgB9COb4DLYGFuuDl2u6ScQ2ZBFuisHcQCqOZqmj1r83JkKSIfp9GcpYqhY3jbVJ2HizU9tpXz-jq3mNbIo7U3qpi7W6LyutgJDd" 
                />
              </div>
              <button aria-label="Upload new picture" className="absolute bottom-2 right-2 bg-surface text-primary p-2 rounded-full shadow-sm border border-outline-variant hover:bg-primary-container/10 transition-colors focus-ring-subtle z-10">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-xs">{currentUser?.name || 'Alexia Sterling'}</h2>
            <p className="font-body-sm text-body-sm text-secondary mb-xl">Patient ID: #CF-8829</p>
            <div className="w-full flex flex-col gap-sm">
              <button id="btn-edit-profile" data-testid="edit-profile-btn" className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-surface-tint transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] focus-ring-subtle flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Profile
              </button>
              <button id="btn-change-password" data-testid="change-password-btn" className="w-full bg-surface text-on-surface border border-outline-variant font-label-md text-label-md py-3 rounded-lg hover:bg-surface-variant transition-colors focus-ring-subtle flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">lock_reset</span>
                Change Password
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column: Details & Danger Zone */}
        <div className="md:col-span-2 flex flex-col gap-lg">
          {/* Clinical Profile Details */}
          <div className="flex flex-col gap-lg">
            <section className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant/30 bg-surface-container-low/50">
                <h3 className="font-headline-sm text-headline-sm text-on-background">Personal Information</h3>
              </div>
              <div className="p-lg grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Full Name</span>
                  <div className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50">{currentUser?.name || 'Alexia Jane Sterling'}</div>
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Gender</span>
                  <div className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50">Female</div>
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Date of Birth</span>
                  <div className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50">12 October 1985</div>
                </div>
              </div>
            </section>
            
            <section className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant/30 bg-surface-container-low/50">
                <h3 className="font-headline-sm text-headline-sm text-on-background">Clinical & Contact Details</h3>
              </div>
              <div className="p-lg grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Blood Type</span>
                  <div className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary-container text-sm">bloodtype</span>O Negative
                  </div>
                </div>
                <div className="flex flex-col gap-xs sm:col-span-2">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Primary Address</span>
                  <div className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50 flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm mt-1">location_on</span>
                    <span>482 Clinical Heights Parkway, Suite 300<br />San Francisco, CA 94107</span>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant/30 bg-surface-container-low/50">
                <h3 className="font-headline-sm text-headline-sm text-on-background">Emergency Contact</h3>
              </div>
              <div className="p-lg">
                <div className="flex flex-col gap-xs">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Primary Contact</span>
                  <div className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50">
                    <span className="block font-medium">Robert Sterling (Spouse)</span>
                    <span className="text-secondary text-sm">+1 (555) 987-6543</span>
                  </div>
                </div>
              </div>
              <div className="px-lg py-md bg-surface-container-low/30 border-t border-outline-variant/30 flex justify-end">
                <button id="btn-download-records" className="bg-surface text-primary border border-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container/10 transition-colors focus-ring-subtle flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">download</span>Download Medical Records
                </button>
              </div>
            </section>
          </div>
          
          {/* Danger Zone */}
          <section aria-labelledby="danger-zone-heading" className="bg-surface rounded-xl shadow-sm border border-error/40 overflow-hidden mt-md w-full">
            <div className="px-lg py-md border-b border-error/20 bg-error-container/20">
              <h3 id="danger-zone-heading" className="font-headline-sm text-headline-sm text-error flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                Danger Zone
              </h3>
            </div>
            <div className="p-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
              <div>
                <p className="font-body-md text-body-md text-on-surface font-medium">Purge Local Storage Data</p>
                <p className="font-body-sm text-body-sm text-secondary mt-1">This will clear all custom data (users, appointments, clinics, doctors) and reset the app back to mock defaults.</p>
              </div>
              <button 
                id="btn-purge-data" 
                data-testid="purge-data-btn" 
                onClick={handlePurge}
                className="shrink-0 bg-error text-on-error font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-error/90 transition-colors shadow-sm focus:ring-2 focus:ring-error focus:ring-offset-2 focus:outline-none flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                Purge Data
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
