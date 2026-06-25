export const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'confirmed':
      return 'status-confirmed';
    case 'pending':
      return 'status-pending';
    case 'cancelled':
      return 'status-cancelled';
    case 'scheduled':
      return 'status-scheduled';
    default:
      return 'status-pending';
  }
};

export const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'confirmed':
      return 'check_circle';
    case 'pending':
      return 'schedule';
    case 'cancelled':
      return 'cancel';
    case 'scheduled':
      return 'event';
    default:
      return 'schedule';
  }
};
