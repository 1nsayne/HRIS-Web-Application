import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
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

type Role = 'admin' | 'employee' | 'exec';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  title: string | null;
}

const defaultRouteByRole: Record<Role, string> = {
  admin: '/dashboard',
  employee: '/dashboard',
  exec: '/dashboard',
};

const routeAccess: Record<Role, string[]> = {
  admin: ['/dashboard', '/employees', '/attendance', '/leave', '/payroll', '/recruitment', '/performance', '/documents', '/settings'],
  employee: ['/dashboard', '/attendance', '/leave', '/documents', '/settings'],
  exec: ['/dashboard', '/employees', '/payroll', '/recruitment', '/performance', '/documents'],
};

function canAccessRoute(role: Role, pathname: string) {
  return routeAccess[role].some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function routeIdFromPath(pathname: string) {
  if (pathname.startsWith('/employees')) return 'employees';
  return pathname.split('/')[1] || 'dashboard';
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
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

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch('/api/me.php', {
          credentials: 'include',
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setAuthUser(data.user);
        setIsAuthenticated(true);
      } catch {
        // The login screen remains available if the PHP API is not running yet.
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && authUser && location.pathname === '/login') {
      navigate(defaultRouteByRole[authUser.role], { replace: true });
    }
  }, [authUser, isAuthLoading, isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !authUser || location.pathname === '/login') {
      return;
    }

    if (!canAccessRoute(authUser.role, location.pathname)) {
      navigate(defaultRouteByRole[authUser.role], { replace: true });
    }
  }, [authUser, isAuthenticated, location.pathname, navigate]);

  const currentRole = authUser?.role ?? 'employee';
  const activeView = routeIdFromPath(location.pathname);
  const selectedEmployeeId = location.pathname.startsWith('/employees/')
    ? decodeURIComponent(location.pathname.replace('/employees/', ''))
    : '';

  const routeSelectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId) ?? selectedEmployee,
    [employees, selectedEmployee, selectedEmployeeId]
  );

  const handleAddLeaveRequest = (type: string, startDate: string, endDate: string, reason: string) => {
    const isEmployee = currentRole === 'employee';
    const newRequest = {
      id: `LRQ-${Math.floor(Math.random() * 900) + 100}`,
      employeeId: isEmployee ? 'EMP-001' : 'EMP-003',
      employeeName: isEmployee ? (authUser?.name ?? 'Employee') : 'Elena Rostova',
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
    if (location.pathname.startsWith('/recruitment')) {
      const formEl = document.getElementById('candForm');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname.startsWith('/leave')) {
      const formEl = document.getElementById('leaveForm');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    } else if (canAccessRoute(currentRole, '/employees')) {
      navigate('/employees');
    } else {
      navigate('/leave');
    }
  };

  const handleSignIn = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { ok: false, error: data.message ?? 'Invalid email or password.' };
      }

      setAuthUser(data.user);
      setIsAuthenticated(true);
      navigate(defaultRouteByRole[data.user.role as Role], { replace: true });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not reach the PHP auth server. Start Laragon and the PHP API.' };
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Local UI state is still cleared if the API is already down.
    }

    setAuthUser(null);
    setShowNotifications(false);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
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

  const dashboard = (
    <Dashboard
      selectedRole={currentRole}
      employees={employees}
      leaveRequests={leaveRequests}
      candidates={candidates}
      onUpdateLeaveStatus={handleUpdateLeaveStatus}
      onViewChange={(view) => navigate(`/${view}`)}
      isPunchIn={isPunchIn}
      punchTime={punchTime}
      onTogglePunch={handleTogglePunch}
      onAddLeaveRequest={handleAddLeaveRequest}
    />
  );

  const employeeProfile = (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate('/employees')}
        className="text-xs text-primary hover:underline"
      >
        Back to Employees
      </button>
      {routeSelectedEmployee && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-start gap-6">
              <img
                src={routeSelectedEmployee.avatar}
                alt={routeSelectedEmployee.name}
                className="w-24 h-24 rounded-xl object-cover border border-border"
              />
              <div className="flex-1">
                <h2>{routeSelectedEmployee.name}</h2>
                <p className="text-sm text-primary mt-1">{routeSelectedEmployee.role}</p>
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{routeSelectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{routeSelectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{routeSelectedEmployee.location}</span>
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
                  <span>{routeSelectedEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary</span>
                  <span>${routeSelectedEmployee.salary.toLocaleString()}/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deductions</span>
                  <span className="text-red-600">-${routeSelectedEmployee.deductions.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Benefits</span>
                  <span className="text-green-600">+${routeSelectedEmployee.benefits.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span>{routeSelectedEmployee.dateJoined}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Performance</span>
                  <span>{routeSelectedEmployee.performanceRating}/5.0</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <h3 className="mb-4 pb-2 border-border">Leave Balance</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Vacation</span>
                    <span>{routeSelectedEmployee.leaveBalances.vacation} days</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-2" style={{ width: `${(routeSelectedEmployee.leaveBalances.vacation / 25) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Sick Leave</span>
                    <span>{routeSelectedEmployee.leaveBalances.sick} days</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-2" style={{ width: `${(routeSelectedEmployee.leaveBalances.sick / 15) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Personal</span>
                    <span>{routeSelectedEmployee.leaveBalances.personal} days</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-2" style={{ width: `${(routeSelectedEmployee.leaveBalances.personal / 10) * 100}%` }} />
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

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Checking session...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onSignIn={handleSignIn} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => navigate(`/${view}`)}
        onSignOut={handleSignOut}
        role={currentRole}
        userName={authUser?.name}
        userTitle={authUser?.title}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          globalSearch={globalSearch}
          onSearchChange={setGlobalSearch}
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
          <Routes>
            <Route path="/" element={<Navigate to={defaultRouteByRole[currentRole]} replace />} />
            <Route path="/login" element={<Navigate to={defaultRouteByRole[currentRole]} replace />} />
            <Route path="/dashboard" element={dashboard} />
            <Route
              path="/employees"
              element={
                <EmployeeDirectory
                  employees={employees}
                  globalSearch={globalSearch}
                  onSelectEmployee={(emp) => {
                    setSelectedEmployee(emp);
                    navigate(`/employees/${encodeURIComponent(emp.id)}`);
                  }}
                  onAddEmployee={handleAddEmployee}
                />
              }
            />
            <Route path="/employees/:employeeId" element={employeeProfile} />
            <Route path="/attendance" element={<Attendance attendanceLogs={ATTENDANCE_LOGS} />} />
            <Route
              path="/leave"
              element={
                <LeaveManagement
                  leaveRequests={leaveRequests}
                  onAddLeaveRequest={handleAddLeaveRequest}
                  onUpdateLeaveStatus={handleUpdateLeaveStatus}
                  employees={employees}
                />
              }
            />
            <Route path="/payroll" element={<Payroll employees={employees} />} />
            <Route
              path="/recruitment"
              element={
                <Recruitment
                  candidates={candidates}
                  onAddCandidate={handleAddCandidate}
                  onUpdateCandidateStage={handleUpdateCandidateStage}
                />
              }
            />
            <Route path="/performance" element={<Performance employees={employees} />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to={defaultRouteByRole[currentRole]} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
