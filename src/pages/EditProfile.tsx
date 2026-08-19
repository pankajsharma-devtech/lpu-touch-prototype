import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCcw } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { useProfile } from '../context/ProfileContext';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import type { StudentProfile } from '../data/types';
import './EditProfile.css';

const FIELD_GROUPS: { title: string; fields: { key: keyof StudentProfile; label: string; multiline?: boolean }[] }[] = [
  {
    title: 'Identity',
    fields: [
      { key: 'name', label: 'Full Name' },
      { key: 'registrationNumber', label: 'Registration / Student Number' },
    ],
  },
  {
    title: 'Family',
    fields: [
      { key: 'fatherName', label: "Father's Name" },
      { key: 'fatherPhone', label: "Father's Phone" },
      { key: 'motherName', label: "Mother's Name" },
      { key: 'motherPhone', label: "Mother's Phone" },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'permanentAddress', label: 'Permanent Address', multiline: true },
      { key: 'correspondenceAddress', label: 'Correspondence Address', multiline: true },
      { key: 'contactNo', label: 'Contact No.' },
      { key: 'email', label: 'Email' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'gender', label: 'Student Gender' },
    ],
  },
  {
    title: 'Academic',
    fields: [
      { key: 'program', label: 'Program' },
      { key: 'admissionSession', label: 'Admission Session' },
      { key: 'batch', label: 'Batch' },
      { key: 'section', label: 'Section' },
      { key: 'tpc', label: 'TPC' },
    ],
  },
  {
    title: 'Hostel & Mess',
    fields: [
      { key: 'hostel', label: 'Hostel / Room' },
      { key: 'warden', label: 'Warden' },
      { key: 'allocatedMess', label: 'Allocated Mess' },
    ],
  },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile, resetProfile } = useProfile();
  const [draft, setDraft] = useState<StudentProfile>(profile);
  const [savedMsg, setSavedMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleField(key: keyof StudentProfile, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleAcceptedColorChange(value: string) {
    // Applies immediately (not gated behind Save Changes) since it's a
    // purely cosmetic, low-risk setting — the request explicitly asked for
    // instant feedback here, unlike the rest of the profile fields.
    setDraft((prev) => ({ ...prev, acceptedBorderColor: value }));
    updateProfile({ acceptedBorderColor: value });
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((prev) => ({ ...prev, photo: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    updateProfile(draft);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  function handleReset() {
    if (confirm('Reset all profile fields back to the default demo profile (Ashok Mittal)?')) {
      resetProfile();
      setDraft(DEFAULT_PROFILE);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
    }
  }

  return (
    <div className="screen screen--no-nav">
      <AppHeader title="Edit Profile" onBack={() => navigate(-1)} />

      <div className="scroll-body">
        <div className="ep-photo-block">
          <div className="ep-photo-wrap">
            <img src={draft.photo} alt="Profile preview" className="ep-photo" />
            <button className="ep-photo-btn" onClick={() => fileInputRef.current?.click()}>
              <Camera size={16} color="#fff" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />
          <p className="ep-photo-hint">Tap the camera icon to change your photo</p>
        </div>

        {FIELD_GROUPS.map((group) => (
          <div key={group.title} className="ep-group">
            <div className="ep-group__title">{group.title}</div>
            {group.fields.map((field) => (
              <label key={field.key} className="ep-field">
                <span>{field.label}</span>
                {field.multiline ? (
                  <textarea
                    value={draft[field.key]}
                    onChange={(e) => handleField(field.key, e.target.value)}
                    rows={2}
                  />
                ) : (
                  <input
                    value={draft[field.key]}
                    onChange={(e) => handleField(field.key, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        ))}

        <div className="ep-group">
          <div className="ep-group__title">Appearance</div>
          <label className="ep-field">
            <span>Accepted Box Border Color</span>
            <div className="ep-color-row">
              <input
                type="color"
                value={draft.acceptedBorderColor}
                onChange={(e) => handleAcceptedColorChange(e.target.value)}
                className="ep-color-input"
                aria-label="Accepted Box Border Color"
              />
              <span className="ep-color-value">{draft.acceptedBorderColor}</span>
            </div>
          </label>
          <p className="ep-color-hint">
            Only affects the border/frame around the ACCEPTED animation on the Mess Pass
            result. Applies immediately.
          </p>
        </div>

        <div className="ep-actions">
          <button className="ep-save" onClick={handleSave}>
            Save Changes
          </button>
          <button className="ep-reset" onClick={handleReset}>
            <RotateCcw size={15} /> Reset to Default
          </button>
        </div>

        {savedMsg && <div className="ep-toast">Profile saved — updated everywhere in the app.</div>}
      </div>
    </div>
  );
}
