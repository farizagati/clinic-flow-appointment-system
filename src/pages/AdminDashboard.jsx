import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { 
    appointments, 
    users, 
    updateAppointmentStatus,
    departments,
    doctors,
    clinics,
    addDepartment,
    addDoctor
  } = useAuth();

  const [activeTab, setActiveTab] = useState('stats');
  
  // Modal states
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocDept, setNewDocDept] = useState('');
  const [newDocClinic, setNewDocClinic] = useState('');

  // Compute statistics
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((apt) => apt.status === 'Pending').length;
  const approvedAppointments = appointments.filter((apt) => apt.status === 'Approved').length;
  const cancelledAppointments = appointments.filter((apt) => apt.status === 'Cancelled').length;
  const totalUsers = users.length;

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (newDeptName.trim()) {
      addDepartment(newDeptName.trim());
      setNewDeptName('');
      setShowAddDeptModal(false);
    }
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (newDocName.trim() && newDocDept && newDocClinic) {
      addDoctor(newDocName.trim(), newDocDept, newDocClinic);
      setNewDocName('');
      setNewDocDept('');
      setNewDocClinic('');
      setShowAddDocModal(false);
    }
  };

  return (
    <div id="admin-dashboard-page" data-testid="admin-dashboard-page" className="flex-grow w-full h-full bg-surface-bright relative">
      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl flex flex-col gap-gutter">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-md">
          <div>
            <h1 id="admin-title" data-testid="admin-title" className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
              Admin Dashboard
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Configure clinic structure, manage appointments, and personnel.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 bg-surface-container-low rounded-xl border border-outline-variant p-md flex flex-col gap-sm sticky top-24">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs px-sm">Administration Menu</h3>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-sm px-md py-sm rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'stats' ? 'bg-primary-container/20 text-primary' : 'text-on-surface hover:bg-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              Dashboard Stats
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-sm px-md py-sm rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'appointments' ? 'bg-primary-container/20 text-primary' : 'text-on-surface hover:bg-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              Appointments
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-sm px-md py-sm rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'users' ? 'bg-primary-container/20 text-primary' : 'text-on-surface hover:bg-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">group</span>
              Users Database
            </button>
            <button 
              onClick={() => setActiveTab('departments')}
              className={`flex items-center gap-sm px-md py-sm rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'departments' ? 'bg-primary-container/20 text-primary' : 'text-on-surface hover:bg-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">domain</span>
              Departments
            </button>
            <button 
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center gap-sm px-md py-sm rounded-lg font-medium transition-colors w-full text-left ${activeTab === 'doctors' ? 'bg-primary-container/20 text-primary' : 'text-on-surface hover:bg-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">medical_services</span>
              Doctors
            </button>
          </aside>

          {/* Content Area */}
          <div className="flex-grow w-full flex flex-col gap-gutter overflow-hidden">
            
            {/* Stats Section */}
            {activeTab === 'stats' && (
              <section id="admin-stats" data-testid="admin-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md mb-md">
                <div id="stat-total-appointments" data-testid="stat-total-appointments" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col">
                  <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Total Appointments</h3>
                  <p className="font-headline-lg text-headline-lg text-on-surface">{totalAppointments}</p>
                </div>
                <div id="stat-pending-appointments" data-testid="stat-pending-appointments" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col">
                  <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Pending</h3>
                  <p className="font-headline-lg text-headline-lg text-on-surface">{pendingAppointments}</p>
                </div>
                <div id="stat-approved-appointments" data-testid="stat-approved-appointments" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col">
                  <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Approved</h3>
                  <p className="font-headline-lg text-headline-lg text-on-surface">{approvedAppointments}</p>
                </div>
                <div id="stat-cancelled-appointments" data-testid="stat-cancelled-appointments" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col">
                  <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Cancelled</h3>
                  <p className="font-headline-lg text-headline-lg text-on-surface">{cancelledAppointments}</p>
                </div>
                <div id="stat-total-users" data-testid="stat-total-users" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col">
                  <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Total Users</h3>
                  <p className="font-headline-lg text-headline-lg text-on-surface">{totalUsers}</p>
                </div>
              </section>
            )}

            {/* Appointments Management */}
            {activeTab === 'appointments' && (
              <section id="appointments-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm gap-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    Appointment Management
                  </h2>
                </div>
                
                <div className="overflow-x-auto flex-grow mb-md">
                  {appointments.length === 0 ? (
                    <div id="admin-no-appointments" data-testid="admin-no-appointments" className="p-xl text-center font-body-md text-secondary">
                      No appointments have been booked in the system.
                    </div>
                  ) : (
                    <table id="admin-appointments-table" data-testid="admin-appointments-table" className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
                          <th className="py-sm px-md font-semibold whitespace-nowrap">Patient Name</th>
                          <th className="py-sm px-md font-semibold whitespace-nowrap">Patient Email</th>
                          <th className="py-sm px-md font-semibold whitespace-nowrap">Clinic</th>
                          <th className="py-sm px-md font-semibold whitespace-nowrap">Doctor</th>
                          <th className="py-sm px-md font-semibold whitespace-nowrap">Date & Time</th>
                          <th className="py-sm px-md font-semibold whitespace-nowrap">Status</th>
                          <th className="py-sm px-md font-semibold text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody id="admin-appointments-list" data-testid="admin-appointments-list" className="font-body-sm text-body-sm text-on-surface">
                        {appointments.map((apt) => (
                          <tr 
                            key={apt.id} 
                            id={`admin-apt-row-${apt.id}`} 
                            data-testid={`admin-appointment-item-${apt.id}`} 
                            className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                          >
                            <td className="py-md px-md font-medium">{apt.userName}</td>
                            <td className="py-md px-md">{apt.userEmail}</td>
                            <td className="py-md px-md">{apt.clinic}</td>
                            <td className="py-md px-md">{apt.doctor}</td>
                            <td className="py-md px-md">{apt.date} at {apt.time}</td>
                            <td className="py-md px-md">
                              <span 
                                id={`admin-apt-status-${apt.id}`} 
                                data-testid={`admin-apt-status-${apt.id}`}
                                className="font-label-sm text-label-sm px-2 py-1 bg-surface-variant text-on-surface-variant rounded-full"
                              >
                                {apt.status}
                              </span>
                            </td>
                            <td className="py-md px-md text-right whitespace-nowrap">
                              {apt.status === 'Pending' && (
                                <div className="flex gap-2 justify-end">
                                  <button
                                    id={`admin-approve-${apt.id}`}
                                    data-testid={`admin-approve-${apt.id}`}
                                    onClick={() => updateAppointmentStatus(apt.id, 'Approved')}
                                    className="text-primary hover:bg-primary-container/20 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-primary"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    id={`admin-cancel-${apt.id}`}
                                    data-testid={`admin-cancel-${apt.id}`}
                                    onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                                    className="text-error hover:bg-error-container/50 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-error"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              {apt.status === 'Approved' && (
                                <button
                                  id={`admin-cancel-${apt.id}`}
                                  data-testid={`admin-cancel-${apt.id}`}
                                  onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                                  className="text-error hover:bg-error-container/50 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-error ml-auto"
                                >
                                  Cancel
                                </button>
                              )}
                              {apt.status === 'Cancelled' && (
                                <span id={`admin-cancelled-label-${apt.id}`} data-testid={`admin-cancelled-label-${apt.id}`} className="text-secondary font-label-sm text-label-sm">
                                  --
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            )}

            {/* Users Database List */}
            {activeTab === 'users' && (
              <section id="users-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm gap-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">group</span>
                    Registered Users
                  </h2>
                </div>
                
                <div className="overflow-x-auto flex-grow mb-md">
                  <table id="admin-users-table" data-testid="admin-users-table" className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
                        <th className="py-sm px-md font-semibold whitespace-nowrap">Name</th>
                        <th className="py-sm px-md font-semibold whitespace-nowrap">Email</th>
                        <th className="py-sm px-md font-semibold whitespace-nowrap">Role</th>
                      </tr>
                    </thead>
                    <tbody id="admin-users-list" data-testid="admin-users-list" className="font-body-sm text-body-sm text-on-surface">
                      {users.map((u) => (
                        <tr 
                          key={u.id} 
                          id={`admin-user-row-${u.id}`} 
                          data-testid={`user-item-${u.id}`} 
                          className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                        >
                          <td className="py-md px-md font-medium">{u.name}</td>
                          <td className="py-md px-md">{u.email}</td>
                          <td className="py-md px-md">
                            <span className="font-label-sm text-label-sm px-2 py-1 bg-surface-variant text-on-surface-variant rounded-full">
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Departments List */}
            {activeTab === 'departments' && (
              <section id="departments-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm gap-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">domain</span>
                    Departments
                  </h2>
                  <button 
                    id="admin-add-dept-btn"
                    data-testid="admin-add-dept-btn"
                    onClick={() => setShowAddDeptModal(true)}
                    className="flex items-center gap-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add Department
                  </button>
                </div>
                
                <div className="overflow-x-auto flex-grow mb-md">
                  <table id="admin-depts-table" data-testid="admin-depts-table" className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
                        <th className="py-sm px-md font-semibold whitespace-nowrap">ID</th>
                        <th className="py-sm px-md font-semibold whitespace-nowrap">Department Name</th>
                      </tr>
                    </thead>
                    <tbody id="admin-depts-list" data-testid="admin-depts-list" className="font-body-sm text-body-sm text-on-surface">
                      {departments.map((d) => (
                        <tr 
                          key={d.id} 
                          id={`admin-dept-row-${d.id}`} 
                          data-testid={`dept-item-${d.id}`} 
                          className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                        >
                          <td className="py-md px-md font-medium">{d.id}</td>
                          <td className="py-md px-md">{d.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Doctors List */}
            {activeTab === 'doctors' && (
              <section id="doctors-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm gap-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">medical_services</span>
                    Doctors
                  </h2>
                  <button 
                    id="admin-add-doc-btn"
                    data-testid="admin-add-doc-btn"
                    onClick={() => setShowAddDocModal(true)}
                    className="flex items-center gap-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add Doctor
                  </button>
                </div>
                
                <div className="overflow-x-auto flex-grow mb-md">
                  <table id="admin-doctors-table" data-testid="admin-doctors-table" className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
                        <th className="py-sm px-md font-semibold whitespace-nowrap">Doctor Name</th>
                        <th className="py-sm px-md font-semibold whitespace-nowrap">Department</th>
                        <th className="py-sm px-md font-semibold whitespace-nowrap">Clinic</th>
                      </tr>
                    </thead>
                    <tbody id="admin-doctors-list" data-testid="admin-doctors-list" className="font-body-sm text-body-sm text-on-surface">
                      {doctors.map((doc) => {
                        const dept = departments.find(d => d.id === doc.departmentId);
                        const clinic = clinics.find(c => c.id === doc.clinicId);
                        return (
                          <tr 
                            key={doc.id} 
                            id={`admin-doc-row-${doc.id}`} 
                            data-testid={`doc-item-${doc.id}`} 
                            className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                          >
                            <td className="py-md px-md font-medium">{doc.name}</td>
                            <td className="py-md px-md">{dept ? dept.name : doc.departmentId}</td>
                            <td className="py-md px-md">{clinic ? clinic.name : doc.clinicId}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        </div>
      </main>

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-sm p-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md overflow-hidden" data-testid="add-dept-modal">
            <div className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Add New Department</h2>
              <button onClick={() => setShowAddDeptModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddDepartment} className="p-lg flex flex-col gap-md">
              <div className="floating-input relative">
                <input
                  type="text"
                  id="new-dept-name"
                  data-testid="new-dept-name-input"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full h-14 px-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary transition-colors peer"
                  placeholder=" "
                />
                <label htmlFor="new-dept-name" className="absolute left-3 top-0 -translate-y-1/2 scale-85 bg-surface-container-lowest px-1 rounded-sm font-body-md text-body-md text-on-surface-variant peer-focus:text-primary transition-all pointer-events-none z-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:scale-85">
                  Department Name *
                </label>
              </div>
              <div className="flex justify-end gap-sm mt-sm">
                <button type="button" onClick={() => setShowAddDeptModal(false)} className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors" data-testid="add-dept-cancel">Cancel</button>
                <button type="submit" className="px-4 py-2 font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint rounded-lg transition-colors" data-testid="add-dept-submit">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-sm p-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md overflow-hidden" data-testid="add-doc-modal">
            <div className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Add New Doctor</h2>
              <button onClick={() => setShowAddDocModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddDoctor} className="p-lg flex flex-col gap-md">
              <div className="floating-input relative">
                <input
                  type="text"
                  id="new-doc-name"
                  data-testid="new-doc-name-input"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full h-14 px-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary transition-colors peer"
                  placeholder=" "
                />
                <label htmlFor="new-doc-name" className="absolute left-3 top-0 -translate-y-1/2 scale-85 bg-surface-container-lowest px-1 rounded-sm font-body-md text-body-md text-on-surface-variant peer-focus:text-primary transition-all pointer-events-none z-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:scale-85">
                  Doctor Full Name *
                </label>
              </div>

              <div className="floating-input relative">
                <select
                  id="new-doc-dept"
                  data-testid="new-doc-dept-select"
                  required
                  value={newDocDept}
                  onChange={(e) => setNewDocDept(e.target.value)}
                  className="w-full h-14 px-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="" disabled hidden></option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <label htmlFor="new-doc-dept" className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm">
                  Select Department *
                </label>
              </div>

              <div className="floating-input relative">
                <select
                  id="new-doc-clinic"
                  data-testid="new-doc-clinic-select"
                  required
                  value={newDocClinic}
                  onChange={(e) => setNewDocClinic(e.target.value)}
                  className="w-full h-14 px-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="" disabled hidden></option>
                  {clinics.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <label htmlFor="new-doc-clinic" className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm">
                  Select Clinic *
                </label>
              </div>

              <div className="flex justify-end gap-sm mt-sm">
                <button type="button" onClick={() => setShowAddDocModal(false)} className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors" data-testid="add-doc-cancel">Cancel</button>
                <button type="submit" className="px-4 py-2 font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint rounded-lg transition-colors" data-testid="add-doc-submit">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
