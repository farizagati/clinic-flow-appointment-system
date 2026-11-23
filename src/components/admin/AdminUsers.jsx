import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FieldError } from '../FieldError';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INPUT_CLASS = 'w-full h-14 px-4 bg-transparent border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary transition-colors';
const FLOATING_LABEL_CLASS = 'absolute left-3 top-0 -translate-y-1/2 scale-85 bg-surface-container-lowest px-1 rounded-sm font-body-md text-body-md text-on-surface-variant peer-focus:text-primary transition-all pointer-events-none z-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-focus:top-0 peer-focus:scale-85';
const SELECT_LABEL_CLASS = 'absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant transition-all pointer-events-none px-1 rounded-sm';

function TextField({ id, label, type = 'text', value, onChange, error, autoFocus }) {
  return (
    <div>
      <div className="floating-input relative">
        <input
          type={type}
          id={id}
          data-testid={id}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT_CLASS} peer ${error ? 'input-error' : ''}`}
          placeholder=" "
        />
        <label htmlFor={id} className={FLOATING_LABEL_CLASS}>{label}</label>
      </div>
      <FieldError message={error} fieldId={id} />
    </div>
  );
}

function UserForm({ user, onClose, onSaved }) {
  const { currentUser, addUser, updateUser } = useAuth();
  const isEdit = !!user;
  const isSelf = isEdit && user.id === currentUser?.id;
  const prefix = isEdit ? 'edit-user' : 'add-user';
  const fieldPrefix = isEdit ? 'edit-user' : 'new-user';
  const ids = {
    name: `${fieldPrefix}-name-input`,
    email: `${fieldPrefix}-email-input`,
    password: `${fieldPrefix}-password-input`,
    role: `${fieldPrefix}-role-select`,
  };

  const [values, setValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'member',
  });
  const [errors, setErrors] = useState({});

  const setField = (field) => (value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = 'Full name is required';
    if (!values.email.trim()) next.email = 'Email address is required';
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Please enter a valid email address';
    if (!isEdit && !values.password) next.password = 'Password is required';
    else if (values.password && values.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    try {
      if (isEdit) {
        updateUser(user.id, values);
        onSaved(`User "${values.name.trim()}" updated`);
      } else {
        addUser(values);
        onSaved(`User "${values.name.trim()}" added`);
      }
    } catch (err) {
      setErrors({ email: err.message });
    }
  };

  return (
    <Modal title={isEdit ? 'Edit User' : 'Add New User'} testId={`${prefix}-modal`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="p-lg flex flex-col gap-md" data-testid={`${prefix}-form`}>
        <TextField id={ids.name} label="Full Name *" value={values.name} onChange={setField('name')} error={errors.name} autoFocus />
        <TextField id={ids.email} label="Email Address *" type="email" value={values.email} onChange={setField('email')} error={errors.email} />
        <TextField
          id={ids.password}
          label={isEdit ? 'New Password (leave blank to keep)' : 'Password *'}
          type="password"
          value={values.password}
          onChange={setField('password')}
          error={errors.password}
        />
        <div>
          <div className="floating-input relative">
            <select
              id={ids.role}
              data-testid={ids.role}
              value={values.role}
              disabled={isSelf}
              onChange={(e) => setField('role')(e.target.value)}
              aria-describedby={isSelf ? `${ids.role}-hint` : undefined}
              className={`${INPUT_CLASS} appearance-none has-value disabled:opacity-60`}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor={ids.role} className={SELECT_LABEL_CLASS}>Role *</label>
          </div>
          {isSelf && (
            <p id={`${ids.role}-hint`} data-testid={`${ids.role}-hint`} className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              You cannot change your own role.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-sm mt-sm">
          <button type="button" onClick={onClose} className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors" data-testid={`${prefix}-cancel`}>Cancel</button>
          <button type="submit" className="px-4 py-2 font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint rounded-lg transition-colors" data-testid={`${prefix}-submit`}>
            {isEdit ? 'Save Changes' : 'Save User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminUsers({ onNotify }) {
  const { users, currentUser, deleteUser } = useAuth();
  // form: null | { user? }
  const [form, setForm] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const visibleUsers = query
    ? users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
    : users;

  const confirmDelete = () => {
    try {
      deleteUser(pendingDelete.id);
      onNotify('success', `User "${pendingDelete.name}" deleted`);
    } catch (err) {
      onNotify('error', err.message);
    }
    setPendingDelete(null);
  };

  return (
    <section id="users-section" data-testid="admin-users-section" className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-md border-b border-surface-variant pb-sm gap-md">
        <h2 data-testid="admin-users-title" className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">group</span>
          Registered Users
        </h2>
        <div className="flex flex-col sm:flex-row gap-sm sm:items-center">
          <input
            type="search"
            data-testid="admin-users-search"
            aria-label="Search users"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 px-4 py-2 border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 bg-surface font-body-sm text-body-sm text-on-surface"
          />
          <button
            id="admin-add-user-btn"
            data-testid="admin-add-user-btn"
            onClick={() => {
              onNotify(null);
              setForm({});
            }}
            className="flex items-center justify-center gap-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow mb-md">
        <table id="admin-users-table" data-testid="admin-users-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant uppercase tracking-wider bg-surface-container-low">
              <th className="py-sm px-md font-semibold whitespace-nowrap">Name</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Email</th>
              <th className="py-sm px-md font-semibold whitespace-nowrap">Role</th>
              <th className="py-sm px-md font-semibold text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-users-list" data-testid="admin-users-list" className="font-body-sm text-body-sm text-on-surface">
            {visibleUsers.length === 0 && (
              <tr>
                <td colSpan="4" data-testid="admin-no-matching-users" className="p-xl text-center font-body-md text-secondary">
                  No matching users found.
                </td>
              </tr>
            )}
            {visibleUsers.map((u) => {
              const isSelf = u.id === currentUser?.id;
              return (
                <tr
                  key={u.id}
                  id={`admin-user-row-${u.id}`}
                  data-testid={`user-item-${u.id}`}
                  className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  <td className="py-md px-md font-medium" data-testid={`user-name-${u.id}`}>{u.name}</td>
                  <td className="py-md px-md" data-testid={`user-email-${u.id}`}>{u.email}</td>
                  <td className="py-md px-md">
                    <span data-testid={`user-role-${u.id}`} className="font-label-sm text-label-sm px-2 py-1 bg-surface-variant text-on-surface-variant rounded-full">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-md px-md text-right whitespace-nowrap">
                    <div className="flex gap-2 justify-end items-center">
                      {isSelf && (
                        <span data-testid={`user-self-${u.id}`} className="text-secondary font-label-sm text-label-sm">You</span>
                      )}
                      <button
                        data-testid={`admin-edit-user-${u.id}`}
                        onClick={() => {
                          onNotify(null);
                          setForm({ user: u });
                        }}
                        className="text-primary hover:bg-primary-container/20 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-primary"
                      >
                        Edit
                      </button>
                      {!isSelf && (
                        <button
                          data-testid={`admin-delete-user-${u.id}`}
                          onClick={() => {
                            onNotify(null);
                            setPendingDelete(u);
                          }}
                          className="text-error hover:bg-error-container/50 px-3 py-1 rounded transition-colors font-label-sm text-label-sm border border-error"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {form && (
        <UserForm
          user={form.user}
          onClose={() => setForm(null)}
          onSaved={(message) => {
            setForm(null);
            onNotify('success', message);
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete User"
          message={`Delete user "${pendingDelete.name}" (${pendingDelete.email})? Their existing appointments are kept. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </section>
  );
}
