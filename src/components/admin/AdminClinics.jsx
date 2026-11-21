import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FieldError } from '../FieldError';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

function ClinicForm({ clinic, onClose, onSaved }) {
  const { addClinic, updateClinic } = useAuth();
  const isEdit = !!clinic;
  const prefix = isEdit ? 'edit-clinic' : 'add-clinic';
  const inputId = isEdit ? 'edit-clinic-name-input' : 'new-clinic-name-input';
  const [name, setName] = useState(clinic?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        updateClinic(clinic.id, name);
        onSaved(`Clinic "${name.trim()}" updated`);
      } else {
        addClinic(name);
        onSaved(`Clinic "${name.trim()}" added`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Clinic' : 'Add New Clinic'} testId={`${prefix}-modal`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="p-lg flex flex-col gap-md" data-testid={`${prefix}-form`}>
        <div>
          <div className="floating-input relative">
            <input
              type="text"
              id={inputId}
              data-testid={inputId}
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              className={`w-full h-14 px-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary transition-colors peer ${error ? 'input-error' : ''}`}
              placeholder=" "
            />
            <label htmlFor={inputId} className="absolute left-3 top-0 -translate-y-1/2 scale-85 bg-surface-container-lowest px-1 rounded-sm font-body-md text-body-md text-on-surface-variant peer-focus:text-primary transition-all pointer-events-none z-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:scale-85">
              Clinic Name *
            </label>
          </div>
          <FieldError message={error} fieldId={inputId} />
        </div>
        <div className="flex justify-end gap-sm mt-sm">
          <button type="button" onClick={onClose} className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors" data-testid={`${prefix}-cancel`}>Cancel</button>
          <button type="submit" className="px-4 py-2 font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint rounded-lg transition-colors" data-testid={`${prefix}-submit`}>
            {isEdit ? 'Save Changes' : 'Save Clinic'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminClinics({ onNotify }) {
  const { clinics, doctors, deleteClinic, isSeedClinic } = useAuth();
  // form: null | { clinic? }
  const [form, setForm] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const doctorCount = (clinicId) => doctors.filter((d) => d.clinicId === clinicId).length;

  const requestDelete = (clinic) => {
    const count = doctorCount(clinic.id);
    if (count > 0) {
      onNotify('error', `Cannot delete "${clinic.name}": ${count} doctor${count === 1 ? ' is' : 's are'} assigned to it.`);
      return;
    }
    onNotify(null);
    setPendingDelete(clinic);
  };

  const confirmDelete = () => {
    try {
      deleteClinic(pendingDelete.id);
      onNotify('success', `Clinic "${pendingDelete.name}" deleted`);
    } catch (err) {
      onNotify('error', err.message);
    }
    setPendingDelete(null);
  };

  return (
    <section id="clinics-section" data-testid="admin-clinics-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm gap-md">
        <h2 data-testid="admin-clinics-title" className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">local_hospital</span>
          Clinics
        </h2>
        <button
          id="admin-add-clinic-btn"
          data-testid="admin-add-clinic-btn"
          onClick={() => {
            onNotify(null);
            setForm({});
          }}
          className="flex items-center gap-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
          Add Clinic
        </button>
      </div>

      <div className="overflow-x-auto flex-grow mb-md">
        <table id="admin-clinics-table" data-testid="admin-clinics-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
              <th className="py-sm px-md font-semibold whitespace-nowrap">ID</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Clinic Name</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Doctors</th>
              <th className="py-sm px-md font-semibold text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-clinics-list" data-testid="admin-clinics-list" className="font-body-sm text-body-sm text-on-surface">
            {clinics.map((d) => (
              <tr
                key={d.id}
                id={`admin-clinic-row-${d.id}`}
                data-testid={`clinic-item-${d.id}`}
                className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <td className="py-md px-md font-medium">{d.id}</td>
                <td className="py-md px-md" data-testid={`clinic-name-${d.id}`}>{d.name}</td>
                <td className="py-md px-md" data-testid={`clinic-doctor-count-${d.id}`}>{doctorCount(d.id)}</td>
                <td className="py-md px-md text-right whitespace-nowrap">
                  {isSeedClinic(d.id) ? (
                    <span data-testid={`clinic-builtin-${d.id}`} className="text-secondary font-label-sm text-label-sm">Built-in</span>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <button
                        data-testid={`admin-edit-clinic-${d.id}`}
                        onClick={() => {
                          onNotify(null);
                          setForm({ clinic: d });
                        }}
                        className="text-primary hover:bg-primary-container/20 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-primary"
                      >
                        Edit
                      </button>
                      <button
                        data-testid={`admin-delete-clinic-${d.id}`}
                        onClick={() => requestDelete(d)}
                        className="text-error hover:bg-error-container/50 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <ClinicForm
          clinic={form.clinic}
          onClose={() => setForm(null)}
          onSaved={(message) => {
            setForm(null);
            onNotify('success', message);
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete Clinic"
          message={`Delete clinic "${pendingDelete.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </section>
  );
}
