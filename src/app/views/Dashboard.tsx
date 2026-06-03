import { Users, UserCheck, TrendingUp, Calendar, Briefcase, Check, X, AlertCircle, FileText } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  selectedRole: string;
  currentUserName?: string;
  currentEmployee?: any;
  employees: any[];
  leaveRequests: any[];
  candidates: any[];
  attendanceLogs: any[];
  onUpdateLeaveStatus: (id: string, status: string) => void;
  onViewChange: (view: string) => void;
  isPunchIn: boolean;
  punchTime: string | null;
  onTogglePunch: () => void;
  onAddLeaveRequest: (type: string, start: string, end: string, reason: string) => void;
}

export function Dashboard({
  selectedRole,
  currentUserName,
  currentEmployee,
  employees,
  leaveRequests,
  candidates,
  attendanceLogs,
  onUpdateLeaveStatus,
  onViewChange,
  isPunchIn,
  punchTime,
  onTogglePunch,
  onAddLeaveRequest
}: DashboardProps) {
  const pendingApprovals = leaveRequests.filter(r => r.status === 'Pending');
  const employeeLeaveBalances = currentEmployee?.leaveBalances ?? { vacation: 0, sick: 0, personal: 0 };
  const activeEmployees = employees.filter((employee) => employee.status === 'Active');
  const onLeaveEmployees = employees.filter((employee) => employee.status === 'On Leave');
  const presentCount = attendanceLogs.filter((log) => ['On Time', 'Late'].includes(log.status)).length;
  const lateCount = attendanceLogs.filter((log) => log.status === 'Late').length;
  const excusedCount = attendanceLogs.filter((log) => log.status === 'Excused').length;
  const attendanceRate = attendanceLogs.length ? (presentCount / attendanceLogs.length) * 100 : 0;
  const approvedLeaves = leaveRequests.filter((request) => request.status === 'Approved');
  const adminAttendanceData = ['On Time', 'Late', 'Excused', 'Absent'].map((status) => ({
    status,
    count: attendanceLogs.filter((log) => log.status === status).length,
  }));
  const candidatePipelineData = ['Applied', 'Screening', 'Technical Assessment', 'Interview', 'Offer Stage'].map((stage) => ({
    stage: stage.replace('Technical Assessment', 'Assessment').replace('Offer Stage', 'Offer'),
    count: candidates.filter((candidate) => candidate.stage === stage).length,
  }));
  const totalAnnualSalary = employees.reduce((sum, employee) => sum + employee.salary, 0);
  const totalAnnualBenefits = employees.reduce((sum, employee) => sum + employee.benefits * 12, 0);
  const totalAnnualPayrollBurden = totalAnnualSalary + totalAnnualBenefits;
  const averagePerformance = employees.length
    ? employees.reduce((sum, employee) => sum + employee.performanceRating, 0) / employees.length
    : 0;
  const retentionRate = employees.length ? (activeEmployees.length / employees.length) * 100 : 0;
  const offerStageCount = candidates.filter((candidate) => candidate.stage === 'Offer Stage').length;
  const interviewedCount = candidates.filter((candidate) => ['Interview', 'Offer Stage'].includes(candidate.stage)).length;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const formatCompactCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };
  const departmentMetrics = Object.values(
    employees.reduce<Record<string, { department: string; headcount: number; payroll: number; ratingTotal: number }>>((acc, employee) => {
      if (!acc[employee.department]) {
        acc[employee.department] = {
          department: employee.department,
          headcount: 0,
          payroll: 0,
          ratingTotal: 0,
        };
      }

      acc[employee.department].headcount += 1;
      acc[employee.department].payroll += employee.salary + employee.benefits * 12;
      acc[employee.department].ratingTotal += employee.performanceRating;
      return acc;
    }, {})
  ).map((department) => ({
    ...department,
    payrollShare: totalAnnualPayrollBurden ? Math.round((department.payroll / totalAnnualPayrollBurden) * 100) : 0,
    averageRating: department.headcount ? department.ratingTotal / department.headcount : 0,
  }));
  const recruitingSourceMetrics = Object.values(
    candidates.reduce<Record<string, { source: string; count: number; ratingTotal: number }>>((acc, candidate) => {
      if (!acc[candidate.source]) {
        acc[candidate.source] = {
          source: candidate.source,
          count: 0,
          ratingTotal: 0,
        };
      }

      acc[candidate.source].count += 1;
      acc[candidate.source].ratingTotal += candidate.rating;
      return acc;
    }, {})
  )
    .map((source) => ({
      ...source,
      averageRating: source.count ? source.ratingTotal / source.count : 0,
    }))
    .sort((a, b) => b.averageRating - a.averageRating);
  return (
    <div className="p-6 space-y-6">
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <h2 className="text-xl md:text-2xl">
          {selectedRole === 'admin' && "HR Operational Command Center"}
          {selectedRole === 'employee' && `Welcome back, ${currentUserName ?? currentEmployee?.name ?? 'Employee'}!`}
          {selectedRole === 'exec' && "Workforce Executive Analytics"}
        </h2>
        <p className="text-sm mt-1 opacity-90">
          {selectedRole === 'admin' && "Monitor systems, review pending leaves, and process payroll cycle logs."}
          {selectedRole === 'employee' && "Punch in, submit leave requests, and review your balances."}
          {selectedRole === 'exec' && "Analyze payroll allocation trends, departmental growth metrics, and productivity levels."}
        </p>
      </div>

      {selectedRole === 'admin' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Headcount"
              value={activeEmployees.length}
              change={`${employees.length} total employees`}
              changeType="positive"
              icon={Users}
            />
            <MetricCard
              title="Leaves Pending"
              value={pendingApprovals.length}
              change="Requires Action"
              changeType="neutral"
              icon={Calendar}
            />
            <MetricCard
              title="Active Pipeline"
              value={candidates.length}
              change={`${offerStageCount} offer-stage candidate${offerStageCount === 1 ? '' : 's'}`}
              changeType="neutral"
              icon={Briefcase}
            />
            <MetricCard
              title="Present Today"
              value={presentCount}
              change={`${attendanceRate.toFixed(1)}% attendance`}
              changeType="positive"
              icon={UserCheck}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3>Today's Attendance</h3>
                <button onClick={() => onViewChange('attendance')} className="text-xs text-primary hover:underline">
                  Open timesheets
                </button>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={adminAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3>Candidate Pipeline</h3>
                <button onClick={() => onViewChange('recruitment')} className="text-xs text-primary hover:underline">
                  Open ATS
                </button>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={candidatePipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <button
              onClick={() => onViewChange('leave')}
              className="bg-card border border-border rounded-lg p-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Leave Queue</span>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl mt-3">{pendingApprovals.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{approvedLeaves.length} approved leave records</p>
            </button>
            <button
              onClick={() => onViewChange('attendance')}
              className="bg-card border border-border rounded-lg p-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Attendance Exceptions</span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl mt-3">{lateCount + excusedCount}</p>
              <p className="text-xs text-muted-foreground mt-1">{lateCount} late, {excusedCount} excused today</p>
            </button>
            <button
              onClick={() => onViewChange('payroll')}
              className="bg-card border border-border rounded-lg p-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Payroll Run</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl mt-3">{formatCompactCurrency(totalAnnualPayrollBurden)}</p>
              <p className="text-xs text-muted-foreground mt-1">Annual salary and benefits burden</p>
            </button>
            <button
              onClick={() => onViewChange('documents')}
              className="bg-card border border-border rounded-lg p-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Compliance Docs</span>
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl mt-3">8</p>
              <p className="text-xs text-muted-foreground mt-1">Policies, templates, and compliance files</p>
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>Pending Approvals</h3>
              <button onClick={() => onViewChange('leave')} className="text-xs text-primary hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 uppercase">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingApprovals.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/30">
                      <td className="p-3">{req.employeeName}</td>
                      <td className="p-3">
                        <StatusBadge status={req.type} variant="info" />
                      </td>
                      <td className="p-3 text-muted-foreground">{req.startDate} to {req.endDate}</td>
                      <td className="p-3 max-w-[150px] truncate text-muted-foreground">{req.reason}</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => onUpdateLeaveStatus(req.id, 'Approved')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onUpdateLeaveStatus(req.id, 'Rejected')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingApprovals.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
                        No pending approvals
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedRole === 'employee' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card p-5 rounded-xl border border-border flex items-center justify-between">
              <div>
                <h3>Today's Timesheet Punch</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Shift Schedule: Regular Office Hours (09:00 AM - 05:00 PM)
                </p>
              </div>
              <button
                onClick={onTogglePunch}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                  isPunchIn ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                {isPunchIn ? 'Punch Out' : 'Punch In'}
              </button>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <h3 className="mb-4">My Leave Allocations</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <span className="text-xs text-muted-foreground">Vacation Balance</span>
                  <p className="text-2xl mt-1">{employeeLeaveBalances.vacation} Days</p>
                  <span className="text-[10px] text-primary block mt-1">Acquired</span>
                </div>
                <div className="p-4 bg-green-100 rounded-lg text-center">
                  <span className="text-xs text-muted-foreground">Sick Leaves</span>
                  <p className="text-2xl mt-1">{employeeLeaveBalances.sick} Days</p>
                  <span className="text-[10px] text-green-600 block mt-1">Standard</span>
                </div>
                <div className="p-4 bg-amber-100 rounded-lg text-center">
                  <span className="text-xs text-muted-foreground">Personal Leave</span>
                  <p className="text-2xl mt-1">{employeeLeaveBalances.personal} Days</p>
                  <span className="text-[10px] text-amber-600 block mt-1">Emergency</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border">
            <h3 className="mb-4">Request Time Off</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddLeaveRequest(
                  formData.get('type') as string,
                  formData.get('start') as string,
                  formData.get('end') as string,
                  formData.get('reason') as string
                );
                e.currentTarget.reset();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Leave Type</label>
                <select
                  name="type"
                  className="w-full text-xs border border-border rounded-lg p-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Vacation</option>
                  <option>Sick Leave</option>
                  <option>Personal Day</option>
                  <option>Maternity/Paternity</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">From</label>
                  <input
                    type="date"
                    name="start"
                    className="w-full text-xs border border-border rounded-lg p-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">To</label>
                  <input
                    type="date"
                    name="end"
                    className="w-full text-xs border border-border rounded-lg p-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Justification</label>
                <textarea
                  name="reason"
                  placeholder="Reason for request..."
                  className="w-full text-xs border border-border rounded-lg p-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={2}
                />
              </div>
              <button className="w-full py-2 bg-primary text-primary-foreground text-xs rounded-lg hover:opacity-90 transition-opacity">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedRole === 'exec' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payroll Burden Run-Rate</p>
              <h3 className="text-3xl mt-1">{formatCompactCurrency(totalAnnualPayrollBurden)}<span className="text-sm text-muted-foreground">/Year</span></h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>{formatCurrency(totalAnnualBenefits)} annual benefits load</span>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Talent Retention</p>
              <h3 className="text-3xl mt-1">{retentionRate.toFixed(1)}%</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{activeEmployees.length} active, {onLeaveEmployees.length} on leave</span>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mean Employee Rating</p>
              <h3 className="text-3xl mt-1">{averagePerformance.toFixed(2)} / 5.00</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <span>{interviewedCount} late-stage candidates, {offerStageCount} offer ready</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card p-5 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3>Department Cost Breakdown</h3>
                <span className="text-xs text-muted-foreground">{employees.length} employees</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={departmentMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => formatCompactCurrency(Number(value))} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Payroll burden']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="payroll" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3>Recruiting Pipeline</h3>
                <button onClick={() => onViewChange('recruitment')} className="text-xs text-primary hover:underline">
                  Inspect
                </button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={candidatePipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {recruitingSourceMetrics.slice(0, 3).map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-2 bg-muted/40 rounded text-xs">
                    <span>{source.source}</span>
                    <span className="text-primary">{source.count} candidates, {source.averageRating.toFixed(1)} avg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>Department Health</h3>
              <button onClick={() => onViewChange('performance')} className="text-xs text-primary hover:underline">
                View performance
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {departmentMetrics.map((department) => (
                <div key={department.department} className="p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm">{department.department}</p>
                      <p className="text-xs text-muted-foreground mt-1">{department.headcount} employees</p>
                    </div>
                    <span className="text-xs text-primary">{department.averageRating.toFixed(1)} / 5</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Payroll share</span>
                      <span>{department.payrollShare}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${department.payrollShare}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{formatCurrency(department.payroll)} annual burden</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
