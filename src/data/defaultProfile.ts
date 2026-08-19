import defaultAvatar from '../assets/default-avatar.svg';
import type { StudentProfile } from './types';

/**
 * Generic demonstration profile. Contains no real personal information —
 * name, contact details, and photo are all placeholders. Users can replace
 * any of this via Edit Profile, which is stored locally in their own browser.
 */
export const DEFAULT_PROFILE: StudentProfile = {
  photo: defaultAvatar,
  name: 'Ashok Mittal',
  registrationNumber: '12404040',
  program: 'P132:B.Tech. (Computer Science and Engineering) (2024)',
  fatherName: 'Ashok Mittal',
  fatherPhone: '1234567890',
  motherName: 'Rashmi Mittal',
  motherPhone: '1234567890',
  permanentAddress: 'Demo Address',
  correspondenceAddress: 'Demo Address',
  contactNo: '1234567890',
  email: 'lpu@gmail.com',
  dob: '01 Jan 2000',
  gender: 'Male',
  admissionSession: '2024-1',
  batch: '2024',
  section: 'K2P24KB',
  tpc: '20339::Dr. Usha Mittal (01824520140)',
  hostel: 'Boys Hostel-05- B613-Bed B (Standard Air Conditioned 4 Seater)',
  warden: '29276::Sanjeev Kumar (9780036434)',
  allocatedMess: 'Mess 1 BH5',
  acceptedBorderColor: '#957e66',
};
