import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useProfile } from '../context/ProfileContext';
import { useMeal } from '../context/MealContext';
import './MessResult.css';

const ACTIVE_SECONDS = 30;

/**
 * The profile stores the mess as "Mess 1 BH5" (matching the Profile screen's
 * "Allocated Mess" field). The Mess Pass recording displays it as
 * "Mess-1 BH-5" instead — this reformats it for that specific display,
 * without changing the underlying profile data.
 */
function formatMessLabel(allocatedMess: string): string {
  return allocatedMess.replace(/Mess\s+(\S+)/i, 'Mess-$1').replace(/BH\s*(\d+)/i, 'BH-$1');
}

export default function MessResult() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { selectedMeal, scanTimestamp, setSelectedMeal, setScanTimestamp } = useMeal();
  const [secondsLeft, setSecondsLeft] = useState(ACTIVE_SECONDS);

  useEffect(() => {
    if (!selectedMeal || !scanTimestamp) {
      navigate('/mess', { replace: true });
    }
  }, [selectedMeal, scanTimestamp, navigate]);

  // The pass is active for ~30 seconds after it appears, then closes itself.
  useEffect(() => {
    if (secondsLeft <= 0) {
      handleClose();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const scannedAt = useMemo(() => new Date(scanTimestamp ?? Date.now()), [scanTimestamp]);
  const dateStr = scannedAt.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = scannedAt.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const verificationCode = useMemo(() => {
    // Stable per scan: derived from the timestamp, purely a local demo value.
    const seed = scanTimestamp ?? Date.now();
    return String(10000000 + (seed % 90000000)).slice(0, 8);
  }, [scanTimestamp]);

  const qrValue = useMemo(
    () => `LPU-MESS-DEMO-${profile.registrationNumber}`,
    [profile.registrationNumber]
  );

  function handleClose() {
    setSelectedMeal(null);
    setScanTimestamp(null);
    navigate('/mess');
  }

  if (!selectedMeal || !scanTimestamp) return null;

  return (
    <div className="mp-screen">
      <div className="mp-backdrop" />

      <div className="mp-sheet">
        <div className="mp-sheet__handle" />
        <div className="mp-header">
          <div style={{ width: 40 }} />
          <span className="mp-header__title">Mess Pass</span>
          <button className="mp-header__close" onClick={handleClose} aria-label="Close">
            <X size={20} color="#fff" />
          </button>
        </div>

        <div className="mp-body">
          <span className="mp-timer-badge">{secondsLeft}</span>

          <div className="mp-photo-qr-row">
            <img src={profile.photo} alt={profile.name} className="mp-photo" />
            <div className="mp-qr">
              <QRCodeSVG value={qrValue} size={128} level="M" includeMargin={false} />
            </div>
          </div>

          <div className="mp-photo-qr-caption-row">
            <div className="mp-caption">
              <strong>{profile.registrationNumber}</strong>
              <span>{profile.name}</span>
            </div>
            <div className="mp-caption">
              <strong>{selectedMeal}</strong>
              <span>{formatMessLabel(profile.allocatedMess)}</span>
            </div>
          </div>

          <p className="mp-program">{profile.program}</p>

          <p className="mp-assigned-mess">
            Your Assigned Mess - {formatMessLabel(profile.allocatedMess)}
          </p>

          <div className="mp-date-time-row">
            <span>{dateStr}</span>
            <span>{timeStr}</span>
          </div>

          <p className="mp-meal-approved">Meal Approved</p>

          <button className="mp-rate-us" onClick={() => alert('Thanks for the feedback! (demo only)')}>
            <Star size={13} fill="#f0c04c" strokeWidth={0} /> RATE US
          </button>

          <div className="mp-accepted-frame" style={{ background: profile.acceptedBorderColor }}>
            <div className="mp-accepted-frame__inner">
              <div className="mp-accepted-anim" aria-label="Accepted">
                <svg className="mp-accepted-anim__badge" viewBox="0 0 64 64" width="56" height="56">
                  <circle className="mp-accepted-anim__ring" cx="32" cy="32" r="26" />
                  <line className="mp-accepted-anim__pending-line" x1="6" y1="32" x2="58" y2="32" />
                  <circle className="mp-accepted-anim__fill" cx="32" cy="32" r="26" />
                  <path className="mp-accepted-anim__check" d="M20 33 L28 41 L45 23" />
                </svg>
                <span className="mp-accepted-anim__text">
                  ACCEPTED
                  <span className="mp-accepted-anim__underline" />
                </span>
              </div>
            </div>
          </div>

          <div className="mp-lower-info">
            <div className="mp-lower-row">
              <span>Father's Name</span>
              <strong>
                {profile.fatherName} ({profile.fatherPhone})
              </strong>
            </div>
            <div className="mp-lower-row">
              <span>Mother's Name</span>
              <strong>
                {profile.motherName} ({profile.motherPhone})
              </strong>
            </div>
            <div className="mp-lower-row">
              <span>Session</span>
              {/* Matches the real LPU Touch app's Mess Pass exactly: the row
                  labeled "Session" displays the program string, not the
                  admission session value shown elsewhere in the app. */}
              <strong>{profile.program}</strong>
            </div>
            <div className="mp-lower-row">
              <span>Hostel</span>
              <strong>{profile.hostel}</strong>
            </div>
          </div>

          <div className="mp-verification">
            <span>Verification Code</span>
            <strong>{verificationCode}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
