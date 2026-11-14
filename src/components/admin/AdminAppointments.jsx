import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStatusClass } from '../../utils/statusUtils';
import Pagination from '../Pagination';

const PAGE_SIZE = 10;
const STATUSES = ['Pending', 'Approved', 'Cancelled'];
const CONTROL_CLASS = 'px-4 py-2 border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 bg-surface font-body-sm text-body-sm text-on-surface';

export default function AdminAppointments() {
  const { appointments, updateAppointmentStatus } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const filtered = appointments.filter((apt) => {
    if (status && apt.status !== status) return false;
    if (!query) return true;
    return [apt.userName, apt.userEmail, apt.doctor, apt.clinic, apt.department].some((value) =>
      value?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section id="appointments-section" data-testid="admin-appointments-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-md border-b border-surface-variant pb-sm gap-md">
        <h2 data-testid="admin-appointments-title" className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">calendar_today</span>
          Appointment Management
        </h2>
        {appointments.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-sm">
            <input
              type="search"
              data-testid="admin-appointments-search"
              aria-label="Search appointments"
              placeholder="Search patient, doctor, clinic..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className={`${CONTROL_CLASS} w-full sm:w-64`}
            />
            <select
              data-testid="admin-appointments-status-filter"
              aria-label="Filter by status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className={`${CONTROL_CLASS} pr-10`}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto flex-grow mb-md">
        {appointments.length === 0 ? (
          <div id="admin-no-appointments" data-testid="admin-no-appointments" className="p-xl text-center font-body-md text-secondary">
            No appointments have been booked in the system.
          </div>
        ) : filtered.length === 0 ? (
          <div data-testid="admin-no-matching-appointments" className="p-xl text-center font-body-md text-secondary">
            No matching appointments found.
          </div>
        ) : (
          <table id="admin-appointments-table" data-testid="admin-appointments-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
                <th className="py-sm px-md font-semibold whitespace-nowrap">Patient</th>
                <th className="py-sm px-md font-semibold whitespace-nowrap">Clinic</th>
                <th className="py-sm px-md font-semibold whitespace-nowrap">Doctor</th>
                <th className="py-sm px-md font-semibold whitespace-nowrap">Date & Time</th>
                <th className="py-sm px-md font-semibold whitespace-nowrap">Status</th>
                <th className="py-sm px-md font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-appointments-list" data-testid="admin-appointments-list" className="font-body-sm text-body-sm text-on-surface">
              {pageItems.map((apt) => (
                <tr
                  key={apt.id}
                  id={`admin-apt-row-${apt.id}`}
                  data-testid={`admin-appointment-item-${apt.id}`}
                  className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  <td className="py-md px-md">
                    <div className="font-medium">{apt.userName}</div>
                    <div className="text-secondary">{apt.userEmail}</div>
                  </td>
                  <td className="py-md px-md">{apt.clinic}</td>
                  <td className="py-md px-md">
                    <div>{apt.doctor}</div>
                    <div className="text-secondary">{apt.department}</div>
                  </td>
                  <td className="py-md px-md">{apt.date} at {apt.time}</td>
                  <td className="py-md px-md">
                    <span
                      id={`admin-apt-status-${apt.id}`}
                      data-testid={`admin-apt-status-${apt.id}`}
                      className={`font-label-sm text-label-sm px-2 py-1 rounded-full ${getStatusClass(apt.status)}`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-md px-md text-right whitespace-nowrap">
                    {apt.status === 'Cancelled' ? (
                      <span id={`admin-cancelled-label-${apt.id}`} data-testid={`admin-cancelled-label-${apt.id}`} className="text-secondary font-label-sm text-label-sm">
                        --
                      </span>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        {apt.status === 'Pending' && (
                          <button
                            id={`admin-approve-${apt.id}`}
                            data-testid={`admin-approve-${apt.id}`}
                            onClick={() => updateAppointmentStatus(apt.id, 'Approved')}
                            className="text-primary hover:bg-primary-container/20 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-primary"
                          >
                            Approve
                          </button>
                        )}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={safePage}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
        testIdPrefix="admin-appointments"
      />
    </section>
  );
}
