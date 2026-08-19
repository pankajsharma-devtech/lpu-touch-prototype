import { Search, UserCog, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { SIDEBAR_ITEMS } from '../data/mockData';
import './Sidebar.css';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredItems = SIDEBAR_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  function go(route?: string) {
    onClose();
    if (route) {
      navigate(route);
    }
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__profile-block">
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            <X size={20} color="#fff" />
          </button>
          <button className="sidebar__avatar-btn" onClick={() => go('/profile')}>
            <img src={profile.photo} alt={profile.name} className="sidebar__avatar" />
          </button>
          <div className="sidebar__name">{profile.name}</div>
          <div className="sidebar__meta">{profile.registrationNumber}</div>
          <div className="sidebar__meta">{profile.hostel.split('(')[0].trim()}</div>
        </div>

        <div className="sidebar__search">
          <Search size={16} color="#9a9a9a" />
          <input
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button className="sidebar__edit-profile" onClick={() => go('/edit-profile')}>
          <UserCog size={18} />
          <span>Edit Profile</span>
          <span className="sidebar__edit-profile-tag">Prototype feature</span>
        </button>

        <div className="sidebar__divider" />

        <nav className="sidebar__menu">
          {filteredItems.map((item) => (
            <button key={item.label} className="sidebar__menu-item" onClick={() => go(item.route)}>
              {item.label}
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="sidebar__no-results">No results for "{query}"</div>
          )}
        </nav>

        <button className="sidebar__logout" onClick={() => go('/')}>
          <LogOut size={18} />
          <span>LOGOUT</span>
        </button>
      </aside>
    </>
  );
}
