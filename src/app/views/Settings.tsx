import { Shield, Users, Building2, Globe, Bell, Lock } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export function Settings() {
  const userRoles = [
    { id: 1, name: 'Admin', users: 3, permissions: ['Full Access'], description: 'Complete system access' },
    { id: 2, name: 'HR Manager', users: 5, permissions: ['Employee Management', 'Payroll', 'Leave'], description: 'HR operations access' },
    { id: 3, name: 'Manager', users: 12, permissions: ['Team View', 'Approve Leave', 'Performance'], description: 'Team management access' },
    { id: 4, name: 'Employee', users: 133, permissions: ['Self Service'], description: 'Personal data access only' },
  ];

  const departments = [
    { name: 'Engineering', employees: 45, manager: 'John Smith' },
    { name: 'Design', employees: 18, manager: 'Sarah Wilson' },
    { name: 'Marketing', employees: 22, manager: 'Emily Rodriguez' },
    { name: 'Sales', employees: 28, manager: 'David Kim' },
    { name: 'HR', employees: 8, manager: 'Jane Doe' },
    { name: 'Finance', employees: 12, manager: 'James Wilson' },
  ];

  const integrations = [
    { name: 'Slack', status: 'connected', description: 'Team communication' },
    { name: 'Google Workspace', status: 'connected', description: 'Email and calendar sync' },
    { name: 'Zoom', status: 'connected', description: 'Video conferencing' },
    { name: 'QuickBooks', status: 'disconnected', description: 'Accounting integration' },
    { name: 'DocuSign', status: 'connected', description: 'Document signing' },
  ];

  const companyPolicies = [
    { name: 'Work Hours', value: '9:00 AM - 6:00 PM' },
    { name: 'Annual Leave', value: '15 days per year' },
    { name: 'Sick Leave', value: '10 days per year' },
    { name: 'Remote Work', value: 'Hybrid (3 days office)' },
    { name: 'Probation Period', value: '3 months' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage system configuration, roles, and company policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3>User Roles & Permissions</h3>
          </div>
          <div className="space-y-3">
            {userRoles.map((role) => (
              <div key={role.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm mb-1">{role.name}</h4>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  <StatusBadge status={`${role.users} users`} variant="info" />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {role.permissions.map((permission, idx) => (
                    <span key={idx} className="px-2 py-1 bg-muted text-xs rounded">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary" />
            <h3>Departments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-2 px-3 text-sm text-muted-foreground">Department</th>
                  <th className="text-left py-2 px-3 text-sm text-muted-foreground">Employees</th>
                  <th className="text-left py-2 px-3 text-sm text-muted-foreground">Manager</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">{dept.name}</td>
                    <td className="py-3 px-3 text-sm text-muted-foreground">{dept.employees}</td>
                    <td className="py-3 px-3 text-sm text-muted-foreground">{dept.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3>Integrations</h3>
          </div>
          <div className="space-y-3">
            {integrations.map((integration, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-sm">{integration.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{integration.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                    variant={integration.status === 'connected' ? 'success' : 'neutral'}
                  />
                  <button className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded transition-colors">
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h3>Company Policies</h3>
          </div>
          <div className="space-y-3">
            {companyPolicies.map((policy, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <p className="text-sm text-muted-foreground">{policy.name}</p>
                <p className="text-sm">{policy.value}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm">
            Edit Policies
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3>Notification Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm">Leave Request Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">Notify managers when employees request leave</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm">Attendance Alerts</p>
              <p className="text-xs text-muted-foreground mt-1">Alert when employees are late or absent</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm">Birthday Reminders</p>
              <p className="text-xs text-muted-foreground mt-1">Remind HR about upcoming employee birthdays</p>
            </div>
            <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm">Performance Review Due</p>
              <p className="text-xs text-muted-foreground mt-1">Notify when performance reviews are approaching</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
