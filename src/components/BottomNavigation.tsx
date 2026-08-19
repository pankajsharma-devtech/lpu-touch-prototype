import { LayoutGrid, Newspaper, ClipboardEdit, Building2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNavigation.css';

const ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid, route: '/' },
  { key: 'happenings', label: 'Happenings', icon: Newspaper, route: '/happenings' },
  { key: 'rms', label: 'RMS', icon: ClipboardEdit, route: '/rms' },
  { key: 'guest-room', label: 'Guest Room', icon: Building2, route: '/guest-room' },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ key, label, icon: Icon, route }) => {
        const active = location.pathname === route;
        return (
          <button
            key={key}
            className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate(route)}
          >
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
