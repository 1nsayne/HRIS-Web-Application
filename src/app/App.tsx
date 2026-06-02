import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './views/Dashboard';
import { EmployeeDirectory } from './views/EmployeeDirectory';
import { Attendance } from './views/Attendance';
import { LeaveManagement } from './views/LeaveManagement';
import { Payroll } from './views/Payroll';
import { Recruitment } from './views/Recruitment';
import { Performance } from './views/Performance';
import { Documents } from './views/Documents';
import { Settings } from './views/Settings';
import { LoginPage } from './views/LoginPage';
import { INITIAL_EMPLOYEES, INITIAL_CANDIDATES, INITIAL_LEAVE_REQUESTS, ATTENDANCE_LOGS } from './data/initialData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRole, setSelectedRole] = useState('admin');
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
  const [punchTime, setPunchTime] = useState<string | null>(null);

  const handleAddLeaveRequest = (type: string, startDate: string, endDate: string, reason: string) => {
    const newRequest = {
      id: `LRQ-${Math.floor(Math.random() * 900) + 100}`,
      employeeId: selectedRole === 'employee' ? 'EMP-001' : 'EMP-003',
      employeeName: selectedRole === 'employee' ? 'Sarah Jenkins' : 'Elena Rostova',
      type,
      startDate,
      endDate,
      status: 'Pending',
      reason
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setNotifications([
      { id: Date.now(), text: `New leave request submitted by ${newRequest.employeeName}`, unread: true, time: 'Just now' },
      ...notifications
    ]);
  };

  const handleUpdateLeaveStatus = (id: string, newStatus: string) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const handleAddCandidate = (name: string, role: string, source: string) => {
    const newCand = {
      id: `CAN-${Math.floor(Math.random() * 900) + 100}`,
      name,
      roleApplied: role,
      stage: 'Applied',
      rating: 0.0,
      source,
      appliedDate: new Date().toISOString().split('T')[0],
      interviewScheduled: null
    };

    setCandidates([newCand, ...candidates]);
  };

  const handleUpdateCandidateStage = (id: string, nextStage: string) => {
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

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleQuickAction = () => {
    if (activeView === 'recruitment') {
      const formEl = document.getElementById('candForm');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    } else if (activeView === 'leave') {
      const formEl = document.getElementById('leaveForm');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveView('directory');
    }
  };

  const handleSignOut = () => {
    setShowNotifications(false);
    setActiveView('dashboard');
    setIsAuthenticated(false);
  };

  const handleAddEmployee = () => {
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
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            selectedRole={selectedRole}
            employees={employees}
            leaveRequests={leaveRequests}
            candidates={candidates}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
            onViewChange={setActiveView}
            isPunchIn={isPunchIn}
            punchTime={punchTime}
            onTogglePunch={handleTogglePunch}
            onAddLeaveRequest={handleAddLeaveRequest}
          />
        );
      case 'directory':
        return (
          <EmployeeDirectory
            employees={employees}
            globalSearch={globalSearch}
            onSelectEmployee={(emp) => {
              setSelectedEmployee(emp);
              setActiveView('profile');
            }}
            onAddEmployee={handleAddEmployee}
          />
        );
      case 'attendance':
        return <Attendance attendanceLogs={ATTENDANCE_LOGS} />;
      case 'leave':
        return (
          <LeaveManagement
            leaveRequests={leaveRequests}
            onAddLeaveRequest={handleAddLeaveRequest}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
            employees={employees}
          />
        );
      case 'payroll':
        return <Payroll employees={employees} />;
      case 'recruitment':
        return (
          <Recruitment
            candidates={candidates}
            onAddCandidate={handleAddCandidate}
            onUpdateCandidateStage={handleUpdateCandidateStage}
          />
        );
      case 'performance':
        return <Performance employees={employees} />;
      case 'documents':
        return <Documents />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return (
          <div className="p-6 space-y-6">
            <button
              onClick={() => setActiveView('directory')}
              className="text-xs text-primary hover:underline"
            >
              ← Back to Directory
            </button>
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-6">
                    <img
                      src={selectedEmployee.avatar}
                      alt={selectedEmployee.name}
                      className="w-24 h-24 rounded-xl object-cover border border-border"
                    />
                    <div className="flex-1">
                      <h2>{selectedEmployee.name}</h2>
                      <p className="text-sm text-primary mt-1">{selectedEmployee.role}</p>
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{selectedEmployee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{selectedEmployee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{selectedEmployee.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-card p-5 rounded-xl border border-border">
                    <h3 className="mb-4 pb-2 border-b border-border">Employment Contract</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department</span>
                        <span>{selectedEmployee.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salary</span>
                        <span>${selectedEmployee.salary.toLocaleString()}/yr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deductions</span>
                        <span className="text-red-600">-${selectedEmployee.deductions.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Benefits</span>
                        <span className="text-green-600">+${selectedEmployee.benefits.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span>{selectedEmployee.dateJoined}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Performance</span>
                        <span>{selectedEmployee.performanceRating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card p-5 rounded-xl border border-border">
                    <h3 className="mb-4 pb-2 border-border">Leave Balance</h3>
                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Vacation</span>
                          <span>{selectedEmployee.leaveBalances.vacation} days</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-2" style={{ width: `${(selectedEmployee.leaveBalances.vacation / 25) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Sick Leave</span>
                          <span>{selectedEmployee.leaveBalances.sick} days</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-2" style={{ width: `${(selectedEmployee.leaveBalances.sick / 15) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Personal</span>
                          <span>{selectedEmployee.leaveBalances.personal} days</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-2" style={{ width: `${(selectedEmployee.leaveBalances.personal / 10) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card p-5 rounded-xl border border-border">
                    <h3 className="mb-4 pb-2 border-b border-border">Compliance Docs</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded text-xs">
                        <span>W-4 Form signed</span>
                        <span className="text-[10px] text-green-600">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded text-xs">
                        <span>I-9 Identity documents</span>
                        <span className="text-[10px] text-green-600">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded text-xs">
                        <span>Direct Deposit Form</span>
                        <span className="text-[10px] text-green-600">Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded text-xs">
                        <span>Non-Disclosure (NDA)</span>
                        <span className="text-[10px] text-amber-600">Pending Update</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <Dashboard
          selectedRole={selectedRole}
          employees={employees}
          leaveRequests={leaveRequests}
          candidates={candidates}
          onUpdateLeaveStatus={handleUpdateLeaveStatus}
          onViewChange={setActiveView}
          isPunchIn={isPunchIn}
          punchTime={punchTime}
          onTogglePunch={handleTogglePunch}
          onAddLeaveRequest={handleAddLeaveRequest}
        />;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        onSignIn={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} onSignOut={handleSignOut} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          globalSearch={globalSearch}
          onSearchChange={setGlobalSearch}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          isPunchIn={isPunchIn}
          punchTime={punchTime}
          onTogglePunch={handleTogglePunch}
          onQuickAction={handleQuickAction}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
