export const CLINICS = [
  { id: 'clinic-1', name: 'ClinicFlow Downtown' },
  { id: 'clinic-2', name: 'ClinicFlow Westside' },
  { id: 'clinic-3', name: 'ClinicFlow Northside' },
];

export const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dental', name: 'Dental' },
  { id: 'general', name: 'General Practice' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'orthopedics', name: 'Orthopedics' },
];

export const DOCTORS = [
  { id: 'dr-smith', name: 'Dr. Sarah Smith', departmentId: 'general', clinicId: 'clinic-1' },
  { id: 'dr-jones', name: 'Dr. Marcus Jones', departmentId: 'cardiology', clinicId: 'clinic-1' },
  { id: 'dr-williams', name: 'Dr. Emily Williams', departmentId: 'pediatrics', clinicId: 'clinic-2' },
];

export const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];
