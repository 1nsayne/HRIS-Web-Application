import { Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface AttendanceProps {
  attendanceLogs: any[];
  role?: 'admin' | 'employee' | 'exec';
  employeeName?: string;
  isPunchIn?: boolean;
  punchTime?: string | null;
  onTogglePunch?: () => void;
}

export function Attendance({ attendanceLogs, role = 'admin', employeeName, isPunchIn = false, punchTime, onTogglePunch }: AttendanceProps) {
  const isEmployee = role === 'employee';
  const visibleLogs = isEmployee && employeeName
    ? attendanceLogs.filter((log) => log.employeeName === employeeName)
    : attendanceLogs;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Late': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'Excused': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'On Time': return 'success';
      case 'Late': return 'warning';
      case 'Excused': return 'info';
      default: return 'error';
    }
  };

  const presentCount = visibleLogs.filter(a => a.status === 'On Time').length;
  const lateCount = visibleLogs.filter(a => a.status === 'Late').length;
  const excusedCount = visibleLogs.filter(a => a.status === 'Excused').length;

  const companyWeeklyStats = [
    { day: 'Monday', present: 145, late: 5, absent: 3 },
    { day: 'Tuesday', present: 148, late: 3, absent: 2 },
    { day: 'Wednesday', present: 142, late: 8, absent: 3 },
    { day: 'Thursday', present: 150, late: 2, absent: 1 },
    { day: 'Friday', present: 138, late: 10, absent: 5 },
  ];

  const employeeWeeklyStats = [
    { day: 'Monday', checkIn: '08:55 AM', checkOut: '05:30 PM', hours: '8h 35m', status: 'On Time' },
    { day: 'Tuesday', checkIn: '09:01 AM', checkOut: '05:33 PM', hours: '8h 32m', status: 'On Time' },
    { day: 'Wednesday', checkIn: '08:58 AM', checkOut: '05:28 PM', hours: '8h 30m', status: 'On Time' },
    { day: 'Thursday', checkIn: '09:08 AM', checkOut: '05:36 PM', hours: '8h 28m', status: 'Late' },
    { day: 'Friday', checkIn: '--', checkOut: '--', hours: '--', status: 'Scheduled' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{isEmployee ? 'My Timesheets & Work Hours' : 'Timesheets & Work Hours'}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isEmployee ? 'Review your clock activity and weekly work-hour context' : 'Today, June 2, 2026'}
          </p>
        </div>
        {!isEmployee && (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Export CSV Timesheet
          </button>
        )}
      </div>

      {isEmployee && (
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <h3>Today's Punch</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isPunchIn ? `Clocked in at ${punchTime}` : 'You are currently clocked out'}
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">On Time</p>
              <p className="text-2xl mt-2">{presentCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Late</p>
              <p className="text-2xl mt-2">{lateCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Excused</p>
              <p className="text-2xl mt-2">{excusedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Attendance Rate</p>
              <p className="text-2xl mt-2">{isEmployee ? '100%' : '96.7%'}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3>Today's Shift Logs (June 2, 2026)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Staff Member</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Assigned Shift</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Clock In</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Clock Out</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status Flag</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((log) => (
                <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">{log.employeeName}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{log.shift}</td>
                  <td className="py-3 px-4 text-sm">{log.checkIn}</td>
                  <td className="py-3 px-4 text-sm">{log.checkOut}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <StatusBadge
                        status={log.status}
                        variant={getStatusVariant(log.status)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {visibleLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-sm text-muted-foreground">
                    No timesheet records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="mb-4">{isEmployee ? 'My Weekly Timesheet Summary' : 'Weekly Attendance Summary'}</h3>
        <div className="overflow-x-auto">
          {isEmployee ? (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Day</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Clock In</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Clock Out</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hours</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {employeeWeeklyStats.map((stat) => (
                  <tr key={stat.day} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">{stat.day}</td>
                    <td className="py-3 px-4 text-sm">{stat.checkIn}</td>
                    <td className="py-3 px-4 text-sm">{stat.checkOut}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{stat.hours}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={stat.status} variant={getStatusVariant(stat.status)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Day</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Present</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Late</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Absent</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {companyWeeklyStats.map((stat, idx) => {
                  const total = stat.present + stat.late + stat.absent;
                  const percentage = ((stat.present + stat.late) / total * 100).toFixed(1);

                  return (
                    <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">{stat.day}</td>
                      <td className="py-3 px-4 text-sm text-green-600">{stat.present}</td>
                      <td className="py-3 px-4 text-sm text-amber-600">{stat.late}</td>
                      <td className="py-3 px-4 text-sm text-red-600">{stat.absent}</td>
                      <td className="py-3 px-4 text-sm">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
