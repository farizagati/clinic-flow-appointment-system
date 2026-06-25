import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserSettings() {
  const { currentUser, users, updateUserSettings, purgeAndResetData } = useAuth();

  // Mode state: 'view', 'edit', 'password'
  const [viewMode, setViewMode] = useState('view');

  // Edit Profile States
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editGender, setEditGender] = useState(currentUser?.gender || 'Female');
  const [editDob, setEditDob] = useState(currentUser?.dob || '12 October 1985');
  const [editBloodType, setEditBloodType] = useState(currentUser?.bloodType || 'O Negative');
  const [editAddress, setEditAddress] = useState(currentUser?.address || '482 Clinical Heights Parkway, Suite 300, San Francisco, CA 94107');
  const [editEmergencyName, setEditEmergencyName] = useState(currentUser?.emergencyName || 'Robert Sterling (Spouse)');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(currentUser?.emergencyPhone || '+1 (555) 987-6543');

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // General Alert States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // File upload Ref
  const fileInputRef = useRef(null);

  // Date of birth Ref
  const dobInputRef = useRef(null);

  // Helper to convert date string "12 October 1985" to ISO format "1985-10-12"
  const formatDateToISO = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper to convert ISO format "1985-10-12" to display string "12 October 1985"
  const formatDateToDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleCalendarClick = () => {
    if (dobInputRef.current) {
      if (typeof dobInputRef.current.showPicker === 'function') {
        dobInputRef.current.showPicker();
      } else {
        dobInputRef.current.focus();
      }
    }
  };

  const startEditing = () => {
    setEditName(currentUser?.name || '');
    setEditGender(currentUser?.gender || 'Female');
    setEditDob(currentUser?.dob || '12 October 1985');
    setEditBloodType(currentUser?.bloodType || 'O Negative');
    setEditAddress(currentUser?.address || '482 Clinical Heights Parkway, Suite 300, San Francisco, CA 94107');
    setEditEmergencyName(currentUser?.emergencyName || 'Robert Sterling (Spouse)');
    setEditEmergencyPhone(currentUser?.emergencyPhone || '+1 (555) 987-6543');
    setError('');
    setSuccess('');
    setViewMode('edit');
  };

  const cancelEditing = () => {
    setError('');
    setViewMode('view');
  };

  const startChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    setSuccess('');
    setViewMode('password');
  };

  const cancelChangePassword = () => {
    setError('');
    setViewMode('view');
  };

  const handleEditProfileSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!editName.trim()) {
      setError('Name field cannot be empty');
      return;
    }
    if (!editDob.trim()) {
      setError('Date of Birth cannot be empty');
      return;
    }
    if (!editAddress.trim()) {
      setError('Primary Address cannot be empty');
      return;
    }
    if (!editEmergencyName.trim()) {
      setError('Emergency contact name/relation cannot be empty');
      return;
    }
    if (!editEmergencyPhone.trim()) {
      setError('Emergency contact phone cannot be empty');
      return;
    }

    try {
      updateUserSettings(editName, null, {
        gender: editGender,
        dob: editDob,
        bloodType: editBloodType,
        address: editAddress,
        emergencyName: editEmergencyName,
        emergencyPhone: editEmergencyPhone,
      });
      setSuccess('Profile updated successfully!');
      setViewMode('view');
    } catch (err) {
      setError(err.message || 'Failed to update profile settings');
    }
  };

  const handleChangePasswordSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    // Verify current password against stored database user record
    const dbUser = users.find((u) => u.id === currentUser?.id);
    if (!dbUser || dbUser.password !== currentPassword) {
      setError('Current password is incorrect');
      return;
    }

    try {
      updateUserSettings(currentUser.name, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setViewMode('view');
    } catch (err) {
      setError(err.message || 'Failed to change password');
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

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      try {
        updateUserSettings(currentUser.name, null, {
          profilePic: base64String,
        });
        setSuccess('Profile picture updated successfully!');
      } catch (err) {
        setError('Failed to upload profile picture');
      }
    };
    reader.readAsDataURL(file);
  };

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFwcd3R-nhKhYIDu4Kj64jLGymQ7hW_s4ZNtiVTOGsD4q2C2lCi6XN6ZtIteQO_W0kDu3h3e53TZcGvIXwOlhcVcVFbJ6OaVVEQwo_P00kYchJwx67X6DykgzucgTtFlNMA3y-glNZqE3mHHZEGheSGDcQRU65LdaxErnJsnTgHgB9COb4DLYGFuuDl2u6ScQ2ZBFuisHcQCqOZqmj1r83JkKSIfp9GcpYqhY3jbVJ2HizU9tpXz-jq3mNbIo7U3qpi7W6LyutgJDd';
  const profilePicUrl = currentUser?.profilePic || defaultAvatar;

  return (
    <div id="user-settings-page" data-testid="user-settings-page" className="flex-grow w-full max-w-container-max mx-auto px-md md:px-lg py-xl">
      {/* Header Section */}
      {viewMode !== 'password' && (
        <div className="mb-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-xs">
              {viewMode === 'edit' ? 'Edit Profile' : 'User Settings'}
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              {viewMode === 'edit'
                ? 'Update your personal information and clinical details.'
                : 'Manage your personal information and clinical profile preferences.'}
            </p>
          </div>
          {viewMode === 'edit' && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-testid="edit-profile-cancel-btn"
                onClick={cancelEditing}
                className="px-6 py-2 rounded-lg font-label-md text-label-md text-on-background bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="edit-profile-save-btn"
                onClick={handleEditProfileSubmit}
                className="px-6 py-2 rounded-lg font-label-md text-label-md text-on-primary bg-primary hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Global Alerts */}
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

      {/* View & Edit Profile Grid */}
      {viewMode !== 'password' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Left Column: Avatar Card */}
          <div className="md:col-span-1 flex flex-col gap-lg">
            <div className="bg-surface rounded-xl p-md w-full flex flex-col items-center shadow-sm border border-outline-variant/30 text-center">
              <div className="relative w-48 h-48 mb-lg rounded-full border-4 border-surface shadow-sm group overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    alt="User Profile"
                    className="object-cover w-full h-full"
                    src={profilePicUrl}
                  />
                </div>
                {viewMode === 'edit' && (
                  <div
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center text-white cursor-pointer transition-all hover:bg-black/60 z-20"
                  >
                    <span className="material-symbols-outlined text-3xl">photo_camera</span>
                    <span className="font-label-sm text-xs mt-1">Upload</span>
                  </div>
                )}
                {viewMode === 'edit' && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    data-testid="profile-pic-file-input"
                  />
                )}
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-xs">
                {viewMode === 'edit' ? editName : (currentUser?.name || 'Alexia Sterling')}
              </h2>
              <p className="font-body-sm text-body-sm text-secondary mb-xl">Patient ID: #CF-8829</p>
              
              {viewMode === 'view' && (
                <div className="w-full flex flex-col gap-sm">
                  <button
                    id="btn-edit-profile"
                    data-testid="edit-profile-btn"
                    onClick={startEditing}
                    className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-surface-tint transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] focus-ring-subtle flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit Profile
                  </button>
                  <button
                    id="btn-change-password"
                    data-testid="change-password-btn"
                    onClick={startChangePassword}
                    className="w-full bg-surface text-on-surface border border-outline-variant font-label-md text-label-md py-3 rounded-lg hover:bg-surface-variant transition-colors focus-ring-subtle flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">lock_reset</span>
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Display or Edit Form */}
          <div className="md:col-span-2">
            {viewMode === 'view' ? (
              // Read-only Details View
              <div className="flex flex-col gap-lg">
                <section className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                  <div className="px-lg py-md border-b border-outline-variant/30 bg-surface-container-low/50">
                    <h3 className="font-headline-sm text-headline-sm text-on-background">Personal Information</h3>
                  </div>
                  <div className="p-lg grid grid-cols-1 sm:grid-cols-2 gap-lg">
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Full Name</span>
                      <div data-testid="settings-display-name" className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50">
                        {currentUser?.name || 'Alexia Jane Sterling'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Gender</span>
                      <div data-testid="settings-display-gender" className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50">
                        {currentUser?.gender || 'Female'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Date of Birth</span>
                      <div data-testid="settings-display-dob" className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50">
                        {currentUser?.dob || '12 October 1985'}
                      </div>
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
                      <div data-testid="settings-display-blood-type" className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary-container text-sm">bloodtype</span>
                        {currentUser?.bloodType || 'O Negative'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs sm:col-span-2">
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Primary Address</span>
                      <div data-testid="settings-display-address" className="font-body-md text-body-md text-on-surface pb-2 border-b border-outline-variant/50 flex items-start gap-2 whitespace-pre-line">
                        <span className="material-symbols-outlined text-secondary text-sm mt-1">location_on</span>
                        <span>{currentUser?.address || '482 Clinical Heights Parkway, Suite 300\nSan Francisco, CA 94107'}</span>
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
                        <span data-testid="settings-display-emergency-name" className="block font-medium">
                          {currentUser?.emergencyName || 'Robert Sterling (Spouse)'}
                        </span>
                        <span data-testid="settings-display-emergency-phone" className="text-secondary text-sm">
                          {currentUser?.emergencyPhone || '+1 (555) 987-6543'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-lg py-md bg-surface-container-low/30 border-t border-outline-variant/30 flex justify-end">
                    <button
                      id="btn-download-records"
                      data-testid="download-records-btn"
                      className="bg-surface text-primary border border-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container/10 transition-colors focus-ring-subtle flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>Download Medical Records
                    </button>
                  </div>
                </section>

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
            ) : (
              // Edit Profile Form View
              <form
                data-testid="edit-profile-form"
                onSubmit={handleEditProfileSubmit}
                className="flex flex-col gap-lg"
              >
                {/* Personal Information Section */}
                <div className="bg-surface rounded-xl p-lg shadow-sm border border-outline-variant/30">
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-md flex items-center gap-2 border-b border-outline-variant pb-3">
                    <span className="material-symbols-outlined text-primary">person</span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm">
                    {/* Full Name */}
                    <div className="col-span-1 md:col-span-2 relative group">
                      <label className="absolute left-3 -top-2.5 bg-surface px-1 font-label-sm text-label-sm text-primary transition-all duration-200 z-10" htmlFor="fullName">Full Name</label>
                      <input
                        className="w-full px-4 py-3 bg-transparent border border-primary rounded-lg font-body-md text-body-md text-on-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 transition-shadow"
                        id="fullName"
                        data-testid="edit-profile-name-input"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    {/* Date of Birth */}
                    <div className="relative group">
                      <label className="absolute left-3 -top-2.5 bg-surface px-1 font-label-sm text-label-sm text-secondary group-focus-within:text-primary transition-all duration-200 z-10" htmlFor="dob">Date of Birth</label>
                      <div className="relative">
                        <input
                          className="w-full pl-4 pr-10 py-3 bg-transparent border border-outline hover:border-outline-variant rounded-lg font-body-md text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 transition-shadow [color-scheme:light] dark:[color-scheme:dark]"
                          id="dob"
                          ref={dobInputRef}
                          data-testid="edit-profile-dob-input"
                          type="date"
                          value={formatDateToISO(editDob)}
                          onChange={(e) => setEditDob(formatDateToDisplay(e.target.value))}
                        />
                        <span
                          onClick={handleCalendarClick}
                          className="material-symbols-outlined absolute right-3 top-3.5 text-secondary cursor-pointer hover:text-primary transition-colors"
                        >
                          calendar_today
                        </span>
                      </div>
                    </div>
                    {/* Gender */}
                    <div className="relative group">
                      <label className="absolute left-3 -top-2.5 bg-surface px-1 font-label-sm text-label-sm text-secondary group-focus-within:text-primary transition-all duration-200 z-10" htmlFor="gender">Gender</label>
                      <select
                        className="w-full px-4 py-3 bg-surface border border-outline hover:border-outline-variant rounded-lg font-body-md text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 transition-shadow appearance-none"
                        id="gender"
                        data-testid="edit-profile-gender-select"
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-secondary pointer-events-none">arrow_drop_down</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Details & Contact Section */}
                <div className="bg-surface rounded-xl p-lg shadow-sm border border-outline-variant/30">
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-md flex items-center gap-2 border-b border-outline-variant pb-3">
                    <span className="material-symbols-outlined text-primary">medical_information</span>
                    Clinical & Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm">
                    {/* Blood Type */}
                    <div className="relative group">
                      <label className="absolute left-3 -top-2.5 bg-surface px-1 font-label-sm text-label-sm text-secondary group-focus-within:text-primary transition-all duration-200 z-10" htmlFor="bloodType">Blood Type</label>
                      <select
                        className="w-full px-4 py-3 bg-surface border border-outline hover:border-outline-variant rounded-lg font-body-md text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 transition-shadow appearance-none"
                        id="bloodType"
                        data-testid="edit-profile-blood-type-select"
                        value={editBloodType}
                        onChange={(e) => setEditBloodType(e.target.value)}
                      >
                        <option value="O Negative">O Negative</option>
                        <option value="O Positive">O Positive</option>
                        <option value="A Negative">A Negative</option>
                        <option value="A Positive">A Positive</option>
                        <option value="B Negative">B Negative</option>
                        <option value="B Positive">B Positive</option>
                        <option value="AB Negative">AB Negative</option>
                        <option value="AB Positive">AB Positive</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-secondary pointer-events-none">arrow_drop_down</span>
                    </div>
                    {/* Primary Address */}
                    <div className="col-span-1 md:col-span-2 relative group mt-2">
                      <label className="absolute left-3 -top-2.5 bg-surface px-1 font-label-sm text-label-sm text-secondary group-focus-within:text-primary transition-all duration-200 z-10" htmlFor="address">Primary Address</label>
                      <textarea
                        className="w-full px-4 py-3 bg-transparent border border-outline hover:border-outline-variant rounded-lg font-body-md text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 transition-shadow resize-none"
                        id="address"
                        data-testid="edit-profile-address-textarea"
                        rows="2"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="bg-surface rounded-xl p-lg shadow-sm border border-outline-variant/30">
                  <h3 className="font-headline-sm text-headline-sm text-on-background mb-md flex items-center gap-2 border-b border-outline-variant pb-3">
                    <span className="material-symbols-outlined text-primary">contact_emergency</span>
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm">
                    {/* Emergency Contact Name */}
                    <div className="relative group">
                      <label className="absolute left-3 -top-2.5 bg-surface px-1 font-label-sm text-label-sm text-secondary group-focus-within:text-primary transition-all duration-200 z-10" htmlFor="emergencyName">Contact Name & Relation</label>
                      <input
                        className="w-full px-4 py-3 bg-transparent border border-outline hover:border-outline-variant rounded-lg font-body-md text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 transition-shadow"
                        id="emergencyName"
                        data-testid="edit-profile-emergency-name-input"
                        type="text"
                        value={editEmergencyName}
                        onChange={(e) => setEditEmergencyName(e.target.value)}
                      />
                    </div>
                    {/* Emergency Contact Phone */}
                    <div className="relative group">
                      <label className="absolute left-3 -top-2.5 bg-surface px-1 font-label-sm text-label-sm text-secondary group-focus-within:text-primary transition-all duration-200 z-10" htmlFor="emergencyPhone">Phone Number</label>
                      <div className="relative">
                        <input
                          className="w-full pl-4 pr-10 py-3 bg-transparent border border-outline hover:border-outline-variant rounded-lg font-body-md text-body-md text-on-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-40 transition-shadow"
                          id="emergencyPhone"
                          data-testid="edit-profile-emergency-phone-input"
                          type="tel"
                          value={editEmergencyPhone}
                          onChange={(e) => setEditEmergencyPhone(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute right-3 top-3.5 text-secondary pointer-events-none">phone</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Change Password Centered Card View */}
      {viewMode === 'password' && (
        <div className="w-full max-w-md mx-auto py-xl">
          {/* Back to Settings Link */}
          <div className="mb-lg">
            <button
              type="button"
              data-testid="change-password-back-btn"
              onClick={cancelChangePassword}
              className="inline-flex items-center gap-xs text-secondary hover:text-primary transition-colors mb-sm font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Settings
            </button>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-xs">
              Change Password
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              Ensure your account is secure by using a strong password.
            </p>
          </div>

          {/* Change Password Form Card */}
          <div className="bg-surface rounded-lg shadow-sm p-lg border border-outline-variant/30">
            <form
              data-testid="change-password-form"
              onSubmit={handleChangePasswordSubmit}
              className="space-y-lg"
            >
              {/* Current Password */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="currentPassword">
                  Current Password
                </label>
                <div className="relative rounded border border-outline-variant bg-surface transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-40 focus-within:border-primary">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">lock</span>
                  <input
                    className="w-full pl-10 pr-3 py-3 bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder-secondary-fixed-dim"
                    id="currentPassword"
                    data-testid="change-password-current-input"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-outline-variant/30 my-md"></div>

              {/* New Password */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="newPassword">
                  New Password
                </label>
                <div className="relative rounded border border-outline-variant bg-surface transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-40 focus-within:border-primary">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">key</span>
                  <input
                    className="w-full pl-10 pr-3 py-3 bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder-secondary-fixed-dim"
                    id="newPassword"
                    data-testid="change-password-new-input"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="relative rounded border border-outline-variant bg-surface transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-40 focus-within:border-primary">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">password</span>
                  <input
                    className="w-full pl-10 pr-3 py-3 bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder-secondary-fixed-dim"
                    id="confirmPassword"
                    data-testid="change-password-confirm-input"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-md pt-sm">
                <button
                  type="button"
                  data-testid="change-password-cancel-btn"
                  onClick={cancelChangePassword}
                  className="px-6 py-2.5 font-label-md text-label-md text-on-surface bg-surface-container hover:bg-surface-container-high rounded transition-colors duration-200 text-center focus:ring-2 focus:ring-primary focus:ring-opacity-40 outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="change-password-submit-btn"
                  className="px-6 py-2.5 font-label-md text-label-md text-on-primary bg-primary hover:bg-surface-tint rounded shadow-[0px_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 text-center focus:ring-2 focus:ring-primary focus:ring-opacity-40 outline-none"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
