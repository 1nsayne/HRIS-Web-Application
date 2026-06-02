import { Star } from 'lucide-react';

interface PerformanceProps {
  employees: any[];
}

export function Performance({ employees }: PerformanceProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Performance Quotient & Review Cycles</h2>
        <p className="text-sm text-muted-foreground mt-1">Monitor staff ratings, manage goals, and review manager evaluations</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="mb-4">Overall Performance Ledger</h3>
        <div className="space-y-4">
          {employees.map(emp => (
            <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <span className="text-sm">{emp.name}</span>
                <p className="text-[10px] text-muted-foreground mt-1">{emp.role}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-muted-foreground">Q1 Score: {emp.performanceRating} / 5.0</span>
                </div>
                <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-2" style={{ width: `${(emp.performanceRating / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
