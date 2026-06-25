import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getStatusClass, getStatusIcon } from '../utils/statusUtils';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import { parseISO, startOfDay } from 'date-fns';

const ITEMS_PER_PAGE = 5;

export default function MyAppointments() {
  const { appointments, currentUser, cancelAppointment, departments } = useAuth();
  const navigate = useNavigate();

  // Collapsible panel and loading states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Search input query
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Staged and applied filters
  const [tempFilters, setTempFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    department: '',
    doctor: '',
    status: { Confirmed: false, Scheduled: false, Pending: false, Cancelled: false }
  });

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    department: '',
    doctor: '',
    status: { Confirmed: false, Scheduled: false, Pending: false, Cancelled: false }
  });

  // Filter appointments belonging to the logged-in member
  const myAppointments = appointments.filter((apt) => apt.userId === currentUser?.id);

  // Debounced search effect with loading simulation
  useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
        setCurrentPage(1);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, debouncedQuery]);

  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAppliedFilters({ ...tempFilters });
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSearchQuery('');
      setDebouncedQuery('');
      const resetVal = {
        dateRange: { from: undefined, to: undefined },
        department: '',
        doctor: '',
        status: { Confirmed: false, Scheduled: false, Pending: false, Cancelled: false }
      };
      setTempFilters(resetVal);
      setAppliedFilters(resetVal);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  // Filter computation logic
  const filteredAppointments = myAppointments.filter((apt) => {
    // 1. Search Query filter (matches doctor, clinic, department, or notes)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      const matchDoctor = apt.doctor?.toLowerCase().includes(q);
      const matchClinic = apt.clinic?.toLowerCase().includes(q);
      const matchDept = apt.department?.toLowerCase().includes(q);
      const matchNotes = apt.notes?.toLowerCase().includes(q);
      if (!matchDoctor && !matchClinic && !matchDept && !matchNotes) {
        return false;
      }
    }

    // 2. Date Range filter
    const { dateRange } = appliedFilters;
    if (dateRange?.from || dateRange?.to) {
      const aptDate = startOfDay(parseISO(apt.date));
      if (dateRange.from && aptDate < startOfDay(dateRange.from)) {
        return false;
      }
      if (dateRange.to && aptDate > startOfDay(dateRange.to)) {
        return false;
      }
    }

    // 3. Department filter
    if (appliedFilters.department) {
      if (apt.department !== appliedFilters.department) {
        return false;
      }
    }

    // 4. Doctor filter
    if (appliedFilters.doctor.trim()) {
      const docQuery = appliedFilters.doctor.toLowerCase();
      if (!apt.doctor?.toLowerCase().includes(docQuery)) {
        return false;
      }
    }

    // 5. Status filter
    const activeStatuses = Object.keys(appliedFilters.status).filter(
      (key) => appliedFilters.status[key]
    );
    if (activeStatuses.length > 0) {
      const isMatch = activeStatuses.some((statusName) => {
        if (statusName === 'Confirmed' && (apt.status === 'Confirmed' || apt.status === 'Approved')) {
          return true;
        }
        return apt.status?.toLowerCase() === statusName.toLowerCase();
      });
      if (!isMatch) {
        return false;
      }
    }

    return true;
  });

  // Pagination computation
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Page number list with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      const rangeStart = Math.max(2, safePage - 1);
      const rangeEnd = Math.min(totalPages - 1, safePage + 1);
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

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

      <div className="bg-surface rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-outline-variant" data-testid="appointments-table-container">
        
        {/* Table Controls */}
        <div className="p-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-md bg-surface-bright rounded-t-xl">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
            <input
              type="text"
              data-testid="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 bg-surface font-body-sm text-body-sm text-on-surface"
            />
          </div>
          <div className="flex gap-sm">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              data-testid="btn-filter"
              className={`px-3 py-2 border rounded-lg flex items-center gap-2 font-label-md text-label-md transition-colors active:scale-95 ${
                isFilterOpen
                  ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
                  : 'border-outline text-on-surface hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {isFilterOpen && (
          <div
            id="filter-panel"
            data-testid="filter-panel"
            className="p-lg border-b border-outline-variant bg-surface-container-lowest grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg"
          >
            {/* Date Range Column */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-on-surface-variant font-medium">Date Range</label>
              <CustomDateRangePicker
                value={tempFilters.dateRange}
                onChange={(range) => setTempFilters((prev) => ({ ...prev, dateRange: range }))}
                dataTestId="filter-date-range"
              />
            </div>

            {/* Department Column */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-on-surface-variant font-medium" htmlFor="filter-department">Department</label>
              <select
                id="filter-department"
                data-testid="filter-department"
                value={tempFilters.department}
                onChange={(e) => setTempFilters((prev) => ({ ...prev, department: e.target.value }))}
                className="w-full p-2 border border-outline rounded-lg font-body-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none bg-surface text-on-surface"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Doctor Column */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-on-surface-variant font-medium" htmlFor="filter-doctor">Doctor</label>
              <input
                id="filter-doctor"
                data-testid="filter-doctor"
                type="text"
                placeholder="Search doctor..."
                value={tempFilters.doctor}
                onChange={(e) => setTempFilters((prev) => ({ ...prev, doctor: e.target.value }))}
                className="w-full p-2 border border-outline rounded-lg font-body-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none bg-surface text-on-surface"
              />
            </div>

            {/* Status Column */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-on-surface-variant font-medium">Status</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Confirmed', 'Scheduled', 'Pending', 'Cancelled'].map((statusName) => (
                  <label key={statusName} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      data-testid={`status-checkbox-${statusName.toLowerCase()}`}
                      checked={tempFilters.status[statusName] || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setTempFilters((prev) => ({
                          ...prev,
                          status: {
                            ...prev.status,
                            [statusName]: checked,
                          },
                        }));
                      }}
                      className="rounded border-outline text-primary focus:ring-primary bg-surface"
                    />
                    <span className="text-body-sm text-on-surface">{statusName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-4 flex justify-end gap-md mt-2">
              <button
                onClick={handleResetFilters}
                data-testid="btn-reset-filters"
                className="px-4 py-2 font-label-md text-secondary hover:bg-surface-variant rounded-lg transition-colors active:scale-95"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                data-testid="btn-apply-filters"
                className="px-6 py-2 font-label-md bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Table Responsive Wrapper */}
        <div className="overflow-x-auto min-h-[150px] rounded-b-xl">
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
            <tbody id="appointments-list" data-testid="appointments-list" className="font-body-sm text-body-sm divide-y divide-outline-variant text-on-surface relative">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3" data-testid="search-loading-spinner">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-secondary font-body-sm">Loading appointments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-xl text-center font-body-md text-secondary" data-testid="no-appointments-message">
                    {myAppointments.length === 0 ? 'You have no booked appointments.' : 'No matching appointments found.'}
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    id={`appointment-row-${apt.id}`}
                    data-testid={`appointment-item-${apt.id}`}
                    className="hover:bg-surface-variant/50 transition-colors animate-fadeIn"
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="p-md border-t border-outline-variant bg-surface-bright flex flex-col sm:flex-row justify-between items-center gap-md font-body-sm text-body-sm text-secondary rounded-b-xl"
          data-testid="pagination-container"
        >
          <div>
            Showing{' '}
            <span className="font-medium text-on-surface">
              {filteredAppointments.length === 0 ? 0 : startIndex + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-on-surface">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredAppointments.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-on-surface">{filteredAppointments.length}</span>{' '}
            results
          </div>
          <div className="flex items-center gap-xs">
            <button
              aria-label="Previous Page"
              data-testid="btn-page-prev"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1 rounded hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-outline">...</span>
              ) : (
                <button
                  key={page}
                  data-testid={`btn-page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-medium flex items-center justify-center transition-colors ${
                    safePage === page
                      ? 'bg-primary text-on-primary'
                      : 'hover:bg-surface-variant text-on-surface'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              aria-label="Next Page"
              data-testid="btn-page-next"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1 rounded hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
