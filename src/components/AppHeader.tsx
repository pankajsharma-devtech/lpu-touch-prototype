import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import './AppHeader.css';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}

export default function AppHeader({ title, onBack, right }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__side app-header__side--left">
        {onBack && (
          <button className="app-header__back" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={24} color="#fff" strokeWidth={2.2} />
          </button>
        )}
      </div>
      <h1 className="app-header__title">{title}</h1>
      <div className="app-header__side app-header__side--right">{right}</div>
    </header>
  );
}
