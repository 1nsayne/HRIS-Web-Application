import { Search, Bell, Clock, Plus } from 'lucide-react';

interface TopBarProps {
  globalSearch: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  notifications: Array<{ id: number; text: string; unread: boolean; time: string }>;
  onMarkAllRead: () => void;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  isPunchIn: boolean;
  punchTime: string | null;
  onTogglePunch: () => void;
  onQuickAction: () => void;
}

export function TopBar({
  globalSearch,
  onSearchChange,
  selectedRole,
  onRoleChange,
  notifications,
  onMarkAllRead,
  showNotifications,
  onToggleNotifications,
  isPunchIn,
  punchTime,
  onTogglePunch,
  onQuickAction
}: TopBarProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees, records..."
            value={globalSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="hidden md:flex items-center bg-muted p-1 rounded-lg border border-border">
          <span className="text-xs font-semibold text-muted-foreground px-2">View:</span>
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              selectedRole === 'admin' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            HR Admin
          </button>
          <button
            onClick={() => onRoleChange('employee')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              selectedRole === 'employee' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => onRoleChange('exec')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              selectedRole === 'exec' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Executive
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border border-border">
          <Clock className={`w-4 h-4 ${isPunchIn ? 'text-green-600 animate-pulse' : 'text-muted-foreground'}`} />
          <span className="text-xs font-medium text-foreground">
            {isPunchIn ? `In: ${punchTime}` : 'Clocked Out'}
          </span>
          <button
            onClick={onTogglePunch}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
              isPunchIn ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            {isPunchIn ? 'Out' : 'In'}
          </button>
        </div>

        <div className="relative">
          <button
            onClick={onToggleNotifications}
            className="p-2 hover:bg-accent rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-popover rounded-lg shadow-lg border border-border py-2 z-50">
              <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                <span className="text-sm">Notifications</span>
                <button onClick={onMarkAllRead} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-2.5 hover:bg-accent border-b border-border last:border-0 ${
                      notif.unread ? 'bg-accent/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${notif.unread ? 'bg-primary' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="text-xs text-foreground">{notif.text}</p>
                        <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Action</span>
        </button>
      </div>
    </header>
  );
}
