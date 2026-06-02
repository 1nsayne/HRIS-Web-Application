import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Check, X } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
}

interface LeaveManagementProps {
  leaveRequests: LeaveRequest[];
  onAddLeaveRequest: (type: string, startDate: string, endDate: string, reason: string) => void;
  onUpdateLeaveStatus: (id: string, status: string) => void;
  employees: any[];
}

export function LeaveManagement({ leaveRequests, onAddLeaveRequest, onUpdateLeaveStatus, employees }: LeaveManagementProps) {
  const [activeTab, setActiveTab] = useState('requests');
  const [newLeaveType, setNewLeaveType] = useState('Vacation');
  const [newLeaveStart, setNewLeaveStart] = useState('');
  const [newLeaveEnd, setNewLeaveEnd] = useState('');
  const [newLeaveReason, setNewLeaveReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveStart || !newLeaveEnd || !newLeaveReason) return;
    onAddLeaveRequest(newLeaveType, newLeaveStart, newLeaveEnd, newLeaveReason);
    setNewLeaveStart('');
    setNewLeaveEnd('');
    setNewLeaveReason('');
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'neutral';
    }
  };

  const upcomingLeaves = leaveRequests.filter(r => r.status === 'Approved' && new Date(r.startDate) >= new Date());

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Leave Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage employee leave requests and balances</p>
        </div>
        <button
          onClick={() => {
            const formEl = document.getElementById('leaveForm');
            if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'balances'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Leave Balances
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'calendar'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Calendar View
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div id="leaveForm" className="bg-card border border-border rounded-lg p-5">
            <h3 className="mb-4">Request New Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Leave Type</label>
                <select
                  value={newLeaveType}
                  onChange={(e) => setNewLeaveType(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg p-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Vacation</option>
                  <option>Sick Leave</option>
                  <option>Personal Day</option>
                  <option>Maternity/Paternity</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">From</label>
                  <input
                    type="date"
                    value={newLeaveStart}
                    onChange={(e) => setNewLeaveStart(e.target.value)}
                    className="w-full text-sm border border-border rounded-lg p-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">To</label>
                  <input
                    type="date"
                    value={newLeaveEnd}
                    onChange={(e) => setNewLeaveEnd(e.target.value)}
                    className="w-full text-sm border border-border rounded-lg p-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Reason</label>
                <textarea
                  value={newLeaveReason}
                  onChange={(e) => setNewLeaveReason(e.target.value)}
                  placeholder="Detailed explanation for leave..."
                  className="w-full text-sm border border-border rounded-lg p-2 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
              </div>
              <button className="w-full py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity">
                File Time-off Request
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Employee</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Dates</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Reason</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                            {request.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <p className="text-sm">{request.employeeName}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{request.type}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {request.startDate} to {request.endDate}
                      </td>
                      <td className="py-3 px-4 text-sm max-w-[150px] truncate">{request.reason}</td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={request.status}
                          variant={getStatusVariant(request.status)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        {request.status === 'Pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => onUpdateLeaveStatus(request.id, 'Approved')}
                              className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onUpdateLeaveStatus(request.id, 'Rejected')}
                              className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3>Upcoming Leaves</h3>
            </div>
            <div className="space-y-3">
              {upcomingLeaves.slice(0, 4).map((leave) => (
                <div key={leave.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">{leave.employeeName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{leave.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">{leave.startDate} - {leave.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'balances' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Employee</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Vacation</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Sick Leave</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Personal</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-sm">{emp.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{emp.leaveBalances.vacation} days</td>
                    <td className="py-3 px-4 text-sm">{emp.leaveBalances.sick} days</td>
                    <td className="py-3 px-4 text-sm">{emp.leaveBalances.personal} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">Calendar View</h3>
          <p className="text-sm text-muted-foreground">
            Calendar integration for visualizing team leave schedules
          </p>
        </div>
      )}
    </div>
  );
}
