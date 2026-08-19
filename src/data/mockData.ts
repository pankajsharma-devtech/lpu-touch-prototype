export interface TimetableEntry {
  id: string;
  subject: string;
  room: string;
  time: string;
  status: 'Present' | 'Going On' | 'Upcoming';
}

export const TIMETABLE: TimetableEntry[] = [
  { id: 't1', subject: 'CSE472', room: '33-607', time: '11:10-12:00 AM', status: 'Present' },
  { id: 't2', subject: 'CSE472', room: '33-607', time: '12:00-12:50 PM', status: 'Going On' },
  { id: 't3', subject: 'CSE316', room: '32-410', time: '01:00-01:50 PM', status: 'Upcoming' },
  { id: 't4', subject: 'CSE331', room: '34-201', time: '02:00-02:50 PM', status: 'Upcoming' },
];

export interface TileConfig {
  id: string;
  label: string;
  badge?: string;
  icon: string;
  highlighted?: boolean;
  route?: string;
}

export const TILES: TileConfig[] = [
  { id: 'announce', label: 'Announce', badge: '11', icon: 'Megaphone' },
  { id: 'edu', label: 'Edu Revolution', icon: 'GraduationCap', highlighted: true },
  { id: 'fee-statement', label: 'Fee Statement', icon: 'HandCoins' },
  { id: 'attendance', label: 'Attendance', badge: '100 %', icon: 'ClipboardCheck' },
  { id: 'assignment', label: 'Assignment', badge: '0', icon: 'FileEdit' },
  { id: 'results', label: 'Results', badge: '7.64', icon: 'FileBarChart' },
  { id: 'exams', label: 'Exams', badge: '0', icon: 'FileWarning' },
  { id: 'rms-status', label: 'RMS Status', icon: 'CalendarCheck' },
  { id: 'events', label: 'Events', icon: 'PartyPopper' },
  { id: 'mess-scanner', label: 'Mess Food Scanner', badge: 'X', icon: 'MessTray', route: '/mess' },
  { id: 'timetable', label: 'Time table', badge: 'X', icon: 'MessTray' },
];

export interface SidebarItem {
  label: string;
  route?: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Placement Drive' },
  { label: 'Elective Polling' },
  { label: 'Fee Payment Schedule' },
  { label: 'Fee Statement' },
  { label: 'Guest Lecture/Workshop Feedback' },
  { label: 'List of Holidays' },
  { label: 'Fee Payment' },
  { label: 'App Feedback' },
  { label: 'Virtual Tour' },
  { label: 'Library Search' },
  { label: 'Residential Facilities Helpline' },
  { label: 'Backlog Registration' },
  { label: 'Hostel Leave Slip' },
  { label: 'Residential Reporting Slip' },
  { label: 'Special Food Services' },
  { label: 'Uni Hospital Help Line' },
  { label: 'Inventory' },
  { label: 'Library Resource Feedback' },
  { label: 'Issued Books' },
  { label: 'Lab Resource Feedback' },
  { label: 'Make Up Adjustment' },
  { label: 'Mentor Meeting Details' },
  { label: 'Feedback on Mentor Meeting' },
  { label: 'Mess Food Scanner', route: '/mess' },
  { label: 'PEP Activities' },
  { label: 'Placement Drive Summary' },
  { label: 'RMS Request Status' },
  { label: 'RMS Scanner' },
  { label: 'Skill Development Feedback' },
  { label: 'Student Class Feedback' },
  { label: 'SPR Course Progress' },
  { label: 'Event QR Scanner/Tier Request' },
  { label: 'Exam Attendance' },
  { label: 'Laundry' },
  { label: 'Open Minor Area Preference' },
  { label: 'Report Card' },
  { label: 'Lecture Feedback' },
  { label: 'Time table' },
  { label: 'Railway Concession Form' },
  { label: 'Entry Exit Logs' },
  { label: 'Vendor Facility Search' },
  { label: 'Food Shops' },
];
