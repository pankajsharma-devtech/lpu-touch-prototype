import {
  Megaphone,
  GraduationCap,
  HandCoins,
  ClipboardCheck,
  FileEdit,
  FileBarChart,
  FileWarning,
  CalendarCheck,
  PartyPopper,
  ScanLine,
  CalendarClock,
} from 'lucide-react';
import type { TileConfig } from '../data/mockData';
import './DashboardTile.css';

const ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Megaphone,
  GraduationCap,
  HandCoins,
  ClipboardCheck,
  FileEdit,
  FileBarChart,
  FileWarning,
  CalendarCheck,
  PartyPopper,
  MessTray: ScanLine,
  CalendarClock,
};

interface DashboardTileProps {
  tile: TileConfig;
  onClick: () => void;
}

export default function DashboardTile({ tile, onClick }: DashboardTileProps) {
  const Icon = ICONS[tile.icon] ?? Megaphone;
  return (
    <button
      className={`dtile ${tile.highlighted ? 'dtile--highlighted' : ''}`}
      onClick={onClick}
    >
      {tile.badge && <span className="dtile__badge">{tile.badge}</span>}
      <Icon size={38} strokeWidth={1.5} />
      <span className="dtile__label">{tile.label}</span>
    </button>
  );
}
