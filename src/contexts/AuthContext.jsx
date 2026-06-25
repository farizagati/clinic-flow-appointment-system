import React, { createContext, useContext, useState, useEffect } from 'react';
import { CLINICS, DEPARTMENTS, DOCTORS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('clinicflow_currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('clinicflow_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const stored = localStorage.getItem('clinicflow_appointments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Seed default accounts and sync database user list
  useEffect(() => {
    const defaultUsers = [
      {
        id: 'user-member-default',
        email: 'johnyjohnyyespapa@mail.com',
        password: 'EatingSugarNoPapa',
        name: 'Johny Member',
        role: 'member',
        gender: 'Female',
        dob: '12 October 1985',
        bloodType: 'O Negative',
        address: '482 Clinical Heights Parkway, Suite 300, San Francisco, CA 94107',
        emergencyName: 'Robert Sterling (Spouse)',
        emergencyPhone: '+1 (555) 987-6543',
      },
      {
        id: 'user-admin-default',
        email: 'admin@example.com',
        password: 'ThisIsNotAdmin',
        name: 'System Admin',
        role: 'admin',
        gender: 'Male',
        dob: '01 January 1980',
        bloodType: 'AB Positive',
        address: 'ClinicFlow HQ, 100 Main Street, San Francisco, CA 94102',
        emergencyName: 'Jane Admin (Spouse)',
        emergencyPhone: '+1 (555) 123-4567',
      },
    ];

    try {
      const stored = localStorage.getItem('clinicflow_users');
      const parsed = stored ? JSON.parse(stored) : [];
      
      if (!parsed || parsed.length === 0) {
        localStorage.setItem('clinicflow_users', JSON.stringify(defaultUsers));
        setUsers(defaultUsers);
      } else {
        // Ensure default users exist in current list
        let updated = [...parsed];
        let changed = false;
        defaultUsers.forEach((defUser) => {
          if (!updated.some((u) => u.email.toLowerCase() === defUser.email.toLowerCase())) {
            updated.push(defUser);
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('clinicflow_users', JSON.stringify(updated));
          setUsers(updated);
        } else {
          setUsers(parsed);
        }
      }
    } catch {
      localStorage.setItem('clinicflow_users', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  // Sync users change
  const refreshUsersList = () => {
    try {
      const stored = localStorage.getItem('clinicflow_users');
      if (stored) {
        setUsers(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to sync users', e);
    }
  };

  const login = (email, password) => {
    // Read from localStorage to ensure we get registered users dynamically
    let latestUsers = users;
    try {
      const stored = localStorage.getItem('clinicflow_users');
      if (stored) {
        latestUsers = JSON.parse(stored);
      }
    } catch {}

    const foundUser = latestUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    const userSession = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      gender: foundUser.gender || 'Female',
      dob: foundUser.dob || '12 October 1985',
      bloodType: foundUser.bloodType || 'O Negative',
      address: foundUser.address || '482 Clinical Heights Parkway, Suite 300, San Francisco, CA 94107',
      emergencyName: foundUser.emergencyName || 'Robert Sterling (Spouse)',
      emergencyPhone: foundUser.emergencyPhone || '+1 (555) 987-6543',
      profilePic: foundUser.profilePic || null,
    };
    localStorage.setItem('clinicflow_currentUser', JSON.stringify(userSession));
    setCurrentUser(userSession);
    return userSession;
  };

  const register = (email, name, password, role = 'member') => {
    let latestUsers = users;
    try {
      const stored = localStorage.getItem('clinicflow_users');
      if (stored) {
        latestUsers = JSON.parse(stored);
      }
    } catch {}

    const emailExists = latestUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error('Email is already registered');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      name,
      password,
      role,
      gender: 'Female',
      dob: '12 October 1985',
      bloodType: 'O Negative',
      address: '482 Clinical Heights Parkway, Suite 300, San Francisco, CA 94107',
      emergencyName: 'Robert Sterling (Spouse)',
      emergencyPhone: '+1 (555) 987-6543',
      profilePic: null,
    };
    const updatedUsers = [...latestUsers, newUser];
    localStorage.setItem('clinicflow_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('clinicflow_currentUser');
    setCurrentUser(null);
  };

  const bookAppointment = (appointmentData) => {
    if (!currentUser) throw new Error('Authentication required');
    const newAppointment = {
      id: `apt-${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      doctor: appointmentData.doctor,
      department: appointmentData.department,
      clinic: appointmentData.clinic,
      date: appointmentData.date,
      time: appointmentData.time,
      notes: appointmentData.notes || '',
      status: 'Pending', // Pending, Approved, Cancelled
      createdAt: new Date().toISOString(),
    };

    let latestAppointments = appointments;
    try {
      const stored = localStorage.getItem('clinicflow_appointments');
      if (stored) {
        latestAppointments = JSON.parse(stored);
      }
    } catch {}

    const updatedAppointments = [...latestAppointments, newAppointment];
    localStorage.setItem('clinicflow_appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
    return newAppointment;
  };

  const cancelAppointment = (appointmentId) => {
    let latestAppointments = appointments;
    try {
      const stored = localStorage.getItem('clinicflow_appointments');
      if (stored) {
        latestAppointments = JSON.parse(stored);
      }
    } catch {}

    const updated = latestAppointments.map((apt) => {
      if (apt.id === appointmentId) {
        return { ...apt, status: 'Cancelled' };
      }
      return apt;
    });
    localStorage.setItem('clinicflow_appointments', JSON.stringify(updated));
    setAppointments(updated);
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    let latestAppointments = appointments;
    try {
      const stored = localStorage.getItem('clinicflow_appointments');
      if (stored) {
        latestAppointments = JSON.parse(stored);
      }
    } catch {}

    const updated = latestAppointments.map((apt) => {
      if (apt.id === appointmentId) {
        return { ...apt, status };
      }
      return apt;
    });
    localStorage.setItem('clinicflow_appointments', JSON.stringify(updated));
    setAppointments(updated);
  };

  const updateUserSettings = (newName, newPassword, profileData = {}) => {
    if (!currentUser) throw new Error('Authentication required');
    
    let latestUsers = users;
    try {
      const stored = localStorage.getItem('clinicflow_users');
      if (stored) {
        latestUsers = JSON.parse(stored);
      }
    } catch {}

    // Update local database (users)
    const updatedUsers = latestUsers.map((u) => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          name: newName || u.name,
          password: newPassword || u.password,
          gender: profileData.gender !== undefined ? profileData.gender : u.gender,
          dob: profileData.dob !== undefined ? profileData.dob : u.dob,
          bloodType: profileData.bloodType !== undefined ? profileData.bloodType : u.bloodType,
          address: profileData.address !== undefined ? profileData.address : u.address,
          emergencyName: profileData.emergencyName !== undefined ? profileData.emergencyName : u.emergencyName,
          emergencyPhone: profileData.emergencyPhone !== undefined ? profileData.emergencyPhone : u.emergencyPhone,
          profilePic: profileData.profilePic !== undefined ? profileData.profilePic : u.profilePic,
        };
      }
      return u;
    });
    localStorage.setItem('clinicflow_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Update currentUser session
    const updatedSession = {
      ...currentUser,
      name: newName || currentUser.name,
      gender: profileData.gender !== undefined ? profileData.gender : currentUser.gender,
      dob: profileData.dob !== undefined ? profileData.dob : currentUser.dob,
      bloodType: profileData.bloodType !== undefined ? profileData.bloodType : currentUser.bloodType,
      address: profileData.address !== undefined ? profileData.address : currentUser.address,
      emergencyName: profileData.emergencyName !== undefined ? profileData.emergencyName : currentUser.emergencyName,
      emergencyPhone: profileData.emergencyPhone !== undefined ? profileData.emergencyPhone : currentUser.emergencyPhone,
      profilePic: profileData.profilePic !== undefined ? profileData.profilePic : currentUser.profilePic,
    };
    localStorage.setItem('clinicflow_currentUser', JSON.stringify(updatedSession));
    setCurrentUser(updatedSession);
  };

  const [clinics, setClinics] = useState(() => {
    try {
      const stored = localStorage.getItem('clinicflow_clinics');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('clinicflow_clinics', JSON.stringify(CLINICS));
      return CLINICS;
    } catch {
      return CLINICS;
    }
  });

  const [departments, setDepartments] = useState(() => {
    try {
      const stored = localStorage.getItem('clinicflow_departments');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('clinicflow_departments', JSON.stringify(DEPARTMENTS));
      return DEPARTMENTS;
    } catch {
      return DEPARTMENTS;
    }
  });

  const [doctors, setDoctors] = useState(() => {
    try {
      const stored = localStorage.getItem('clinicflow_doctors');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('clinicflow_doctors', JSON.stringify(DOCTORS));
      return DOCTORS;
    } catch {
      return DOCTORS;
    }
  });

  const addDepartment = (name) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      name
    };
    const updated = [...departments, newDept];
    setDepartments(updated);
    localStorage.setItem('clinicflow_departments', JSON.stringify(updated));
    return newDept;
  };

  const addDoctor = (name, departmentId, clinicId) => {
    const newDoc = {
      id: `dr-${Date.now()}`,
      name,
      departmentId,
      clinicId
    };
    const updated = [...doctors, newDoc];
    setDoctors(updated);
    localStorage.setItem('clinicflow_doctors', JSON.stringify(updated));
    return newDoc;
  };

  const purgeAndResetData = () => {
    localStorage.removeItem('clinicflow_currentUser');
    localStorage.removeItem('clinicflow_users');
    localStorage.removeItem('clinicflow_appointments');
    localStorage.removeItem('clinicflow_clinics');
    localStorage.removeItem('clinicflow_departments');
    localStorage.removeItem('clinicflow_doctors');

    const defaultUsers = [
      {
        id: 'user-member-default',
        email: 'johnyjohnyyespapa@mail.com',
        password: 'EatingSugarNoPapa',
        name: 'Johny Member',
        role: 'member',
        gender: 'Female',
        dob: '12 October 1985',
        bloodType: 'O Negative',
        address: '482 Clinical Heights Parkway, Suite 300, San Francisco, CA 94107',
        emergencyName: 'Robert Sterling (Spouse)',
        emergencyPhone: '+1 (555) 987-6543',
      },
      {
        id: 'user-admin-default',
        email: 'admin@example.com',
        password: 'ThisIsNotAdmin',
        name: 'System Admin',
        role: 'admin',
        gender: 'Male',
        dob: '01 January 1980',
        bloodType: 'AB Positive',
        address: 'ClinicFlow HQ, 100 Main Street, San Francisco, CA 94102',
        emergencyName: 'Jane Admin (Spouse)',
        emergencyPhone: '+1 (555) 123-4567',
      },
    ];

    localStorage.setItem('clinicflow_users', JSON.stringify(defaultUsers));
    localStorage.setItem('clinicflow_clinics', JSON.stringify(CLINICS));
    localStorage.setItem('clinicflow_departments', JSON.stringify(DEPARTMENTS));
    localStorage.setItem('clinicflow_doctors', JSON.stringify(DOCTORS));

    setCurrentUser(null);
    setUsers(defaultUsers);
    setAppointments([]);
    setClinics(CLINICS);
    setDepartments(DEPARTMENTS);
    setDoctors(DOCTORS);
  };

  return (
    <AuthContext value={{
      currentUser,
      users,
      appointments,
      clinics,
      departments,
      doctors,
      login,
      register,
      logout,
      bookAppointment,
      cancelAppointment,
      updateAppointmentStatus,
      updateUserSettings,
      refreshUsersList,
      addDepartment,
      addDoctor,
      purgeAndResetData
    }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
