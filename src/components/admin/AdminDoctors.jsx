import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FieldError } from '../FieldError';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

const INPUT_CLASS = 'w-full h-14 px-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary transition-colors';
const SELECT_LABEL_CLASS = 'absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm';

function DoctorForm({ doctor, onClose, onSaved }) {
  const { departments, clinics, addDoctor, updateDoctor } = useAuth();
  const isEdit = !!doctor;
  const prefix = isEdit ? 'edit-doc' : 'add-doc';
  const fieldPrefix = isEdit ? 'edit-doc' : 'new-doc';
  const nameId = `${fieldPrefix}-name-input`;
  const deptId = `${fieldPrefix}-dept-select`;
  const clinicId = `${fieldPrefix}-clinic-select`;

  const [name, setName] = useState(doctor?.name || '');
  const [department, setDepartment] = useState(doctor?.departmentId || '');
  const [clinic, setClinic] = useState(doctor?.clinicId || '');
  const [errors, setErrors] = useState({});

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: '' }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = 'Doctor name is required';
    if (!department) next.department = 'Please select a department';
    if (!clinic) next.clinic = 'Please select a clinic';
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    try {
      if (isEdit) {
        updateDoctor(doctor.id, name, department, clinic);
        onSaved(`Doctor "${name.trim()}" updated`);
      } else {
        addDoctor(name, department, clinic);
        onSaved(`Doctor "${name.trim()}" added`);
      }
    } catch (err) {
      setErrors({ name: err.message });
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Doctor' : 'Add New Doctor'} testId={`${prefix}-modal`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="p-lg flex flex-col gap-md" data-testid={`${prefix}-form`}>
        <div>
          <div className="floating-input relative">
            <input
              type="text"
              id={nameId}
              data-testid={nameId}
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              className={`${INPUT_CLASS} peer ${errors.name ? 'input-error' : ''}`}
              placeholder=" "
            />
            <label htmlFor={nameId} className="absolute left-3 top-0 -translate-y-1/2 scale-85 bg-surface-container-lowest px-1 rounded-sm font-body-md text-body-md text-on-surface-variant peer-focus:text-primary transition-all pointer-events-none z-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:scale-85">
              Doctor Full Name *
            </label>
          </div>
          <FieldError message={errors.name} fieldId={nameId} />
        </div>

        <div>
          <div className="floating-input relative">
            <select
              id={deptId}
              data-testid={deptId}
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                clearError('department');
              }}
              aria-invalid={!!errors.department}
              aria-describedby={errors.department ? `${deptId}-error` : undefined}
              className={`${INPUT_CLASS} appearance-none ${department ? 'has-value' : ''} ${errors.department ? 'input-error' : ''}`}
            >
              <option value="" disabled hidden></option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <label htmlFor={deptId} className={SELECT_LABEL_CLASS}>Select Department *</label>
          </div>
          <FieldError message={errors.department} fieldId={deptId} />
        </div>

        <div>
          <div className="floating-input relative">
            <select
              id={clinicId}
              data-testid={clinicId}
              value={clinic}
              onChange={(e) => {
                setClinic(e.target.value);
                clearError('clinic');
              }}
              aria-invalid={!!errors.clinic}
              aria-describedby={errors.clinic ? `${clinicId}-error` : undefined}
              className={`${INPUT_CLASS} appearance-none ${clinic ? 'has-value' : ''} ${errors.clinic ? 'input-error' : ''}`}
            >
              <option value="" disabled hidden></option>
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <label htmlFor={clinicId} className={SELECT_LABEL_CLASS}>Select Clinic *</label>
          </div>
          <FieldError message={errors.clinic} fieldId={clinicId} />
        </div>

        <div className="flex justify-end gap-sm mt-sm">
          <button type="button" onClick={onClose} className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors" data-testid={`${prefix}-cancel`}>Cancel</button>
          <button type="submit" className="px-4 py-2 font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint rounded-lg transition-colors" data-testid={`${prefix}-submit`}>
            {isEdit ? 'Save Changes' : 'Save Doctor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminDoctors({ onNotify }) {
  const { doctors, departments, clinics, deleteDoctor, isSeedDoctor } = useAuth();
  // form: null | { doctor? }
  const [form, setForm] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const visibleDoctors = query ? doctors.filter((d) => d.name.toLowerCase().includes(query)) : doctors;

  const confirmDelete = () => {
    try {
      deleteDoctor(pendingDelete.id);
      onNotify('success', `Doctor "${pendingDelete.name}" deleted`);
    } catch (err) {
      onNotify('error', err.message);
    }
    setPendingDelete(null);
  };

  return (
    <section id="doctors-section" data-testid="admin-doctors-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-md border-b border-surface-variant pb-sm gap-md">
        <h2 data-testid="admin-doctors-title" className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">medical_services</span>
          Doctors
        </h2>
        <div className="flex flex-col sm:flex-row gap-sm sm:items-center">
          <input
            type="search"
            data-testid="admin-doctors-search"
            aria-label="Search doctors by name"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 px-4 py-2 border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 bg-surface font-body-sm text-body-sm text-on-surface"
          />
          <button
            id="admin-add-doc-btn"
            data-testid="admin-add-doc-btn"
            onClick={() => {
              onNotify(null);
              setForm({});
            }}
            className="flex items-center justify-center gap-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
            Add Doctor
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow mb-md">
        <table id="admin-doctors-table" data-testid="admin-doctors-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
              <th className="py-sm px-md font-semibold whitespace-nowrap">Doctor Name</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Department</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Clinic</th>
              <th className="py-sm px-md font-semibold text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-doctors-list" data-testid="admin-doctors-list" className="font-body-sm text-body-sm text-on-surface">
            {visibleDoctors.length === 0 && (
              <tr>
                <td colSpan="4" data-testid="admin-no-matching-doctors" className="p-xl text-center font-body-md text-secondary">
                  No matching doctors found.
                </td>
              </tr>
            )}
            {visibleDoctors.map((doc) => {
              const dept = departments.find((d) => d.id === doc.departmentId);
              const clinic = clinics.find((c) => c.id === doc.clinicId);
              return (
                <tr
                  key={doc.id}
                  id={`admin-doc-row-${doc.id}`}
                  data-testid={`doc-item-${doc.id}`}
                  className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  <td className="py-md px-md font-medium" data-testid={`doc-name-${doc.id}`}>{doc.name}</td>
                  <td className="py-md px-md" data-testid={`doc-dept-${doc.id}`}>{dept ? dept.name : doc.departmentId}</td>
                  <td className="py-md px-md" data-testid={`doc-clinic-${doc.id}`}>{clinic ? clinic.name : doc.clinicId}</td>
                  <td className="py-md px-md text-right whitespace-nowrap">
                    {isSeedDoctor(doc.id) ? (
                      <span data-testid={`doc-builtin-${doc.id}`} className="text-secondary font-label-sm text-label-sm">Built-in</span>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button
                          data-testid={`admin-edit-doc-${doc.id}`}
                          onClick={() => {
                            onNotify(null);
                            setForm({ doctor: doc });
                          }}
                          className="text-primary hover:bg-primary-container/20 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-primary"
                        >
                          Edit
                        </button>
                        <button
                          data-testid={`admin-delete-doc-${doc.id}`}
                          onClick={() => {
                            onNotify(null);
                            setPendingDelete(doc);
                          }}
                          className="text-error hover:bg-error-container/50 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-error"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {form && (
        <DoctorForm
          doctor={form.doctor}
          onClose={() => setForm(null)}
          onSaved={(message) => {
            setForm(null);
            onNotify('success', message);
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete Doctor"
          message={`Delete doctor "${pendingDelete.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </section>
  );
}
