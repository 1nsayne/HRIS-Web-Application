import { Users, UserCheck, UserX, TrendingUp, Calendar, Briefcase, Check, X } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  selectedRole: string;
  employees: any[];
  leaveRequests: any[];
  candidates: any[];
  onUpdateLeaveStatus: (id: string, status: string) => void;
  onViewChange: (view: string) => void;
  isPunchIn: boolean;
  punchTime: string | null;
  onTogglePunch: () => void;
  onAddLeaveRequest: (type: string, start: string, end: string, reason: string) => void;
}

export function Dashboard({
  selectedRole,
  employees,
  leaveRequests,
  candidates,
  onUpdateLeaveStatus,
  onViewChange,
  isPunchIn,
  punchTime,
  onTogglePunch,
  onAddLeaveRequest
}: DashboardProps) {
  const attendanceData = [
    { day: 'Mon', present: 145, absent: 8 },
    { day: 'Tue', present: 148, absent: 5 },
    { day: 'Wed', present: 142, absent: 11 },
    { day: 'Thu', present: 150, absent: 3 },
    { day: 'Fri', present: 138, absent: 15 },
  ];

  const hiringData = [
    { month: 'Jan', hired: 8 },
    { month: 'Feb', hired: 12 },
    { month: 'Mar', hired: 15 },
    { month: 'Apr', hired: 10 },
    { month: 'May', hired: 18 },
    { month: 'Jun', hired: 14 },
  ];

  const pendingApprovals = leaveRequests.filter(r => r.status === 'Pending');
  const presentCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;

  return (
    <div className="p-6 space-y-6">
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <h2 className="text-xl md:text-2xl">
          {selectedRole === 'admin' && "HR Operational Command Center"}
          {selectedRole === 'employee' && "Welcome back, Sarah Jenkins!"}
          {selectedRole === 'exec' && "Workforce Executive Analytics"}
        </h2>
        <p className="text-sm mt-1 opacity-90">
          {selectedRole === 'admin' && "Monitor systems, review pending leaves, and process payroll cycle logs."}
          {selectedRole === 'employee' && "Submit vacation requests, view timesheets, and review quarterly targets."}
          {selectedRole === 'exec' && "Analyze payroll allocation trends, departmental growth metrics, and productivity levels."}
        </p>
      </div>

      {selectedRole === 'admin' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Headcount"
              value={employees.length}
              change="+2.4% vs previous cycle"
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
              change="3 Interviews scheduled"
              changeType="neutral"
              icon={Briefcase}
            />
            <MetricCard
              title="Present Today"
              value={presentCount}
              change="96.7% attendance"
              changeType="positive"
              icon={UserCheck}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="mb-4">Weekly Attendance</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="present" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="mb-4">Hiring Trend</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={hiringData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="hired" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
                  <p className="text-2xl mt-1">18 Days</p>
                  <span className="text-[10px] text-primary block mt-1">Acquired</span>
                </div>
                <div className="p-4 bg-green-100 rounded-lg text-center">
                  <span className="text-xs text-muted-foreground">Sick Leaves</span>
                  <p className="text-2xl mt-1">10 Days</p>
                  <span className="text-[10px] text-green-600 block mt-1">Standard</span>
                </div>
                <div className="p-4 bg-amber-100 rounded-lg text-center">
                  <span className="text-xs text-muted-foreground">Personal Leave</span>
                  <p className="text-2xl mt-1">4 Days</p>
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
              <h3 className="text-3xl mt-1">$575,000<span className="text-sm text-muted-foreground">/Year</span></h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>Within budget</span>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Talent Retention</p>
              <h3 className="text-3xl mt-1">94.8%</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>Industry: 88.2%</span>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mean Employee Rating</p>
              <h3 className="text-3xl mt-1">4.62 / 5.00</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <span>Based on Q1 evaluations</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card p-5 rounded-xl border border-border">
              <h3 className="mb-4">Department Cost Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Engineering</span>
                    <span>$250,000 (43%)</span>
                  </div>
                  <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '43%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Product & Design</span>
                    <span>$230,000 (40%)</span>
                  </div>
                  <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                    <div className="bg-chart-2 h-2.5 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>People Operations</span>
                    <span>$95,000 (17%)</span>
                  </div>
                  <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '17%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-5 rounded-xl border border-border">
              <h3 className="mb-4">Recruiting Channel ROI</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <span className="text-xs">Direct Referrals</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Top ROI (4.8)</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <span className="text-xs">LinkedIn Pipeline</span>
                  <span className="text-xs bg-chart-2/10 text-chart-2 px-2 py-1 rounded">Consistent (4.5)</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <span className="text-xs">Indeed Listings</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Variable (3.9)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
