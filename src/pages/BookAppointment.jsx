import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CLINICS, DEPARTMENTS, DOCTORS, TIME_SLOTS } from '../data/mockData';
import { FieldError } from '../components/FieldError';

export default function BookAppointment() {
  const { bookAppointment } = useAuth();
  const navigate = useNavigate();

  const [clinic, setClinic] = useState('');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const [filteredDoctors, setFilteredDoctors] = useState(DOCTORS);
  const [error, setError] = useState(''); // top-level server/auth error
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    clinic: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
  });

  // Dynamic doctor filtering based on clinic and department
  useEffect(() => {
    let result = DOCTORS;
    if (clinic) {
      result = result.filter((d) => d.clinicId === clinic);
    }
    if (department) {
      result = result.filter((d) => d.departmentId === department);
    }
    setFilteredDoctors(result);

    // Reset selected doctor if it's no longer in the filtered list
    if (doctor && !result.some((d) => d.id === doctor)) {
      setDoctor('');
    }
  }, [clinic, department]);

  const validate = () => {
    const errors = { clinic: '', department: '', doctor: '', date: '', time: '' };
    let valid = true;

    if (!clinic) {
      errors.clinic = 'Please select a clinic';
      valid = false;
    }
    if (!department) {
      errors.department = 'Please select a department';
      valid = false;
    }
    if (!doctor) {
      errors.doctor = 'Please select a doctor';
      valid = false;
    }
    if (!date) {
      errors.date = 'Please select an appointment date';
      valid = false;
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = 'Appointment date cannot be in the past';
        valid = false;
      }
    }
    if (!time) {
      errors.time = 'Please select a time slot';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    try {
      const selectedClinicObj = CLINICS.find((c) => c.id === clinic);
      const selectedDepartmentObj = DEPARTMENTS.find((s) => s.id === department);
      const selectedDoctorObj = DOCTORS.find((d) => d.id === doctor);

      bookAppointment({
        clinic: selectedClinicObj.name,
        department: selectedDepartmentObj.name,
        doctor: selectedDoctorObj.name,
        date,
        time,
        notes,
      });

      setSuccess('Appointment successfully booked!');
      setClinic('');
      setDepartment('');
      setDoctor('');
      setDate('');
      setTime('');
      setNotes('');

      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
    }
  };

  // Clear per-field error when user interacts with the field
  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div id="book-appointment-page" data-testid="book-appointment-page" className="flex-grow flex flex-col w-full h-full">
      <main className="flex-grow flex items-center justify-center p-md md:p-gutter w-full max-w-container-max mx-auto">
        <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] overflow-hidden relative z-[10]">
          {/* Decorative Header Accent */}
          <div className="h-2 w-full bg-primary-container"></div>
          
          <div className="p-lg md:p-xl">
            <div className="mb-gutter text-center">
              <h1 id="booking-title" data-testid="booking-title" className="font-headline-md text-headline-md text-on-surface mb-sm">
                Schedule Your Visit
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Please provide your details to secure an appointment slot.</p>
            </div>

            {error && (
              <div id="appointment-error" data-testid="appointment-error" className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-sm">
                {error}
              </div>
            )}

            {success && (
              <div id="appointment-success" data-testid="appointment-success" className="mb-md p-sm bg-primary-container/20 text-on-primary-container rounded-lg font-body-sm">
                {success}
              </div>
            )}

            <form id="appointment-form" data-testid="appointment-form" onSubmit={handleSubmit} noValidate className="space-y-gutter">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                
                {/* Clinic Selection */}
                <div className="col-span-1 md:col-span-2">
                  <div className="floating-input relative">
                    <select
                      id="appointment-clinic"
                      data-testid="appointment-clinic"
                      value={clinic}
                      onChange={(e) => { setClinic(e.target.value); clearFieldError('clinic'); }}
                      className={`w-full h-14 px-4 bg-transparent border rounded-lg text-on-surface focus:outline-none transition-colors appearance-none cursor-pointer ${
                        clinic ? 'has-value' : ''
                      } ${
                        fieldErrors.clinic ? 'input-error' : 'border-outline'
                      }`}
                      aria-invalid={!!fieldErrors.clinic}
                      aria-describedby={fieldErrors.clinic ? 'appointment-clinic-error' : undefined}
                    >
                      <option value="" disabled hidden></option>
                      {CLINICS.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <label htmlFor="appointment-clinic" className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm">
                      Select Clinic *
                    </label>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  <FieldError message={fieldErrors.clinic} fieldId="appointment-clinic" />
                </div>

                {/* Department Selection */}
                <div>
                  <div className="floating-input relative">
                    <select
                      id="appointment-department"
                      data-testid="appointment-department"
                      value={department}
                      onChange={(e) => { setDepartment(e.target.value); clearFieldError('department'); }}
                      className={`w-full h-14 px-4 bg-transparent border rounded-lg text-on-surface focus:outline-none transition-colors appearance-none cursor-pointer ${
                        department ? 'has-value' : ''
                      } ${
                        fieldErrors.department ? 'input-error' : 'border-outline'
                      }`}
                      aria-invalid={!!fieldErrors.department}
                      aria-describedby={fieldErrors.department ? 'appointment-department-error' : undefined}
                    >
                      <option value="" disabled hidden></option>
                      {DEPARTMENTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <label htmlFor="appointment-department" className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm">
                      Select Department *
                    </label>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  <FieldError message={fieldErrors.department} fieldId="appointment-department" />
                </div>

                {/* Doctor Selection */}
                <div>
                  <div className="floating-input relative">
                    <select
                      id="appointment-doctor"
                      data-testid="appointment-doctor"
                      value={doctor}
                      onChange={(e) => { setDoctor(e.target.value); clearFieldError('doctor'); }}
                      className={`w-full h-14 px-4 bg-transparent border rounded-lg text-on-surface focus:outline-none transition-colors appearance-none cursor-pointer ${
                        doctor ? 'has-value' : ''
                      } ${
                        fieldErrors.doctor ? 'input-error' : 'border-outline'
                      }`}
                      aria-invalid={!!fieldErrors.doctor}
                      aria-describedby={fieldErrors.doctor ? 'appointment-doctor-error' : undefined}
                    >
                      <option value="" disabled hidden></option>
                      {filteredDoctors.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <label htmlFor="appointment-doctor" className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm">
                      Select Doctor *
                    </label>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  <FieldError message={fieldErrors.doctor} fieldId="appointment-doctor" />
                </div>

                {/* Date Picker */}
                <div>
                  <div className="floating-input relative">
                    <input
                      type="date"
                      id="appointment-date"
                      data-testid="appointment-date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); clearFieldError('date'); }}
                      className={`w-full h-14 px-4 bg-transparent border rounded-lg text-on-surface focus:outline-none transition-colors peer [color-scheme:light] dark:[color-scheme:dark] ${
                        fieldErrors.date ? 'input-error' : 'border-outline'
                      }`}
                      placeholder=" "
                      aria-invalid={!!fieldErrors.date}
                      aria-describedby={fieldErrors.date ? 'appointment-date-error' : undefined}
                    />
                    <label htmlFor="appointment-date" className="absolute left-3 top-0 -translate-y-1/2 scale-85 bg-surface-container-lowest px-1 rounded-sm font-body-md text-body-md text-on-surface-variant peer-focus:text-primary transition-all pointer-events-none z-10">
                      Appointment Date *
                    </label>
                  </div>
                  <FieldError message={fieldErrors.date} fieldId="appointment-date" />
                </div>

                {/* Time Picker */}
                <div>
                  <div className="floating-input relative">
                    <select
                      id="appointment-time"
                      data-testid="appointment-time"
                      value={time}
                      onChange={(e) => { setTime(e.target.value); clearFieldError('time'); }}
                      className={`w-full h-14 px-4 bg-transparent border rounded-lg text-on-surface focus:outline-none transition-colors appearance-none cursor-pointer ${
                        time ? 'has-value' : ''
                      } ${
                        fieldErrors.time ? 'input-error' : 'border-outline'
                      }`}
                      aria-invalid={!!fieldErrors.time}
                      aria-describedby={fieldErrors.time ? 'appointment-time-error' : undefined}
                    >
                      <option value="" disabled hidden></option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <label htmlFor="appointment-time" className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm">
                      Select Time Slot *
                    </label>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  <FieldError message={fieldErrors.time} fieldId="appointment-time" />
                </div>
                
                {/* Notes Input */}
                <div className="floating-input relative col-span-1 md:col-span-2">
                  <textarea
                    id="appointment-notes"
                    data-testid="appointment-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none transition-colors peer resize-none h-24"
                    placeholder=" "
                  ></textarea>
                  <label htmlFor="appointment-notes" className="absolute left-3 top-4 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm bg-surface-container-lowest peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-85 peer-focus:text-primary peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-85">
                    Reason / Notes (Optional)
                  </label>
                </div>

              </div>

              {/* Submit Actions */}
              <div className="pt-lg flex flex-col sm:flex-row justify-end gap-md">
                <button
                  type="button"
                  onClick={() => navigate('/my-appointments')}
                  className="font-label-md text-label-md px-6 py-3 rounded-lg text-on-surface hover:bg-surface-container transition-colors order-2 sm:order-1 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="appointment-submit"
                  data-testid="appointment-submit"
                  className="font-label-md text-label-md px-6 py-3 rounded-lg bg-primary text-on-primary hover:bg-surface-tint transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] order-1 sm:order-2 flex items-center justify-center gap-sm active:scale-[0.98]"
                >
                  Book Appointment
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
