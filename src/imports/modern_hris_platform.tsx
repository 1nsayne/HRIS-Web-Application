import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Users, User, Calendar, Clock, DollarSign, 
  Briefcase, Award, Settings, Search, Bell, Plus, Filter, 
  CheckCircle, XCircle, AlertCircle, TrendingUp, Download, 
  ChevronDown, Lock, Shield, Building, Check, Edit, Eye, 
  ArrowUpRight, Mail, Phone, MapPin, CalendarDays, FileText,
  UserPlus, CheckSquare, RefreshCw, BarChart3, HelpCircle, LogOut
} from 'lucide-react';

const INITIAL_EMPLOYEES = [
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

const INITIAL_CANDIDATES = [
  { id: 'CAN-001', name: 'Sophia Martinez', roleApplied: 'Frontend Developer', stage: 'Screening', rating: 4.5, source: 'LinkedIn', appliedDate: '2026-05-28', interviewScheduled: '2026-06-04' },
  { id: 'CAN-002', name: 'Liam O\'Connor', roleApplied: 'Fullstack Engineer', stage: 'Interview', rating: 4.8, source: 'Direct Referral', appliedDate: '2026-05-24', interviewScheduled: '2026-06-02' },
  { id: 'CAN-003', name: 'Emma Watson', roleApplied: 'Product Designer', stage: 'Technical Assessment', rating: 4.2, source: 'Dribbble', appliedDate: '2026-05-20', interviewScheduled: null },
  { id: 'CAN-004', name: 'Zahir Abbas', roleApplied: 'Engineering Manager', stage: 'Offer Stage', rating: 4.9, source: 'Recruiter Direct', appliedDate: '2026-05-10', interviewScheduled: '2026-06-05' },
  { id: 'CAN-005', name: 'Chloe Dubois', roleApplied: 'HR Generalist', stage: 'Applied', rating: 3.9, source: 'Indeed', appliedDate: '2026-05-31', interviewScheduled: null }
];

const INITIAL_LEAVE_REQUESTS = [
  { id: 'LRQ-101', employeeId: 'EMP-001', employeeName: 'Sarah Jenkins', type: 'Vacation', startDate: '2026-07-10', endDate: '2026-07-17', status: 'Pending', reason: 'Annual family summer trip' },
  { id: 'LRQ-102', employeeId: 'EMP-002', employeeName: 'Marcus Chen', type: 'Sick Leave', startDate: '2026-06-05', endDate: '2026-06-06', status: 'Approved', reason: 'Dental surgery recovery' },
  { id: 'LRQ-103', employeeId: 'EMP-005', employeeName: 'Alisha Patel', type: 'Maternity/Paternity', startDate: '2026-05-15', endDate: '2026-08-15', status: 'Approved', reason: 'Maternity leave' },
  { id: 'LRQ-104', employeeId: 'EMP-004', employeeName: 'David Kojo', type: 'Personal Day', startDate: '2026-06-15', endDate: '2026-06-16', status: 'Pending', reason: 'Moving to new apartment' }
];

const ATTENDANCE_LOGS = [
  { id: 'ATT-001', employeeName: 'Sarah Jenkins', date: '2026-06-02', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'On Time', shift: 'Day Shift' },
  { id: 'ATT-002', employeeName: 'Marcus Chen', date: '2026-06-02', checkIn: '09:15 AM', checkOut: '06:00 PM', status: 'Late', shift: 'Day Shift' },
  { id: 'ATT-003', employeeName: 'Elena Rostova', date: '2026-06-02', checkIn: '08:45 AM', checkOut: '05:00 PM', status: 'On Time', shift: 'Day Shift' },
  { id: 'ATT-004', employeeName: 'David Kojo', date: '2026-06-02', checkIn: '09:02 AM', checkOut: '05:45 PM', status: 'On Time', shift: 'Day Shift' },
  { id: 'ATT-005', employeeName: 'Alisha Patel', date: '2026-06-02', checkIn: '--', checkOut: '--', status: 'Excused', shift: 'Day Shift' }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'employee' | 'exec'
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [leaveRequests, setLeaveRequests] = useState(INITIAL_LEAVE_REQUESTS);
  const [selectedEmployee, setSelectedEmployee] = useState(INITIAL_EMPLOYEES[0]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Sarah Jenkins requested Vacation leave (Pending)', unread: true, time: '1 hour ago' },
    { id: 2, text: 'Marcus Chen updated their address information', unread: true, time: '3 hours ago' },
    { id: 3, text: 'Payroll approval window is now open for June cycle', unread: false, time: '1 day ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPunchIn, setIsPunchIn] = useState(false);
  const [punchTime, setPunchTime] = useState(null);

  // Forms dynamic state
  const [newLeaveType, setNewLeaveType] = useState('Vacation');
  const [newLeaveStart, setNewLeaveStart] = useState('');
  const [newLeaveEnd, setNewLeaveEnd] = useState('');
  const [newLeaveReason, setNewLeaveReason] = useState('');

  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateRole, setNewCandidateRole] = useState('');
  const [newCandidateSource, setNewCandidateSource] = useState('LinkedIn');

  const handleAddLeaveRequest = (e) => {
    e.preventDefault();
    if (!newLeaveStart || !newLeaveEnd || !newLeaveReason) return;
    
    const newRequest = {
      id: `LRQ-${Math.floor(Math.random() * 900) + 100}`,
      employeeId: selectedRole === 'employee' ? 'EMP-001' : 'EMP-003',
      employeeName: selectedRole === 'employee' ? 'Sarah Jenkins' : 'Elena Rostova',
      type: newLeaveType,
      startDate: newLeaveStart,
      endDate: newLeaveEnd,
      status: 'Pending',
      reason: newLeaveReason
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setNewLeaveStart('');
    setNewLeaveEnd('');
    setNewLeaveReason('');
    
    setNotifications([
      { id: Date.now(), text: `New leave request submitted by ${newRequest.employeeName}`, unread: true, time: 'Just now' },
      ...notifications
    ]);
  };

  const handleUpdateLeaveStatus = (id, newStatus) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateRole) return;

    const newCand = {
      id: `CAN-${Math.floor(Math.random() * 900) + 100}`,
      name: newCandidateName,
      roleApplied: newCandidateRole,
      stage: 'Applied',
      rating: 0.0,
      source: newCandidateSource,
      appliedDate: new Date().toISOString().split('T')[0],
      interviewScheduled: null
    };

    setCandidates([newCand, ...candidates]);
    setNewCandidateName('');
    setNewCandidateRole('');
  };

  const handleUpdateCandidateStage = (id, nextStage) => {
    setCandidates(candidates.map(cand => 
      cand.id === id ? { ...cand, stage: nextStage } : cand
    ));
  };

  const handleTogglePunch = () => {
    if (!isPunchIn) {
      setIsPunchIn(true);
      setPunchTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsPunchIn(false);
      setPunchTime(null);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'HR Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Employee Directory', icon: Users },
    { id: 'profile', label: 'My/Staff Profile', icon: User },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'attendance', label: 'Attendance logs', icon: Clock },
    { id: 'payroll', label: 'Payroll & Salaries', icon: DollarSign },
    { id: 'recruitment', label: 'Recruitment (ATS)', icon: Briefcase },
    { id: 'performance', label: 'Performance Reviews', icon: Award },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 z-20">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight">NexusHRIS</h1>
              <p className="text-xs text-slate-400">Mid-Market Standard</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    // Autofills profile selection if clicking Profile
                    if (item.id === 'profile' && !selectedEmployee) {
                      setSelectedEmployee(employees[0]);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-bold overflow-hidden">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" alt="Active Administrator" />
            </div>
            <div className="truncate flex-1">
              <p className="text-sm font-semibold text-white truncate">Elena Rostova</p>
              <p className="text-xs text-slate-400 truncate">HR Administrator</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-semibold text-rose-400 hover:bg-slate-900 rounded border border-rose-950/40 transition-all">
            <LogOut className="h-3.5 w-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW AREA CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP INTERACTIVE HEADBAR */}
        {}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative w-64 max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources, employees..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* PERSPECTIVE SELECTOR - Synthesized Design-It-Twice Showcase */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 px-2">View Persona:</span>
              <button
                onClick={() => setSelectedRole('admin')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedRole === 'admin' 
                    ? 'bg-white text-indigo-700 shadow-xs border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. HR Admin
              </button>
              <button
                onClick={() => setSelectedRole('employee')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedRole === 'employee' 
                    ? 'bg-white text-indigo-700 shadow-xs border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Employee Self-Service
              </button>
              <button
                onClick={() => setSelectedRole('exec')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedRole === 'exec' 
                    ? 'bg-white text-indigo-700 shadow-xs border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Executive Analytics
              </button>
            </div>
          </div>

          {/* Quick Actions and Alerts */}
          <div className="flex items-center space-x-4">
            {/* Quick-Clock widget */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
              <Clock className={`h-4 w-4 ${isPunchIn ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-medium text-slate-600">
                {isPunchIn ? `Clocked in: ${punchTime}` : 'Clocked Out'}
              </span>
              <button 
                onClick={handleTogglePunch}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  isPunchIn 
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                {isPunchIn ? 'Punch Out' : 'Punch In'}
              </button>
            </div>

            {/* Notifications Panel Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Real Notification dropdown list */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-800">Operational Alerts</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`px-4 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 ${notif.unread ? 'bg-indigo-50/40' : ''}`}>
                        <div className="flex items-start space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${notif.unread ? 'bg-indigo-600' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <p className="text-xs text-slate-700">{notif.text}</p>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Creation Dropdown/Trigger */}
            <button 
              onClick={() => {
                if (currentTab === 'recruitment') {
                  const formEl = document.getElementById('candForm');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                } else if (currentTab === 'leave') {
                  const formEl = document.getElementById('leaveForm');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setCurrentTab('directory');
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Quick Action</span>
            </button>
          </div>
        </header>

        {/* ACTIVE SUB-MODULE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* ==============================================
              SCREEN 1: HR DASHBOARD (DYNAMICALLY REACTIVE)
              ============================================== */}
          {}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header banner area based on Persona */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {selectedRole === 'admin' && "NexusHRIS Operational Command Center"}
                    {selectedRole === 'employee' && "Welcome back, Sarah Jenkins!"}
                    {selectedRole === 'exec' && "Workforce Executive Analytics & Cost Control"}
                  </h2>
                  <p className="text-slate-300 text-sm mt-1">
                    {selectedRole === 'admin' && "Monitor systems, review pending leaves, and process current payroll cycle logs."}
                    {selectedRole === 'employee' && "Submit vacation requests, view timesheets, and review quarterly targets."}
                    {selectedRole === 'exec' && "Analyze payroll allocation trends, departmental growth metrics, and productivity levels."}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-400/30">
                    Active Environment: {selectedRole.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* ADMIN VIEW WIDGETS */}
              {selectedRole === 'admin' && (
                <>
                  {/* Grid Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Headcount</p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-1">{employees.length}</h3>
                        </div>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Users className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-3 text-xs text-slate-500">
                        <span className="text-emerald-500 font-semibold flex items-center">
                          <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +2.4%
                        </span>
                        <span>vs previous cycle</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leaves Pending</p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-1">
                            {leaveRequests.filter(r => r.status === 'Pending').length}
                          </h3>
                        </div>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                          <Calendar className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-3 text-xs text-slate-500">
                        <span className="text-rose-500 font-semibold">Requires Action</span>
                        <span>before next payroll lock</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pipeline</p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-1">{candidates.length}</h3>
                        </div>
                        <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                          <Briefcase className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-3 text-xs text-slate-500">
                        <span className="text-indigo-500 font-semibold">3 Interviews scheduled</span>
                        <span>this week</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll Status</p>
                          <h3 className="text-lg font-bold text-emerald-600 mt-1">Ready to Process</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <DollarSign className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-3 text-xs text-slate-500">
                        <span>Due in 12 days</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Split Tables */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Leave Request Quick Approval Board */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 text-sm">Urgent Staff Leave Approvals Queue</h3>
                        <button onClick={() => setCurrentTab('leave')} className="text-xs text-indigo-600 hover:underline">View All Requests</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-500">
                          <thead className="text-slate-700 bg-slate-50 uppercase text-[10px]">
                            <tr>
                              <th className="p-3">Employee</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Dates</th>
                              <th className="p-3">Reason</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {leaveRequests.filter(r => r.status === 'Pending').map(req => (
                              <tr key={req.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-semibold text-slate-800">{req.employeeName}</td>
                                <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">{req.type}</span></td>
                                <td className="p-3 text-slate-600">{req.startDate} to {req.endDate}</td>
                                <td className="p-3 max-w-[150px] truncate">{req.reason}</td>
                                <td className="p-3 text-right space-x-1">
                                  <button onClick={() => handleUpdateLeaveStatus(req.id, 'Approved')} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check className="h-4 w-4 inline" /></button>
                                  <button onClick={() => handleUpdateLeaveStatus(req.id, 'Rejected')} className="p-1 text-rose-600 hover:bg-rose-50 rounded"><XCircle className="h-4 w-4 inline" /></button>
                                </td>
                              </tr>
                            ))}
                            {leaveRequests.filter(r => r.status === 'Pending').length === 0 && (
                              <tr>
                                <td colSpan="5" className="p-6 text-center text-slate-400">No active pending leaves in queue.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Quick Recruiting Pipeline Progress */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 text-sm">Hiring Pipeline Progress</h3>
                        <button onClick={() => setCurrentTab('recruitment')} className="text-xs text-indigo-600 hover:underline">Go to ATS</button>
                      </div>
                      <div className="space-y-3.5">
                        {candidates.slice(0, 4).map(cand => (
                          <div key={cand.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{cand.name}</p>
                              <p className="text-[10px] text-slate-500">{cand.roleApplied}</p>
                            </div>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                              cand.stage === 'Offer Stage' ? 'bg-emerald-100 text-emerald-800' :
                              cand.stage === 'Interview' ? 'bg-amber-100 text-amber-800' :
                              cand.stage === 'Technical Assessment' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-800'
                            }`}>
                              {cand.stage}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* EMPLOYEE PORTAL VIEW */}
              {}
              {selectedRole === 'employee' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Main column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Time Tracking Widget */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Today's Timesheet Punch</h3>
                        <p className="text-xs text-slate-500 mt-1">Shift Schedule: Regular Office Hours (09:00 AM - 05:00 PM)</p>
                      </div>
                      <button 
                        onClick={handleTogglePunch}
                        className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                          isPunchIn 
                            ? 'bg-rose-600 text-white hover:bg-rose-700' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isPunchIn ? 'Stop Shift / Punch Out' : 'Start Shift / Punch In'}
                      </button>
                    </div>

                    {/* Personal Balances */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <h3 className="font-bold text-slate-800 text-sm mb-4">My Leave Allocations</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-indigo-50/50 rounded-lg text-center">
                          <span className="text-xs text-slate-500 font-medium">Vacation Balances</span>
                          <p className="text-2xl font-bold text-slate-800 mt-1">18 Days</p>
                          <span className="text-[10px] text-indigo-600 font-medium block mt-1">Acquired</span>
                        </div>
                        <div className="p-4 bg-emerald-50/50 rounded-lg text-center">
                          <span className="text-xs text-slate-500 font-medium">Sick Leaves</span>
                          <p className="text-2xl font-bold text-slate-800 mt-1">10 Days</p>
                          <span className="text-[10px] text-emerald-600 font-medium block mt-1">Standard</span>
                        </div>
                        <div className="p-4 bg-amber-50/50 rounded-lg text-center">
                          <span className="text-xs text-slate-500 font-medium">Personal Leave</span>
                          <p className="text-2xl font-bold text-slate-800 mt-1">4 Days</p>
                          <span className="text-[10px] text-amber-600 font-medium block mt-1">Emergency allocation</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Calendar & Quick requests */}
                  <div className="space-y-6">
                    {/* Simple Quick Request Form */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <h3 className="font-bold text-slate-800 text-sm mb-4">Request Time Off</h3>
                      <form onSubmit={handleAddLeaveRequest} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500">Leave Type</label>
                          <select 
                            value={newLeaveType}
                            onChange={(e) => setNewLeaveType(e.target.value)}
                            className="w-full text-xs mt-1 border border-slate-200 rounded p-1.5 focus:outline-indigo-600"
                          >
                            <option>Vacation</option>
                            <option>Sick Leave</option>
                            <option>Personal Day</option>
                            <option>Maternity/Paternity</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">From</label>
                            <input 
                              type="date" 
                              value={newLeaveStart}
                              onChange={(e) => setNewLeaveStart(e.target.value)}
                              className="w-full text-xs mt-1 border border-slate-200 rounded p-1.5 focus:outline-indigo-600" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">To</label>
                            <input 
                              type="date" 
                              value={newLeaveEnd}
                              onChange={(e) => setNewLeaveEnd(e.target.value)}
                              className="w-full text-xs mt-1 border border-slate-200 rounded p-1.5 focus:outline-indigo-600" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500">Justification</label>
                          <textarea 
                            value={newLeaveReason}
                            onChange={(e) => setNewLeaveReason(e.target.value)}
                            placeholder="Reason for request..."
                            className="w-full text-xs mt-1 border border-slate-200 rounded p-1.5 focus:outline-indigo-600" 
                            rows="2"
                          />
                        </div>
                        <button className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded hover:bg-indigo-700 transition-colors">
                          Submit Request
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* EXECUTIVE ANALYTICS PORTAL VIEW */}
              {}
              {selectedRole === 'exec' && (
                <div className="space-y-6">
                  {/* Performance stats row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll Burden Run-Rate</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">$575,000<span className="text-sm font-normal text-slate-400">/Year</span></h3>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>Optimized against projections (Within budget)</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Talent Retention</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">94.8%</h3>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>Industry benchmark average: 88.2%</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mean Employee Rating</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">4.62 / 5.00</h3>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-emerald-600 font-medium">
                        <span>Based on Q1 standard evaluations</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Resource Allocation Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Department Headcount Bar Graph */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <h3 className="font-bold text-slate-800 text-sm mb-4">Department Cost Breakdown ($)</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                            <span>Engineering</span>
                            <span>$250,000 (43%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '43%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                            <span>Product & Design</span>
                            <span>$230,000 (40%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '40%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                            <span>People Operations</span>
                            <span>$95,000 (17%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '17%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quality of Recruitment Channels */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <h3 className="font-bold text-slate-800 text-sm mb-4">Recruiting Channel ROI Rating</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <span className="text-xs font-semibold text-slate-700">Direct Referrals</span>
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">Top ROI (4.8 Avg Rating)</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <span className="text-xs font-semibold text-slate-700">LinkedIn Pipeline</span>
                          <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded font-bold">Consistent (4.5 Avg Rating)</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                          <span className="text-xs font-semibold text-slate-700">Indeed Listings</span>
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded font-bold">Variable (3.9 Avg Rating)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==============================================
              SCREEN 2: EMPLOYEE DIRECTORY
              ============================================== */}
          {}
          {currentTab === 'directory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Corporate Employee Registry</h2>
                  <p className="text-xs text-slate-500 mt-1">Full database of active personnel, contract workers, and on-leave staff members.</p>
                </div>
                <button 
                  onClick={() => {
                    const newEmp = {
                      id: `EMP-00${employees.length + 1}`,
                      name: 'Jordan Finch',
                      role: 'Data Analyst',
                      department: 'Product',
                      status: 'Active',
                      email: 'jordan.f@company.com',
                      phone: '+1 (555) 018-4721',
                      location: 'Remote, US',
                      dateJoined: '2026-06-01',
                      salary: 85000,
                      deductions: 2200,
                      benefits: 850,
                      leaveBalances: { vacation: 15, sick: 10, personal: 5 },
                      performanceRating: 4.0,
                      recruitmentSource: 'Indeed',
                      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80'
                    };
                    setEmployees([...employees, newEmp]);
                  }}
                  className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Onboard New Employee</span>
                </button>
              </div>

              {/* Table Filter System */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">Filter Records:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select className="bg-slate-50 text-xs border border-slate-200 rounded p-1.5 font-medium">
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>People Operations</option>
                    <option>Design</option>
                  </select>
                  <select className="bg-slate-50 text-xs border border-slate-200 rounded p-1.5 font-medium">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Terminated</option>
                  </select>
                </div>
              </div>

              {/* Central Information Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-500">
                    <thead className="bg-slate-55 border-b border-slate-200 text-xs text-slate-700 uppercase">
                      <tr>
                        <th className="p-4 font-bold">Personnel details</th>
                        <th className="p-4 font-bold">Department</th>
                        <th className="p-4 font-bold">Role Title</th>
                        <th className="p-4 font-bold">Location</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees
                        .filter(emp => emp.name.toLowerCase().includes(globalSearch.toLowerCase()) || emp.role.toLowerCase().includes(globalSearch.toLowerCase()))
                        .map(emp => (
                          <tr key={emp.id} className="hover:bg-slate-50/75 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                <div>
                                  <span className="font-bold text-slate-800 text-sm block">{emp.name}</span>
                                  <span className="text-xs text-slate-400 font-medium">{emp.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-semibold text-slate-600">{emp.department}</td>
                            <td className="p-4 text-xs text-slate-600 font-medium">{emp.role}</td>
                            <td className="p-4 text-xs text-slate-500">{emp.location}</td>
                            <td className="p-4 text-xs">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                                emp.status === 'Active' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {emp.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  setCurrentTab('profile');
                                }}
                                className="inline-flex items-center space-x-1 text-xs text-indigo-600 font-bold hover:bg-indigo-50 p-2 rounded-lg transition-all"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Inspect Profile</span>
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SCREEN 3: EMPLOYEE PROFILE
              ============================================== */}
          {}
          {currentTab === 'profile' && selectedEmployee && (
            <div className="space-y-6">
              {/* Back navigation & Profile Header Card */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setCurrentTab('directory')} 
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  &larr; Back to Full Directory
                </button>
                <span className="text-xs text-slate-400">File Last Updated: Today 08:00 AM</span>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900">{selectedEmployee.name}</h2>
                        <p className="text-sm font-semibold text-indigo-600">{selectedEmployee.role}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full self-center md:self-start">
                        {selectedEmployee.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{selectedEmployee.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{selectedEmployee.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational / Personnel Deep tabs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Job & Payroll Administration details */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">Employment Contract</h3>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Assigned Department</span>
                      <span className="font-bold text-slate-800">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Standard Salary</span>
                      <span className="font-bold text-slate-800">${selectedEmployee.salary.toLocaleString()} / Yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Standard Deductions</span>
                      <span className="font-semibold text-rose-600">-${selectedEmployee.deductions.toLocaleString()} / Mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Benefits Plan Cost</span>
                      <span className="font-semibold text-emerald-600">+${selectedEmployee.benefits.toLocaleString()} / Mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Joining Date</span>
                      <span className="font-bold text-slate-800">{selectedEmployee.dateJoined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Performance Quotient</span>
                      <span className="font-bold text-slate-800">{selectedEmployee.performanceRating} / 5.00</span>
                    </div>
                  </div>
                </div>

                {/* Left/Sick Balances and Leave approvals */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">Leave Balance Matrix</h3>
                  
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 font-medium">Vacation Allowed Left</span>
                        <span className="font-bold text-slate-800">{selectedEmployee.leaveBalances.vacation} Days</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(selectedEmployee.leaveBalances.vacation / 25) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 font-medium">Sick Leaves Allowed Left</span>
                        <span className="font-bold text-slate-800">{selectedEmployee.leaveBalances.sick} Days</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(selectedEmployee.leaveBalances.sick / 15) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600 font-medium">Personal Days Left</span>
                        <span className="font-bold text-slate-800">{selectedEmployee.leaveBalances.personal} Days</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(selectedEmployee.leaveBalances.personal / 10) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corporate compliance documents verification checklist */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">Onboarding & Compliance Docs</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded text-xs">
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-slate-700">W-4 Form signed</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Verified</span>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded text-xs">
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-slate-700">I-9 Identity documents</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Verified</span>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded text-xs">
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-slate-700">Direct Deposit Form</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Verified</span>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded text-xs">
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-indigo-600" />
                        <span className="font-semibold text-slate-700">Non-Disclosure (NDA)</span>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-medium">Pending Update</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SCREEN 4: LEAVE MANAGEMENT
              ============================================== */}
          {}
          {currentTab === 'leave' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Leave Management & Approvals</h2>
                <p className="text-xs text-slate-500 mt-1">Review active leave requests, check allocations, and submit time off documentation.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form to request new leave */}
                <div id="leaveForm" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Request New Leave</h3>
                  <form onSubmit={handleAddLeaveRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Leave Type</label>
                      <select 
                        value={newLeaveType}
                        onChange={(e) => setNewLeaveType(e.target.value)}
                        className="w-full text-xs mt-1 border border-slate-200 rounded p-2 focus:outline-indigo-600"
                      >
                        <option>Vacation</option>
                        <option>Sick Leave</option>
                        <option>Personal Day</option>
                        <option>Maternity/Paternity</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500">From</label>
                        <input 
                          type="date" 
                          value={newLeaveStart}
                          onChange={(e) => setNewLeaveStart(e.target.value)}
                          className="w-full text-xs mt-1 border border-slate-200 rounded p-2 focus:outline-indigo-600" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500">To</label>
                        <input 
                          type="date" 
                          value={newLeaveEnd}
                          onChange={(e) => setNewLeaveEnd(e.target.value)}
                          className="w-full text-xs mt-1 border border-slate-200 rounded p-2 focus:outline-indigo-600" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Reason</label>
                      <textarea 
                        value={newLeaveReason}
                        onChange={(e) => setNewLeaveReason(e.target.value)}
                        placeholder="Detailed explanation for leave..."
                        className="w-full text-xs mt-1 border border-slate-200 rounded p-2 focus:outline-indigo-600" 
                        rows="3"
                      />
                    </div>

                    <button className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded hover:bg-indigo-700 transition-colors">
                      File Time-off Request
                    </button>
                  </form>
                </div>

                {/* Master queue of requests */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Leave Queue & Audit Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-500">
                      <thead className="bg-slate-50 uppercase font-bold text-slate-700">
                        <tr>
                          <th className="p-3">Employee</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Dates</th>
                          <th className="p-3">Reason</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leaveRequests.map(req => (
                          <tr key={req.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-slate-800">{req.employeeName}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">{req.type}</span></td>
                            <td className="p-3 text-slate-600">{req.startDate} to {req.endDate}</td>
                            <td className="p-3 max-w-[120px] truncate">{req.reason}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              {req.status === 'Pending' ? (
                                <>
                                  <button onClick={() => handleUpdateLeaveStatus(req.id, 'Approved')} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check className="h-4 w-4 inline" /></button>
                                  <button onClick={() => handleUpdateLeaveStatus(req.id, 'Rejected')} className="p-1 text-rose-600 hover:bg-rose-50 rounded"><XCircle className="h-4 w-4 inline" /></button>
                                </>
                              ) : (
                                <span className="text-slate-400 font-semibold italic text-[10px]">Settled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==============================================
              SCREEN 5: ATTENDANCE & TIME TRACKING
              ============================================== */}
          {}
          {currentTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Timesheets & Work Hours</h2>
                  <p className="text-xs text-slate-500 mt-1">Review punch registers, clock-in times, late flags, and verify contract shifts.</p>
                </div>
                <button className="flex items-center space-x-1 px-4 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-xs">
                  <Download className="h-4 w-4" />
                  <span>Export CSV Timesheet</span>
                </button>
              </div>

              {/* Attendance Registry Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Today's Shift Logs (June 2, 2026)</h3>
                  <span className="text-xs text-indigo-600 font-semibold">Active Shift: 9:00 AM standard standard</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-500">
                    <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                      <tr>
                        <th className="p-4">Staff Member</th>
                        <th className="p-4">Assigned Shift</th>
                        <th className="p-4">Clock In</th>
                        <th className="p-4">Clock Out</th>
                        <th className="p-4">Status Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {ATTENDANCE_LOGS.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800">{log.employeeName}</td>
                          <td className="p-4 text-slate-600">{log.shift}</td>
                          <td className="p-4 text-slate-600">{log.checkIn}</td>
                          <td className="p-4 text-slate-600">{log.checkOut}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              log.status === 'On Time' ? 'bg-emerald-100 text-emerald-800' :
                              log.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SCREEN 6: PAYROLL OVERVIEW
              ============================================== */}
          {}
          {currentTab === 'payroll' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Payroll Run & Salary Matrix</h2>
                  <p className="text-xs text-slate-500 mt-1">Manage cycles, execute direct deposits, and review standard state withholdings.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow">
                  Commit Current Run
                </button>
              </div>

              {/* Payroll stats card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold uppercase text-slate-400">Total Gross Pay</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    ${employees.reduce((acc, emp) => acc + emp.salary, 0).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1">Annual overall projection standard</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold uppercase text-slate-400">Estimated Withholdings</span>
                  <p className="text-2xl font-black text-rose-600 mt-1">
                    -${employees.reduce((acc, emp) => acc + emp.deductions * 12, 0).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1">FICA, state, and standard health plans</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold uppercase text-slate-400">Net Pay Allocated</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    ${(employees.reduce((acc, emp) => acc + emp.salary, 0) - employees.reduce((acc, emp) => acc + emp.deductions * 12, 0)).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Direct Deposit ready</span>
                </div>
              </div>

              {/* Ledger Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm">Monthly Payroll Roster</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
                      <tr>
                        <th className="p-4">Employee</th>
                        <th className="p-4">Base Yearly Salary</th>
                        <th className="p-4">Monthly Deductions</th>
                        <th className="p-4">Monthly Benefits</th>
                        <th className="p-4">Calculated Net Pay / Mo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map(emp => {
                        const baseMonthly = Math.floor(emp.salary / 12);
                        const netPay = baseMonthly - emp.deductions + emp.benefits;
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-800">{emp.name}</td>
                            <td className="p-4 text-slate-600">${emp.salary.toLocaleString()}</td>
                            <td className="p-4 text-rose-600">-${emp.deductions.toLocaleString()}</td>
                            <td className="p-4 text-emerald-600">+${emp.benefits.toLocaleString()}</td>
                            <td className="p-4 font-bold text-slate-950">${netPay.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SCREEN 7: RECRUITMENT / ATS
              ============================================== */}
          {}
          {currentTab === 'recruitment' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recruitment & Applicant Tracking (ATS)</h2>
                <p className="text-xs text-slate-500 mt-1">Organize incoming candidates, run technical evaluations, and process offer packages.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form to log new candidate */}
                <div id="candForm" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Add New Candidate Profile</h3>
                  <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Full Name</label>
                      <input 
                        type="text" 
                        value={newCandidateName}
                        onChange={(e) => setNewCandidateName(e.target.value)}
                        placeholder="e.g. Liam Sterling"
                        className="w-full text-xs mt-1 border border-slate-200 rounded p-2 focus:outline-indigo-600" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Target Role Title</label>
                      <input 
                        type="text" 
                        value={newCandidateRole}
                        onChange={(e) => setNewCandidateRole(e.target.value)}
                        placeholder="e.g. Senior Backend Architect"
                        className="w-full text-xs mt-1 border border-slate-200 rounded p-2 focus:outline-indigo-600" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500">Acquisition Source</label>
                      <select 
                        value={newCandidateSource}
                        onChange={(e) => setNewCandidateSource(e.target.value)}
                        className="w-full text-xs mt-1 border border-slate-200 rounded p-2 focus:outline-indigo-600"
                      >
                        <option>LinkedIn</option>
                        <option>Direct Referral</option>
                        <option>Indeed</option>
                        <option>Recruiter Direct</option>
                      </select>
                    </div>

                    <button className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded hover:bg-indigo-700 transition-colors">
                      Onboard to Stage: Applied
                    </button>
                  </form>
                </div>

                {/* Candidate Kanban / Status Pipelines lists */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Pipeline Records Board</h3>
                  <div className="space-y-4">
                    {candidates.map(cand => (
                      <div key={cand.id} className="p-4 rounded-xl border border-slate-150 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{cand.name}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">{cand.id}</span>
                          </div>
                          <p className="text-xs text-indigo-600 font-semibold mt-1">{cand.roleApplied} &bull; <span className="text-slate-500 font-normal">{cand.source}</span></p>
                          <span className="text-[10px] text-slate-400 block mt-1">Applied Date: {cand.appliedDate}</span>
                        </div>

                        {/* Interactive Kanban pipeline controls */}
                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            cand.stage === 'Offer Stage' ? 'bg-emerald-100 text-emerald-800' :
                            cand.stage === 'Interview' ? 'bg-amber-100 text-amber-800' :
                            cand.stage === 'Technical Assessment' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {cand.stage}
                          </span>
                          
                          {cand.stage !== 'Offer Stage' && (
                            <button 
                              onClick={() => {
                                const stages = ['Applied', 'Screening', 'Technical Assessment', 'Interview', 'Offer Stage'];
                                const currentIndex = stages.indexOf(cand.stage);
                                if (currentIndex < stages.length - 1) {
                                  handleUpdateCandidateStage(cand.id, stages[currentIndex + 1]);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-[10px] transition-colors"
                            >
                              Advance Stage &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==============================================
              SCREEN 8: PERFORMANCE REVIEWS
              ============================================== */}
          {}
          {currentTab === 'performance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Performance Quotient & Review Cycles</h2>
                <p className="text-xs text-slate-500 mt-1">Monitor staff ratings, manage goals, and review manager reviews.</p>
              </div>

              {/* Company review overview checklist */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Overall Performance Ledger</h3>
                <div className="space-y-4">
                  {employees.map(emp => (
                    <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{emp.name}</span>
                        <p className="text-[10px] text-slate-400 font-medium">{emp.role}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-slate-500 font-semibold">Q1 Score: {emp.performanceRating} / 5.0</span>
                        <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-2" style={{ width: `${(emp.performanceRating / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SCREEN 9: ADMIN SETTINGS
              ============================================== */}
          {}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Platform Settings & Security Profiles</h2>
                <p className="text-xs text-slate-500 mt-1">Manage global values, define standard department structures, and review integrations.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Integration systems status lists */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">System Integrations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-xs font-semibold text-slate-700">Google Workspace (SSO)</span>
                      <span className="text-[10px] bg-emerald-150 text-emerald-800 px-2 py-0.5 rounded font-bold">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-xs font-semibold text-slate-700">Slack Notifications Bot</span>
                      <span className="text-[10px] bg-emerald-150 text-emerald-800 px-2 py-0.5 rounded font-bold">Connected</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="text-xs font-semibold text-slate-700">ADP Workforce Payroll</span>
                      <span className="text-[10px] bg-amber-150 text-amber-800 px-2 py-0.5 rounded font-bold">Pending Auth</span>
                    </div>
                  </div>
                </div>

                {/* Company policy checklist documentation */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">Active Company Policies</h3>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="p-3 border border-slate-100 rounded">
                      <span className="font-bold text-slate-800 block">Standard Sick-time Accrual Policy</span>
                      <p className="mt-1">10 days base standard issued every cycle rollover on Jan 1st.</p>
                    </div>
                    <div className="p-3 border border-slate-100 rounded">
                      <span className="font-bold text-slate-800 block">Direct Deposit Processing Window</span>
                      <p className="mt-1">Payments commit processing on the 25th of every month cycle.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}