export interface StudentProfile {
  photo: string; // data URL or imported asset path
  name: string;
  registrationNumber: string;
  program: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  permanentAddress: string;
  correspondenceAddress: string;
  contactNo: string;
  email: string;
  dob: string;
  gender: string;
  admissionSession: string;
  batch: string;
  section: string;
  tpc: string;
  hostel: string;
  warden: string;
  allocatedMess: string;
  /**
   * Border/frame color for the ACCEPTED box on the Mess Pass result.
   * Cosmetic only — does not affect the white inner background, the green
   * ACCEPTED animation, or anything else on the page.
   */
  acceptedBorderColor: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
