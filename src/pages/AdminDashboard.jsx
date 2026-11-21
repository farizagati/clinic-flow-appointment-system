import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminAppointments from '../components/admin/AdminAppointments';
import AdminDepartments from '../components/admin/AdminDepartments';
import AdminDoctors from '../components/admin/AdminDoctors';
import AdminUsers from '../components/admin/AdminUsers';

const TABS = [
  { id: 'stats', label: 'Dashboard Stats', icon: 'bar_chart' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar_today' },
  { id: 'users', label: 'Users Database', icon: 'group' },
  { id: 'departments', label: 'Departments', icon: 'domain' },
  { id: 'doctors', label: 'Doctors', icon: 'medical_services' },
];

export default function AdminDashboard() {
  const { appointments, users } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  // notice: null | { type: 'success' | 'error', text }
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice(type ? { type, text } : null);

  const countByStatus = (status) => appointments.filter((apt) => apt.status === status).length;
  const stats = [
    { id: 'stat-total-appointments', label: 'Total Appointments', value: appointments.length },
    { id: 'stat-pending-appointments', label: 'Pending', value: countByStatus('Pending') },
    { id: 'stat-approved-appointments', label: 'Approved', value: countByStatus('Approved') },
    { id: 'stat-cancelled-appointments', label: 'Cancelled', value: countByStatus('Cancelled') },
    { id: 'stat-total-users', label: 'Total Users', value: users.length },
  ];

  return (
    <div id="admin-dashboard-page" data-testid="admin-dashboard-page" className="flex-grow w-full h-full bg-surface-bright relative">
      <div className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl flex flex-col gap-gutter">

        <div className="mb-md">
          <h1 id="admin-title" data-testid="admin-title" className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
            Admin Dashboard
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Configure clinic structure, manage appointments, and personnel.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter items-start">
          <aside className="w-full lg:w-64 shrink-0 bg-surface-container-low rounded-xl border border-outline-variant p-md flex flex-col gap-sm lg:sticky lg:top-24">
            <h2 data-testid="admin-menu-title" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs px-sm">Administration Menu</h2>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                data-testid={`admin-tab-${tab.id}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                onClick={() => {
                  setActiveTab(tab.id);
                  setNotice(null);
                }}
                className={`flex items-center gap-sm px-md py-sm rounded-lg font-medium transition-colors w-full text-left ${activeTab === tab.id ? 'bg-primary-container/20 text-primary' : 'text-on-surface hover:bg-surface-variant'}`}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="flex-grow w-full min-w-0 flex flex-col gap-gutter overflow-hidden">

            {notice && (
              <div
                role={notice.type === 'error' ? 'alert' : 'status'}
                data-testid={notice.type === 'error' ? 'admin-error' : 'admin-success'}
                className={`p-sm rounded-lg font-body-sm ${notice.type === 'error' ? 'bg-error-container text-on-error-container' : 'bg-primary-container/20 text-on-primary-container'}`}
              >
                {notice.text}
              </div>
            )}

            {activeTab === 'stats' && (
              <section id="admin-stats" data-testid="admin-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md mb-md">
                {stats.map((stat) => (
                  <div key={stat.id} id={stat.id} data-testid={stat.id} className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col">
                    <h2 data-testid={`${stat.id}-label`} className="font-label-md text-label-md text-on-surface-variant mb-xs">{stat.label}</h2>
                    <p data-testid={`${stat.id}-value`} className="font-headline-lg text-headline-lg text-on-surface">{stat.value}</p>
                  </div>
                ))}
              </section>
            )}

            {activeTab === 'appointments' && <AdminAppointments />}

            {activeTab === 'users' && <AdminUsers onNotify={notify} />}

            {activeTab === 'departments' && <AdminDepartments onNotify={notify} />}

            {activeTab === 'doctors' && <AdminDoctors onNotify={notify} />}

          </div>
        </div>
      </div>
    </div>
  );
}
