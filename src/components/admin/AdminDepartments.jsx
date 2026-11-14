import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FieldError } from '../FieldError';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

function DepartmentForm({ department, onClose, onSaved }) {
  const { addDepartment, updateDepartment } = useAuth();
  const isEdit = !!department;
  const prefix = isEdit ? 'edit-dept' : 'add-dept';
  const inputId = isEdit ? 'edit-dept-name-input' : 'new-dept-name-input';
  const [name, setName] = useState(department?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        updateDepartment(department.id, name);
        onSaved(`Department "${name.trim()}" updated`);
      } else {
        addDepartment(name);
        onSaved(`Department "${name.trim()}" added`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Department' : 'Add New Department'} testId={`${prefix}-modal`} onClose={onClose}>
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
              Department Name *
            </label>
          </div>
          <FieldError message={error} fieldId={inputId} />
        </div>
        <div className="flex justify-end gap-sm mt-sm">
          <button type="button" onClick={onClose} className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors" data-testid={`${prefix}-cancel`}>Cancel</button>
          <button type="submit" className="px-4 py-2 font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint rounded-lg transition-colors" data-testid={`${prefix}-submit`}>
            {isEdit ? 'Save Changes' : 'Save Department'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminDepartments({ onNotify }) {
  const { departments, doctors, deleteDepartment, isSeedDepartment } = useAuth();
  // form: null | { department? }
  const [form, setForm] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const doctorCount = (deptId) => doctors.filter((d) => d.departmentId === deptId).length;

  const requestDelete = (dept) => {
    const count = doctorCount(dept.id);
    if (count > 0) {
      onNotify('error', `Cannot delete "${dept.name}": ${count} doctor${count === 1 ? ' is' : 's are'} assigned to it.`);
      return;
    }
    onNotify(null);
    setPendingDelete(dept);
  };

  const confirmDelete = () => {
    try {
      deleteDepartment(pendingDelete.id);
      onNotify('success', `Department "${pendingDelete.name}" deleted`);
    } catch (err) {
      onNotify('error', err.message);
    }
    setPendingDelete(null);
  };

  return (
    <section id="departments-section" data-testid="admin-departments-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm gap-md">
        <h2 data-testid="admin-departments-title" className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">domain</span>
          Departments
        </h2>
        <button
          id="admin-add-dept-btn"
          data-testid="admin-add-dept-btn"
          onClick={() => {
            onNotify(null);
            setForm({});
          }}
          className="flex items-center gap-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
          Add Department
        </button>
      </div>

      <div className="overflow-x-auto flex-grow mb-md">
        <table id="admin-depts-table" data-testid="admin-depts-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
              <th className="py-sm px-md font-semibold whitespace-nowrap">ID</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Department Name</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Doctors</th>
              <th className="py-sm px-md font-semibold text-right whitespace-nowrap">Actions</th>
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
                <td className="py-md px-md" data-testid={`dept-name-${d.id}`}>{d.name}</td>
                <td className="py-md px-md" data-testid={`dept-doctor-count-${d.id}`}>{doctorCount(d.id)}</td>
                <td className="py-md px-md text-right whitespace-nowrap">
                  {isSeedDepartment(d.id) ? (
                    <span data-testid={`dept-builtin-${d.id}`} className="text-secondary font-label-sm text-label-sm">Built-in</span>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <button
                        data-testid={`admin-edit-dept-${d.id}`}
                        onClick={() => {
                          onNotify(null);
                          setForm({ department: d });
                        }}
                        className="text-primary hover:bg-primary-container/20 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-primary"
                      >
                        Edit
                      </button>
                      <button
                        data-testid={`admin-delete-dept-${d.id}`}
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
        <DepartmentForm
          department={form.department}
          onClose={() => setForm(null)}
          onSaved={(message) => {
            setForm(null);
            onNotify('success', message);
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete Department"
          message={`Delete department "${pendingDelete.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </section>
  );
}
