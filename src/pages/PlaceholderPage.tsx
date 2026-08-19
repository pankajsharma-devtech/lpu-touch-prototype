import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import './PlaceholderPage.css';

export default function PlaceholderPage({ title, showNav = true }: { title: string; showNav?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className={`screen ${showNav ? '' : 'screen--no-nav'}`}>
      <AppHeader title={title} onBack={showNav ? undefined : () => navigate(-1)} />
      <div className="placeholder-body">
        <Construction size={48} color="#e8783f" strokeWidth={1.5} />
        <p>
          <strong>{title}</strong> is a demo placeholder in this prototype.
        </p>
        <span>This screen isn't part of the core Mess Scanner demonstration flow.</span>
      </div>
      {showNav && <BottomNavigation />}
    </div>
  );
}
