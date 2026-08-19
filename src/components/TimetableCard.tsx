import { BookMarked } from 'lucide-react';
import type { TimetableEntry } from '../data/mockData';
import './TimetableCard.css';

export default function TimetableCard({ entry }: { entry: TimetableEntry }) {
  return (
    <div className="ttcard">
      <div className="ttcard__top">
        <div className="ttcard__subject">{entry.subject}</div>
        <div className="ttcard__room">{entry.room}</div>
        <span className={`ttcard__status ttcard__status--${entry.status.replace(/\s/g, '')}`}>
          <span className="ttcard__dot" />
          {entry.status}
        </span>
        <BookMarked className="ttcard__icon" size={54} strokeWidth={1} />
      </div>
      <div className="ttcard__time">{entry.time}</div>
    </div>
  );
}
