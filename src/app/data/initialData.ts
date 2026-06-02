export const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    role: 'Principal Software Engineer',
    department: 'Engineering',
    status: 'Active',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    dateJoined: '2021-03-15',
    salary: 145000,
    deductions: 4200,
    benefits: 1200,
    leaveBalances: { vacation: 18, sick: 10, personal: 4 },
    performanceRating: 4.8,
    recruitmentSource: 'Direct Referral',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'EMP-002',
    name: 'Marcus Chen',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
    email: 'marcus.c@company.com',
    phone: '+1 (555) 014-9876',
    location: 'Austin, TX',
    dateJoined: '2022-06-01',
    salary: 120000,
    deductions: 3100,
    benefits: 1100,
    leaveBalances: { vacation: 14, sick: 8, personal: 5 },
    performanceRating: 4.5,
    recruitmentSource: 'LinkedIn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'EMP-003',
    name: 'Elena Rostova',
    role: 'HR Manager',
    department: 'People Operations',
    status: 'Active',
    email: 'elena.r@company.com',
    phone: '+1 (555) 017-3456',
    location: 'Remote, US',
    dateJoined: '2020-11-10',
    salary: 95000,
    deductions: 2500,
    benefits: 950,
    leaveBalances: { vacation: 22, sick: 12, personal: 6 },
    performanceRating: 4.9,
    recruitmentSource: 'Indeed',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'EMP-004',
    name: 'David Kojo',
    role: 'UI/UX Designer',
    department: 'Design',
    status: 'Active',
    email: 'david.k@company.com',
    phone: '+1 (555) 012-4567',
    location: 'New York, NY',
    dateJoined: '2023-01-15',
    salary: 110000,
    deductions: 2900,
    benefits: 1050,
    leaveBalances: { vacation: 12, sick: 7, personal: 3 },
    performanceRating: 4.2,
    recruitmentSource: 'Dribbble',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'EMP-005',
    name: 'Alisha Patel',
    role: 'Senior QA Analyst',
    department: 'Engineering',
    status: 'On Leave',
    email: 'alisha.p@company.com',
    phone: '+1 (555) 015-7890',
    location: 'San Francisco, CA',
    dateJoined: '2022-09-15',
    salary: 105000,
    deductions: 2800,
    benefits: 1000,
    leaveBalances: { vacation: 5, sick: 4, personal: 2 },
    performanceRating: 4.6,
    recruitmentSource: 'Glassdoor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const INITIAL_CANDIDATES = [
  { id: 'CAN-001', name: 'Sophia Martinez', roleApplied: 'Frontend Developer', stage: 'Screening', rating: 4.5, source: 'LinkedIn', appliedDate: '2026-05-28', interviewScheduled: '2026-06-04' },
  { id: 'CAN-002', name: 'Liam O\'Connor', roleApplied: 'Fullstack Engineer', stage: 'Interview', rating: 4.8, source: 'Direct Referral', appliedDate: '2026-05-24', interviewScheduled: '2026-06-02' },
  { id: 'CAN-003', name: 'Emma Watson', roleApplied: 'Product Designer', stage: 'Technical Assessment', rating: 4.2, source: 'Dribbble', appliedDate: '2026-05-20', interviewScheduled: null },
  { id: 'CAN-004', name: 'Zahir Abbas', roleApplied: 'Engineering Manager', stage: 'Offer Stage', rating: 4.9, source: 'Recruiter Direct', appliedDate: '2026-05-10', interviewScheduled: '2026-06-05' },
  { id: 'CAN-005', name: 'Chloe Dubois', roleApplied: 'HR Generalist', stage: 'Applied', rating: 3.9, source: 'Indeed', appliedDate: '2026-05-31', interviewScheduled: null }
];

export const INITIAL_LEAVE_REQUESTS = [
  { id: 'LRQ-101', employeeId: 'EMP-001', employeeName: 'Sarah Jenkins', type: 'Vacation', startDate: '2026-07-10', endDate: '2026-07-17', status: 'Pending', reason: 'Annual family summer trip' },
  { id: 'LRQ-102', employeeId: 'EMP-002', employeeName: 'Marcus Chen', type: 'Sick Leave', startDate: '2026-06-05', endDate: '2026-06-06', status: 'Approved', reason: 'Dental surgery recovery' },
  { id: 'LRQ-103', employeeId: 'EMP-005', employeeName: 'Alisha Patel', type: 'Maternity/Paternity', startDate: '2026-05-15', endDate: '2026-08-15', status: 'Approved', reason: 'Maternity leave' },
  { id: 'LRQ-104', employeeId: 'EMP-004', employeeName: 'David Kojo', type: 'Personal Day', startDate: '2026-06-15', endDate: '2026-06-16', status: 'Pending', reason: 'Moving to new apartment' }
];

export const ATTENDANCE_LOGS = [
  { id: 'ATT-001', employeeName: 'Sarah Jenkins', date: '2026-06-02', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'On Time', shift: 'Day Shift' },
  { id: 'ATT-002', employeeName: 'Marcus Chen', date: '2026-06-02', checkIn: '09:15 AM', checkOut: '06:00 PM', status: 'Late', shift: 'Day Shift' },
  { id: 'ATT-003', employeeName: 'Elena Rostova', date: '2026-06-02', checkIn: '08:45 AM', checkOut: '05:00 PM', status: 'On Time', shift: 'Day Shift' },
  { id: 'ATT-004', employeeName: 'David Kojo', date: '2026-06-02', checkIn: '09:02 AM', checkOut: '05:45 PM', status: 'On Time', shift: 'Day Shift' },
  { id: 'ATT-005', employeeName: 'Alisha Patel', date: '2026-06-02', checkIn: '--', checkOut: '--', status: 'Excused', shift: 'Day Shift' }
];
