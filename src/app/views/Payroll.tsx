import { Download, DollarSign, TrendingUp } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface PayrollProps {
  employees: any[];
}

export function Payroll({ employees }: PayrollProps) {
  const totalGross = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.deductions * 12, 0);
  const totalNet = totalGross - totalDeductions;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const payPeriods = [
    { period: 'June 2026', totalPayout: 720450, employees: 153, status: 'processing' },
    { period: 'May 2026', totalPayout: 715300, employees: 150, status: 'completed' },
    { period: 'April 2026', totalPayout: 708900, employees: 148, status: 'completed' },
    { period: 'March 2026', totalPayout: 695200, employees: 145, status: 'completed' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Payroll Run & Salary Matrix</h2>
          <p className="text-sm text-muted-foreground mt-1">Current pay period: June 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Commit Current Run
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Gross Pay</p>
              <p className="text-2xl mt-2">{formatCurrency(totalGross)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Deductions</p>
              <p className="text-2xl mt-2">{formatCurrency(totalDeductions)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Net Pay</p>
              <p className="text-2xl mt-2">{formatCurrency(totalNet)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3>Monthly Payroll Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 uppercase">
              <tr>
                <th className="p-4">Employee</th>
                <th className="text-right p-4">Base Yearly Salary</th>
                <th className="text-right p-4">Monthly Deductions</th>
                <th className="text-right p-4">Monthly Benefits</th>
                <th className="text-right p-4">Net Pay / Mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map(emp => {
                const baseMonthly = Math.floor(emp.salary / 12);
                const netPay = baseMonthly - emp.deductions + emp.benefits;
                return (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-sm">{emp.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">{formatCurrency(emp.salary)}</td>
                    <td className="p-4 text-right text-red-600">-{formatCurrency(emp.deductions)}</td>
                    <td className="p-4 text-right text-green-600">+{formatCurrency(emp.benefits)}</td>
                    <td className="p-4 text-right">{formatCurrency(netPay)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="mb-4">Pay Period History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Pay Period</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground">Total Payout</th>
                <th className="text-right py-3 px-4 text-sm text-muted-foreground">Employees</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {payPeriods.map((period, idx) => (
                <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">{period.period}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(period.totalPayout)}</td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground">{period.employees}</td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                      variant={period.status === 'completed' ? 'success' : 'info'}
                    />
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
