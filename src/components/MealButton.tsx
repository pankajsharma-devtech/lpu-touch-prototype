import { ArrowRight } from 'lucide-react';
import './MealButton.css';

export default function MealButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="meal-btn" onClick={onClick}>
      {label} <ArrowRight size={18} strokeWidth={2.4} />
    </button>
  );
}
