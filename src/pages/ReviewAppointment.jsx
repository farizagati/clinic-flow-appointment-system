import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ReviewAppointment() {
  const { currentUser, bookAppointment } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If we arrived here without state, go back
  useEffect(() => {
    if (!location.state) {
      navigate('/book-appointment');
    }
  }, [location, navigate]);

  if (!location.state) return null;

  const {
    clinic, clinicName,
    department, departmentName,
    doctor, doctorName,
    date,
    time,
    notes,
  } = location.state;

  const handleEditDetails = () => {
    navigate('/book-appointment', { state: location.state });
  };

  const handleConfirmBooking = () => {
    setError('');
    setIsSubmitting(true);

    try {
      bookAppointment({
        clinic: clinicName,
        department: departmentName,
        doctor: doctorName,
        date,
        time,
        notes,
      });

      setSuccess('Appointment successfully booked!');
      
      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="review-appointment-page" data-testid="review-appointment-page" className="flex-grow flex flex-col w-full h-full">
      <main className="flex-grow flex flex-col items-center justify-center p-md md:p-xl w-full max-w-container-max mx-auto">
        <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-outline-variant/30 overflow-hidden relative z-[10]">
          
          <div className="bg-surface-container-low px-lg py-xl border-b border-outline-variant/30 text-center">
            <h1 id="review-title" data-testid="review-title" className="font-headline-lg text-headline-lg text-on-surface mb-2">Review Your Appointment Details</h1>
            <p className="font-body-md text-body-md text-secondary">Please confirm the information below before finalizing your booking.</p>
          </div>

          <div className="p-lg md:p-xl grid grid-cols-1 md:grid-cols-2 gap-xl">
            {error && (
              <div id="appointment-error" data-testid="appointment-error" className="col-span-1 md:col-span-2 mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-sm">
                {error}
              </div>
            )}

            {success && (
              <div id="appointment-success" data-testid="appointment-success" className="col-span-1 md:col-span-2 mb-md p-sm bg-primary-container/20 text-on-primary-container rounded-lg font-body-sm">
                {success}
              </div>
            )}

            {/* Patient Info */}
            <div className="space-y-md">
              <div className="flex items-center gap-2 mb-sm text-primary">
                <span className="material-symbols-outlined">person</span>
                <h2 className="font-headline-sm text-headline-sm">Patient Information</h2>
              </div>
              <div className="bg-surface rounded-lg p-md border border-outline-variant/20 shadow-sm space-y-sm">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Full Name</span>
                  <span className="font-body-lg text-body-lg text-on-surface" id="review-patient-name" data-testid="review-patient-name">{currentUser?.name}</span>
                </div>
                <div className="h-px bg-outline-variant/20 w-full"></div>
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Email Address</span>
                  <span className="font-body-md text-body-md text-on-surface" id="review-patient-email" data-testid="review-patient-email">{currentUser?.email}</span>
                </div>
              </div>
            </div>

            {/* Clinical Details */}
            <div className="space-y-md">
              <div className="flex items-center gap-2 mb-sm text-primary">
                <span className="material-symbols-outlined">stethoscope</span>
                <h2 className="font-headline-sm text-headline-sm">Clinical Details</h2>
              </div>
              <div className="bg-surface rounded-lg p-md border border-outline-variant/20 shadow-sm space-y-sm">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Clinic</span>
                  <span className="font-body-md text-body-md text-on-surface inline-flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded" id="review-clinic" data-testid="review-clinic">{clinicName}</span>
                </div>
                <div className="h-px bg-outline-variant/20 w-full"></div>
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Department</span>
                  <span className="font-body-md text-body-md text-on-surface inline-flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded" id="review-department" data-testid="review-department">{departmentName}</span>
                </div>
                <div className="h-px bg-outline-variant/20 w-full"></div>
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Attending Physician</span>
                  <span className="font-body-md text-body-md text-on-surface" id="review-doctor" data-testid="review-doctor">{doctorName}</span>
                </div>
                <div className="h-px bg-outline-variant/20 w-full"></div>
                <div className="flex items-start gap-md">
                  <div className="flex-1">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Date</span>
                    <span className="font-body-md text-body-md text-on-surface flex items-center gap-1" id="review-date" data-testid="review-date">
                      <span className="material-symbols-outlined text-sm text-secondary">calendar_today</span> 
                      {date}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Time</span>
                    <span className="font-body-md text-body-md text-on-surface flex items-center gap-1" id="review-time" data-testid="review-time">
                      <span className="material-symbols-outlined text-sm text-secondary">schedule</span> 
                      {time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status / Documents */}
            <div className="md:col-span-2 space-y-md pt-md border-t border-outline-variant/30">
              <div className="flex items-center gap-2 mb-sm text-primary">
                <span className="material-symbols-outlined">assignment</span>
                <h2 className="font-headline-sm text-headline-sm">Visit Context</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-md">
                <div className="flex-1 bg-surface rounded-lg p-md border border-outline-variant/20 shadow-sm">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block mb-1">Reason / Notes</span>
                  <span className="font-body-md text-body-md text-on-surface" id="review-notes" data-testid="review-notes">{notes || 'None provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="bg-surface-container px-lg py-xl border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-end gap-md">
            <button 
              onClick={handleEditDetails}
              disabled={isSubmitting || !!success}
              id="edit-booking"
              data-testid="edit-booking"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-outline font-label-md text-label-md text-on-surface bg-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B14F]/40 shadow-sm disabled:opacity-50" 
            >
              Edit Details
            </button>
            <button 
              onClick={handleConfirmBooking}
              disabled={isSubmitting || !!success}
              id="confirm-booking"
              data-testid="confirm-booking"
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-label-md text-label-md text-white bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B14F]/40 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 disabled:opacity-50" 
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Confirm & Book Appointment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
