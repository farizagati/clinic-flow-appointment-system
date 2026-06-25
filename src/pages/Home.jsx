import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/book-appointment');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div id="home-page" data-testid="home-page" className="flex-grow">
      {/* Hero Section */}
      <section className="relative pt-xxl pb-xxl overflow-hidden bg-gradient-to-br from-surface-container-low to-surface-container">
        <div className="max-w-container-max mx-auto px-lg lg:px-xl grid md:grid-cols-2 gap-xl items-center relative z-10">
          <div className="space-y-lg">
            <div className="inline-flex items-center gap-sm bg-primary-container/10 text-primary px-sm py-xs rounded-full font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Trusted by 500+ Clinics
            </div>
            
            <h1 id="home-title" data-testid="home-title" className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Your Health,<br /><span className="text-primary">Simplified.</span>
            </h1>
            
            <p id="home-description" data-testid="home-description" className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              Experience seamless healthcare management. Book, track, and manage your clinical appointments with modern precision and clarity.
            </p>
            
            <div id="home-cta-container" data-testid="home-cta-container" className="flex flex-col sm:flex-row gap-md pt-sm">
              <button 
                id="home-book-cta" 
                data-testid="home-book-cta" 
                onClick={handleCtaClick}
                className="px-lg py-md bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] transition-all active:scale-95 flex items-center justify-center gap-sm"
              >
                {currentUser 
                  ? (currentUser.role === 'admin' ? 'Go to Admin Dashboard' : 'Book Your First Appointment') 
                  : 'Book Your First Appointment'
                }
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="px-lg py-md bg-surface text-on-surface border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
            <img 
              alt="A bright, modern medical clinic reception area" 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-bXZntupP4q5jLc1-49j7PDSSt1Ep0T4F7ibjbzL8B3-HhkPLVia3mol5UZqVyyvkzNAtm1cqOEa7R3ROz6FyILIs0GsBCtwTxeFQPx450yErst39EsI-MvjuWAeQFgkhZJcS_qtgrz13whH2Dmiw5M-20pzuyDiU8qlR1vsUtllkO55zvTzAJ5-zGTXM8p0z9Zn_48KNkDw0bEP5yCsWtakwf8jShm0--Hnk_eIuUzC9YPpkWrkmqL6HWIqpbRdfN3-IVZlYZh16"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="home-features" data-testid="home-features" className="py-xxl bg-background">
        <div className="max-w-container-max mx-auto px-lg lg:px-xl">
          <div className="text-center mb-xl space-y-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface">Application Features</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">Three simple steps to secure your healthcare consultation. Designed for speed, reliability, and peace of mind.</p>
          </div>
          
          <ul className="grid md:grid-cols-3 gap-lg list-none p-0">
            {/* Feature 1 */}
            <li id="feature-offline" data-testid="feature-offline" className="bg-surface p-xl rounded-2xl border border-outline-variant hover:border-primary transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.08)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center mb-lg text-primary relative z-10 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[28px]">search</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm relative z-10">1. Find a Specialist</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10">Search through our verified network of healthcare professionals by department, location, or availability.</p>
            </li>
            
            {/* Feature 2 */}
            <li id="feature-roles" data-testid="feature-roles" className="bg-surface p-xl rounded-2xl border border-outline-variant hover:border-primary transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.08)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center mb-lg text-primary relative z-10 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[28px]">schedule</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm relative z-10">2. Choose a Time</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10">View real-time availability and select a time slot that fits seamlessly into your busy schedule.</p>
            </li>
            
            {/* Feature 3 */}
            <li id="feature-booking" data-testid="feature-booking" className="bg-surface p-xl rounded-2xl border border-outline-variant hover:border-primary transition-colors shadow-[0px_4px_12px_rgba(0,0,0,0.08)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center mb-lg text-primary relative z-10 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm relative z-10">3. Secure Your Slot</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10">Confirm your details with a single click. Receive instant notifications and calendar invites.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
