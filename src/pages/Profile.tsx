import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useProfile } from '../context/ProfileContext';
import './Profile.css';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="prow">
      <div className="prow__label">{label}</div>
      <div className="prow__value">{value}</div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <div className="psection-header">{title}</div>;
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="screen screen--no-nav">
      <AppHeader
        title="Profile"
        onBack={() => navigate(-1)}
        right={
          <button className="app-header__qr-btn" onClick={() => alert('QR code view — demo only.')}>
            (QR)
          </button>
        }
      />

      <div className="scroll-body">
        <div className="profile-card">
          <img src={profile.photo} alt={profile.name} className="profile-card__photo" />
          <div className="profile-card__name">{profile.name}</div>
          <div className="profile-card__program">{profile.program}</div>
        </div>

        <SectionHeader title="Basic" />
        <div className="psection-body">
          <Row label="Father's Name" value={profile.fatherName} />
          <Row label="Mother's Name" value={profile.motherName} />
          <Row label="Permanent Address" value={profile.permanentAddress} />
          <Row label="Correspondence Address" value={profile.correspondenceAddress} />
          <Row label="Contact No." value={profile.contactNo} />
          <Row label="Email" value={profile.email} />
          <Row label="Date Of Birth" value={profile.dob} />
          <Row label="Student Gender" value={profile.gender} />
        </div>

        <SectionHeader title="Academic Details" />
        <div className="psection-body">
          <Row label="Program" value={profile.program} />
          <Row label="Admission Session" value={profile.admissionSession} />
          <Row label="Batch" value={profile.batch} />
          <Row label="Section" value={profile.section} />
          <Row label="TPC" value={profile.tpc} />
        </div>

        <SectionHeader title="Hostel Details" />
        <div className="psection-body">
          <Row label="Hostel" value={profile.hostel} />
          <Row label="Warden" value={profile.warden} />
          <Row label="Allocated Mess" value={profile.allocatedMess} />
        </div>
      </div>
    </div>
  );
}
