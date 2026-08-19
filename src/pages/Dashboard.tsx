import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';
import TimetableCard from '../components/TimetableCard';
import DashboardTile from '../components/DashboardTile';
import { TIMETABLE, TILES } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function handleTileClick(route?: string, label?: string) {
    if (route) {
      navigate(route);
    } else {
      alert(`"${label}" is a demo-only tile in this prototype.`);
    }
  }

  return (
    <div className="screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="dash-header">
        <button className="dash-header__hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={26} strokeWidth={2.2} color="#e8783f" />
        </button>
        <h1 className="dash-header__title">Dashboard</h1>
        <button className="dash-header__bell" aria-label="Notifications">
          <Bell size={24} strokeWidth={2} color="#2b2b2b" />
          <span className="dash-header__badge">13</span>
        </button>
      </header>

      <div className="scroll-body">
        <section className="dash-section">
          <div className="dash-section__row">
            <h2 className="dash-section__title">Today's Timetable</h2>
            <button className="dash-dost-btn">Your Dost</button>
          </div>
          <div className="dash-timetable-scroll">
            {TIMETABLE.map((entry) => (
              <TimetableCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>

        <section className="dash-section">
          <div className="dash-section__row">
            <h2 className="dash-section__title">Add More Tiles</h2>
            <button className="dash-add-btn" aria-label="Add tiles">
              <Plus size={20} color="#fff" />
            </button>
          </div>
          <p className="dash-section__hint">Click on the plus button to add menu grids.</p>

          <div className="dash-tile-grid">
            {TILES.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                onClick={() => handleTileClick(tile.route, tile.label)}
              />
            ))}
          </div>
        </section>
      </div>

      <BottomNavigation />
    </div>
  );
}
