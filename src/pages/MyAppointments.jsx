import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getStatusClass, getStatusIcon } from '../utils/statusUtils';

export default function MyAppointments() {
  const { appointments, currentUser, cancelAppointment } = useAuth();
  const navigate = useNavigate();

  // Filter appointments belonging to the logged-in member
  const myAppointments = appointments.filter((apt) => apt.userId === currentUser?.id);

  return (
    <div id="my-appointments-page" data-testid="my-appointments-page" className="flex-grow w-full max-w-container-max mx-auto px-md md:px-lg py-gutter h-full">
      <div className="mb-gutter flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 id="my-appointments-title" data-testid="my-appointments-title" className="font-headline-lg text-headline-lg text-on-background mb-xs">
            My Appointments
          </h1>
          <p className="font-body-md text-body-md text-secondary">Manage your upcoming and past medical appointments.</p>
        </div>
        
        <button
          id="book-new-appointment-btn"
          data-testid="book-new-appointment-btn"
          onClick={() => navigate('/book-appointment')}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          New Appointment
        </button>
      </div>

      <div className="bg-surface rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-outline-variant overflow-hidden" data-testid="appointments-table-container">
        
        {/* Table Controls (Static for visual layout mapping) */}
        <div className="p-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-md bg-surface-bright">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
            <input type="text" placeholder="Search appointments..." className="w-full pl-10 pr-4 py-2 border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 bg-surface font-body-sm text-body-sm" />
          </div>
          <div className="flex gap-sm">
            <button className="px-3 py-2 border border-outline rounded-lg flex items-center gap-2 text-on-surface hover:bg-surface-variant font-label-md text-label-md transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
          </div>
        </div>

        {myAppointments.length === 0 ? (
          <div id="no-appointments-message" data-testid="no-appointments-message" className="p-xl text-center font-body-md text-secondary">
            You have no booked appointments.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="appointments-table" data-testid="appointments-table" className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th className="px-md py-sm font-semibold whitespace-nowrap">Date & Time</th>
                  <th className="px-md py-sm font-semibold whitespace-nowrap">Clinic</th>
                  <th className="px-md py-sm font-semibold whitespace-nowrap">Doctor</th>
                  <th className="px-md py-sm font-semibold whitespace-nowrap">Department</th>
                  <th className="px-md py-sm font-semibold whitespace-nowrap">Status</th>
                  <th className="px-md py-sm font-semibold whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="appointments-list" data-testid="appointments-list" className="font-body-sm text-body-sm divide-y divide-outline-variant text-on-surface">
                {myAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    id={`appointment-row-${apt.id}`}
                    data-testid={`appointment-item-${apt.id}`}
                    className="hover:bg-surface-variant/50 transition-colors"
                  >
                    <td className="px-md py-sm font-medium">
                      {apt.date} <span className="text-secondary">at {apt.time}</span>
                    </td>
                    <td className="px-md py-sm">{apt.clinic}</td>
                    <td className="px-md py-sm">{apt.doctor}</td>
                    <td className="px-md py-sm">{apt.department}</td>
                    <td className="px-md py-sm">
                      <span 
                        id={`appointment-status-${apt.id}`} 
                        data-testid={`appointment-status-${apt.id}`}
                        className={`px-2 py-1 rounded-full font-label-sm inline-flex items-center gap-1 ${getStatusClass(apt.status)}`}
                      >
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {getStatusIcon(apt.status)}
                        </span>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-md py-sm text-right whitespace-nowrap">
                      {apt.status !== 'Cancelled' ? (
                        <button
                          id={`cancel-appointment-${apt.id}`}
                          data-testid={`cancel-appointment-${apt.id}`}
                          onClick={() => cancelAppointment(apt.id)}
                          className="text-error hover:bg-error-container p-1 px-3 rounded-md transition-colors flex items-center gap-1 ml-auto font-label-sm text-label-sm"
                        >
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          Cancel
                        </button>
                      ) : (
                        <span id={`cancelled-label-${apt.id}`} data-testid={`cancelled-label-${apt.id}`} className="text-secondary font-label-sm text-label-sm px-3 p-1">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
