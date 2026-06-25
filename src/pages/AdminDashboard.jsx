import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { appointments, users, updateAppointmentStatus } = useAuth();

  // Compute statistics
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((apt) => apt.status === 'Pending').length;
  const approvedAppointments = appointments.filter((apt) => apt.status === 'Approved').length;
  const cancelledAppointments = appointments.filter((apt) => apt.status === 'Cancelled').length;
  const totalUsers = users.length;

  return (
    <div id="admin-dashboard-page" data-testid="admin-dashboard-page" className="flex-grow w-full h-full bg-surface-bright">
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
            <a href="#stats-section" className="flex items-center gap-sm px-md py-sm rounded-lg bg-primary-container/20 text-primary font-medium transition-colors">
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              Dashboard Stats
            </a>
            <a href="#appointments-section" className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              Appointments
            </a>
            <a href="#users-section" className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">group</span>
              Users Database
            </a>
          </aside>

          {/* Content Area */}
          <div className="flex-grow w-full flex flex-col gap-gutter overflow-hidden">
            
            {/* Stats Section */}
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

            {/* Appointments Management */}
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

            {/* Users Database List */}
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

          </div>
        </div>
      </main>
    </div>
  );
}
