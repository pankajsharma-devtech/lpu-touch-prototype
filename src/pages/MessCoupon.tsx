import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import MealButton from '../components/MealButton';
import { useProfile } from '../context/ProfileContext';
import { useMeal } from '../context/MealContext';
import type { MealType } from '../data/types';
import './MessCoupon.css';

export default function MessCoupon() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { setSelectedMeal } = useMeal();

  function handleMealSelect(meal: MealType) {
    setSelectedMeal(meal);
    navigate('/mess/scanner');
  }

  return (
    <div className="screen screen--no-nav">
      <AppHeader
        title="Mess Coupon"
        onBack={() => navigate(-1)}
        right={
          <button className="app-header__link" onClick={() => alert('Meal history — demo only.')}>
            Meal History
          </button>
        }
      />

      <div className="scroll-body">
        <div className="mc-card">
          <img src={profile.photo} alt={profile.name} className="mc-card__photo" />
          <div className="mc-card__name">
            {profile.name} {profile.registrationNumber}
          </div>

          <div className="mc-card__field">
            <div className="mc-card__label">Father's Name</div>
            <div className="mc-card__value">
              {profile.fatherName} ({profile.fatherPhone})
            </div>
          </div>
          <div className="mc-card__field">
            <div className="mc-card__label">Mother's Name</div>
            <div className="mc-card__value">
              {profile.motherName} ({profile.motherPhone})
            </div>
          </div>
          <div className="mc-card__field">
            <div className="mc-card__label">Program Name</div>
            <div className="mc-card__value">{profile.program}</div>
          </div>
          <div className="mc-card__field">
            <div className="mc-card__label">Hostel</div>
            <div className="mc-card__value">{profile.hostel}</div>
          </div>
        </div>

        <div className="mc-meal-section">
          <p className="mc-instruction">Tap on the meal name to scan and avail food.</p>
          <button className="mc-rate-us" onClick={() => alert('Thanks for the feedback! (demo only)')}>
            <Star size={13} fill="#a5761a" strokeWidth={0} /> RATE US
          </button>

          <div className="mc-meal-grid">
            <MealButton label="BreakFast" onClick={() => handleMealSelect('Breakfast')} />
            <MealButton label="Lunch" onClick={() => handleMealSelect('Lunch')} />
          </div>
          <div className="mc-meal-grid mc-meal-grid--single">
            <MealButton label="Dinner" onClick={() => handleMealSelect('Dinner')} />
          </div>
        </div>
      </div>
    </div>
  );
}
