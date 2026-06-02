import { useState } from 'react';
import { Filter, Download, Plus, Eye } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface EmployeeDirectoryProps {
  employees: any[];
  globalSearch: string;
  onSelectEmployee: (employee: any) => void;
  onAddEmployee: () => void;
}

export function EmployeeDirectory({ employees, globalSearch, onSelectEmployee, onAddEmployee }: EmployeeDirectoryProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = ['all', 'Engineering', 'Product', 'Design', 'People Operations'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
                         emp.role.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Corporate Employee Registry</h2>
          <p className="text-sm text-muted-foreground mt-1">{employees.length} total employees</p>
        </div>
        <button
          onClick={onAddEmployee}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Onboard New Employee
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedDepartment === dept
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Personnel Details</th>
                <th className="text-left py-3 px-4 font-semibold">Department</th>
                <th className="text-left py-3 px-4 font-semibold">Role Title</th>
                <th className="text-left py-3 px-4 font-semibold">Location</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-right py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                      <div>
                        <p className="text-sm">{emp.name}</p>
                        <span className="text-xs text-muted-foreground">{emp.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{emp.department}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{emp.role}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{emp.location}</td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={emp.status}
                      variant={emp.status === 'Active' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectEmployee(emp)}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:bg-primary/10 p-2 rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
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
  );
}
