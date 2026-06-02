import { FormEvent, useState } from 'react';
import {
  BadgeCheck,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface LoginPageProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onSignIn: (credentials: { email: string; password: string; role: string }) => Promise<{ ok: boolean; error?: string }>;
}

export function LoginPage({ selectedRole, onRoleChange, onSignIn }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('jane.doe@peopleos.com');
  const [password, setPassword] = useState('peopleos');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Enter your work email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await onSignIn({
      email,
      password,
      role: selectedRole,
    });

    if (!result.ok) {
      setError(result.error ?? 'Unable to sign in.');
    }

    setIsSubmitting(false);
  };

  const roleOptions = [
    { id: 'admin', label: 'HR Admin', email: 'jane.doe@peopleos.com' },
    { id: 'employee', label: 'Employee', email: 'sarah.jenkins@peopleos.com' },
    { id: 'exec', label: 'Executive', email: 'alex.rivera@peopleos.com' }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <section className="w-full max-w-[560px]">
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl">Sign in</h1>
              <p className="text-base text-muted-foreground mt-1">Access your HR workspace</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="mt-8 flex items-center bg-muted p-1 rounded-lg border border-border">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  onRoleChange(role.id);
                  setEmail(role.email);
                }}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedRole === role.id
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 rounded-lg border-0 pl-10 text-base md:text-base"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 rounded-lg border-0 pl-10 pr-10 text-base md:text-base"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" defaultChecked />
                Remember this device
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Reset password
              </button>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-11 rounded-lg text-base" disabled={isSubmitting}>
              <Fingerprint className="w-4 h-4" />
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button type="button" variant="outline" className="w-full h-11 rounded-lg text-base" disabled={isSubmitting}>
              <BadgeCheck className="w-4 h-4" />
              Continue with SSO
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Protected by workforce identity controls
        </p>
      </section>
    </main>
  );
}
