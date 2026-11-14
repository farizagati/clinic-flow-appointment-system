// Medical records export. The UI only depends on these two functions, so swapping
// local generation for an API call later does not touch any component.

const MARGIN = 15;
const LINE = 6;

// ponytail: PDF is built client-side from localStorage data. When the backend exists,
// replace this body with fetch('/api/me/medical-records.pdf') -> throw if !res.ok -> res.blob()
// and drop the jspdf dependency.
export async function getMedicalRecordsPdf(user, appointments) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageBottom = doc.internal.pageSize.getHeight() - MARGIN;
  let y = MARGIN;

  const ensureSpace = (height) => {
    if (y + height > pageBottom) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const write = (text, { size = 10, bold = false, x = MARGIN, width = pageWidth - MARGIN * 2 } = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text), width);
    ensureSpace(lines.length * LINE);
    doc.text(lines, x, y);
    y += lines.length * LINE;
  };

  write('ClinicFlow - Medical Records', { size: 16, bold: true });
  write(`Generated ${new Date().toLocaleString()}`, { size: 9 });
  y += LINE;

  write('Patient Information', { size: 12, bold: true });
  // Same fallbacks UserSettings displays, so the PDF matches the screen.
  [
    ['Name', user.name],
    ['Email', user.email],
    ['Gender', user.gender || 'Female'],
    ['Date of Birth', user.dob || '12 October 1985'],
    ['Blood Type', user.bloodType || 'O Negative'],
    ['Address', user.address || '482 Clinical Heights Parkway, Suite 300, San Francisco, CA 94107'],
    ['Emergency Contact', `${user.emergencyName || 'Robert Sterling (Spouse)'}, ${user.emergencyPhone || '+1 (555) 987-6543'}`],
  ].forEach(([label, value]) => write(`${label}: ${value || '-'}`));
  y += LINE;

  write('Appointment History', { size: 12, bold: true });
  if (appointments.length === 0) {
    write('No appointments on record');
  } else {
    const cols = [
      ['Date', 'date', 24], ['Time', 'time', 20], ['Clinic', 'clinic', 40],
      ['Department', 'department', 32], ['Doctor', 'doctor', 38], ['Status', 'status', 26],
    ];
    const row = (cells, bold) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(9);
      const wrapped = cells.map((c, i) => doc.splitTextToSize(String(c ?? '-'), cols[i][2] - 2));
      const height = Math.max(...wrapped.map((w) => w.length)) * 5 + 1;
      ensureSpace(height);
      let x = MARGIN;
      wrapped.forEach((w, i) => {
        doc.text(w, x, y);
        x += cols[i][2];
      });
      y += height;
    };
    row(cols.map((c) => c[0]), true);
    [...appointments]
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .forEach((a) => row(cols.map((c) => a[c[1]])));
  }

  return doc.output('blob');
}

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
