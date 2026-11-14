import React from 'react';

const PAGES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    body: 'ClinicFlow is a demo environment. All data you enter is stored only in your browser localStorage and is never sent to a server. Use Purge Data in Settings to remove it.',
  },
  'terms-of-service': {
    title: 'Terms of Service',
    body: 'ClinicFlow is a demo application for test automation practice. It does not provide real medical services, and appointments booked here are not real.',
  },
  'contact-support': {
    title: 'Contact Support',
    body: 'This demo environment has no support team. If something looks broken, reset the app with Purge Data in Settings and try again.',
  },
  'help-center': {
    title: 'Help Center',
    body: 'Register or log in, then use Book Appointment to pick a clinic, department, doctor, date and time. Review and confirm the booking, then track it under My Appointments.',
  },
};

export default function InfoPage({ slug }) {
  const { title, body } = PAGES[slug];

  return (
    <div id="info-page" data-testid="info-page" className="max-w-container-max mx-auto px-lg lg:px-xl py-xxl space-y-md">
      <h1 id="info-title" data-testid="info-title" className="font-headline-md text-headline-md text-on-surface">
        {title}
      </h1>
      <p id="info-body" data-testid="info-body" className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
        {body}
      </p>
    </div>
  );
}
