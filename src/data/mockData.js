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

// One record per doctor per clinic. A doctor who works at several clinics
// appears once for each clinic: same name, different id. Appointment
// conflicts across clinics are intentionally not checked.
export const DOCTORS = [
  // ClinicFlow Downtown (clinic-1)
  { id: 'dr-smith', name: 'Dr. Sarah Smith', departmentId: 'general', clinicId: 'clinic-1' },
  { id: 'dr-patel', name: 'Dr. Priya Patel', departmentId: 'general', clinicId: 'clinic-1' },
  { id: 'dr-wright', name: 'Dr. Thomas Wright', departmentId: 'general', clinicId: 'clinic-1' },
  { id: 'dr-jones', name: 'Dr. Marcus Jones', departmentId: 'cardiology', clinicId: 'clinic-1' },
  { id: 'dr-clarke', name: 'Dr. Benjamin Clarke', departmentId: 'cardiology', clinicId: 'clinic-1' },
  { id: 'dr-chen', name: 'Dr. Kevin Chen', departmentId: 'dental', clinicId: 'clinic-1' },
  { id: 'dr-rossi', name: 'Dr. Sofia Rossi', departmentId: 'dental', clinicId: 'clinic-1' },
  { id: 'dr-williams-downtown', name: 'Dr. Emily Williams', departmentId: 'pediatrics', clinicId: 'clinic-1' },
  { id: 'dr-rahman', name: 'Dr. Aisha Rahman', departmentId: 'pediatrics', clinicId: 'clinic-1' },
  { id: 'dr-kim', name: 'Dr. Grace Kim', departmentId: 'pediatrics', clinicId: 'clinic-1' },
  { id: 'dr-garcia', name: 'Dr. Luis Garcia', departmentId: 'orthopedics', clinicId: 'clinic-1' },
  { id: 'dr-okafor', name: 'Dr. Daniel Okafor', departmentId: 'orthopedics', clinicId: 'clinic-1' },

  { id: 'dr-bennett', name: 'Dr. James Bennett', departmentId: 'general', clinicId: 'clinic-1' },
  { id: 'dr-alvarez', name: 'Dr. Maria Alvarez', departmentId: 'general', clinicId: 'clinic-1' },
  { id: 'dr-hartley', name: 'Dr. Elizabeth Hartley', departmentId: 'cardiology', clinicId: 'clinic-1' },
  { id: 'dr-park', name: 'Dr. Jason Park', departmentId: 'cardiology', clinicId: 'clinic-1' },
  { id: 'dr-nguyen-downtown', name: 'Dr. Linh Nguyen', departmentId: 'cardiology', clinicId: 'clinic-1' },
  { id: 'dr-petrova', name: 'Dr. Nadia Petrova', departmentId: 'dental', clinicId: 'clinic-1' },
  { id: 'dr-laurent', name: 'Dr. Zoe Laurent', departmentId: 'pediatrics', clinicId: 'clinic-1' },
  { id: 'dr-turner', name: 'Dr. William Turner', departmentId: 'orthopedics', clinicId: 'clinic-1' },

  // ClinicFlow Westside (clinic-2)
  { id: 'dr-smith-westside', name: 'Dr. Sarah Smith', departmentId: 'general', clinicId: 'clinic-2' },
  { id: 'dr-brown', name: 'Dr. Olivia Brown', departmentId: 'general', clinicId: 'clinic-2' },
  { id: 'dr-hassan', name: 'Dr. Fatima Hassan', departmentId: 'general', clinicId: 'clinic-2' },
  { id: 'dr-nguyen', name: 'Dr. Linh Nguyen', departmentId: 'cardiology', clinicId: 'clinic-2' },
  { id: 'dr-fischer', name: 'Dr. Hannah Fischer', departmentId: 'cardiology', clinicId: 'clinic-2' },
  { id: 'dr-kowalski', name: 'Dr. Adam Kowalski', departmentId: 'dental', clinicId: 'clinic-2' },
  { id: 'dr-anderson', name: 'Dr. Noah Anderson', departmentId: 'dental', clinicId: 'clinic-2' },
  { id: 'dr-williams', name: 'Dr. Emily Williams', departmentId: 'pediatrics', clinicId: 'clinic-2' },
  { id: 'dr-lee', name: 'Dr. Samuel Lee', departmentId: 'pediatrics', clinicId: 'clinic-2' },
  { id: 'dr-garcia-westside', name: 'Dr. Luis Garcia', departmentId: 'orthopedics', clinicId: 'clinic-2' },
  { id: 'dr-martinez', name: 'Dr. Isabella Martinez', departmentId: 'orthopedics', clinicId: 'clinic-2' },
  { id: 'dr-moore', name: 'Dr. Ethan Moore', departmentId: 'orthopedics', clinicId: 'clinic-2' },

  { id: 'dr-mitchell', name: 'Dr. James Mitchell', departmentId: 'general', clinicId: 'clinic-2' },
  { id: 'dr-mensah', name: 'Dr. Kwame Mensah', departmentId: 'general', clinicId: 'clinic-2' },
  { id: 'dr-mehta-westside', name: 'Dr. Raj Mehta', departmentId: 'general', clinicId: 'clinic-2' },
  { id: 'dr-sullivan', name: 'Dr. Robert Sullivan', departmentId: 'cardiology', clinicId: 'clinic-2' },
  { id: 'dr-wong', name: 'Dr. Mei Wong', departmentId: 'dental', clinicId: 'clinic-2' },
  { id: 'dr-smyth', name: 'Dr. Catherine Smyth', departmentId: 'dental', clinicId: 'clinic-2' },
  { id: 'dr-adeyemi', name: 'Dr. Oluwaseun Adeyemi', departmentId: 'pediatrics', clinicId: 'clinic-2' },
  { id: 'dr-johansson', name: 'Dr. Erik Johansson', departmentId: 'orthopedics', clinicId: 'clinic-2' },

  // ClinicFlow Northside (clinic-3)
  { id: 'dr-tanaka', name: 'Dr. Hana Tanaka', departmentId: 'general', clinicId: 'clinic-3' },
  { id: 'dr-mehta', name: 'Dr. Raj Mehta', departmentId: 'general', clinicId: 'clinic-3' },
  { id: 'dr-jones-northside', name: 'Dr. Marcus Jones', departmentId: 'cardiology', clinicId: 'clinic-3' },
  { id: 'dr-ahmed', name: 'Dr. Yusuf Ahmed', departmentId: 'cardiology', clinicId: 'clinic-3' },
  { id: 'dr-petrov', name: 'Dr. Victor Petrov', departmentId: 'cardiology', clinicId: 'clinic-3' },
  { id: 'dr-chen-northside', name: 'Dr. Kevin Chen', departmentId: 'dental', clinicId: 'clinic-3' },
  { id: 'dr-dubois', name: 'Dr. Chloe Dubois', departmentId: 'dental', clinicId: 'clinic-3' },
  { id: 'dr-williams-northside', name: 'Dr. Emily Williams', departmentId: 'pediatrics', clinicId: 'clinic-3' },
  { id: 'dr-johnson', name: 'Dr. Michael Johnson', departmentId: 'pediatrics', clinicId: 'clinic-3' },
  { id: 'dr-scott', name: 'Dr. Amelia Scott', departmentId: 'pediatrics', clinicId: 'clinic-3' },
  { id: 'dr-smithson', name: 'Dr. Rachel Smithson', departmentId: 'orthopedics', clinicId: 'clinic-3' },
  { id: 'dr-schmidt', name: 'Dr. Laura Schmidt', departmentId: 'orthopedics', clinicId: 'clinic-3' },
  { id: 'dr-herrera', name: 'Dr. Ana Herrera', departmentId: 'general', clinicId: 'clinic-3' },
  { id: 'dr-novak', name: 'Dr. Peter Novak', departmentId: 'general', clinicId: 'clinic-3' },
  { id: 'dr-mccarthy', name: 'Dr. Siobhan McCarthy', departmentId: 'cardiology', clinicId: 'clinic-3' },
  { id: 'dr-iyer', name: 'Dr. Arjun Iyer', departmentId: 'dental', clinicId: 'clinic-3' },
  { id: 'dr-reyes', name: 'Dr. Jessica Reyes', departmentId: 'pediatrics', clinicId: 'clinic-3' },
  { id: 'dr-rahman-northside', name: 'Dr. Aisha Rahman', departmentId: 'pediatrics', clinicId: 'clinic-3' },
  { id: 'dr-walker', name: 'Dr. Mark Walker', departmentId: 'orthopedics', clinicId: 'clinic-3' },
  { id: 'dr-garcia-northside', name: 'Dr. Luis Garcia', departmentId: 'orthopedics', clinicId: 'clinic-3' },
];

export const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];
