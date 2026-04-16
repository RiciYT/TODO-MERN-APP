import { FormEvent, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardList, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AuthContext from '@/context/auth/AuthContext';
import { User, UserState } from '@/types/user';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
  });
  const [login, setLogin] = useState(false);

  const { isAuthenticated, error, clearError, signin } =
    useContext<UserState>(AuthContext);

  const checkValid = () => {
    if (user.email === '' || user.password === '') {
      toast.error('Enter both email and password.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading('Signing you in...');

    if (!checkValid() || !signin) {
      toast.dismiss(loadingToast);
      return;
    }

    try {
      setLogin(true);
      await signin(user);
      if (!error) {
        toast.success('Signed in successfully.');
      }
      toast.dismiss(loadingToast);
    } catch {
      toast.dismiss(loadingToast);
    }
  };

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setLogin(false);
      toast.error(error);
      if (clearError) {
        clearError();
      }
    }
  }, [clearError, error]);

  return (
    <main className='flex min-h-screen items-center justify-center px-6 py-10'>
      <div className='grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <section className='flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-8'>
          <div className='flex flex-col gap-5'>
            <div className='space-y-3'>
              <h1 className='text-3xl font-semibold tracking-tight text-foreground'>
                Sign in and pick up where you left off
              </h1>
              <p className='max-w-xl text-sm leading-6 text-muted-foreground'>
                A spare workspace for planning, not a marketing page. Review
                your tasks, add what matters next, and leave the noise out of
                the way.
              </p>
            </div>
            <Separator />
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-lg border border-border/80 bg-background/70 p-4'>
                <ClipboardList className='mb-3 text-muted-foreground' />
                <p className='text-sm font-medium text-foreground'>
                  Keep the queue visible
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Draft a task quickly and keep the inbox ordered.
                </p>
              </div>
              <div className='rounded-lg border border-border/80 bg-background/70 p-4'>
                <ShieldCheck className='mb-3 text-muted-foreground' />
                <p className='text-sm font-medium text-foreground'>
                  Stay in one place
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Sign in, make changes, and move back to work without context
                  switching.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Card className='border-border/80 bg-card/90'>
          <CardHeader className='gap-2'>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Use the account you already created for this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium text-foreground' htmlFor='email'>
                  Email
                </label>
                <Input
                  autoComplete='email'
                  id='email'
                  name='email'
                  onChange={onInputChangeHandler}
                  type='email'
                  value={user.email}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium text-foreground' htmlFor='password'>
                  Password
                </label>
                <Input
                  autoComplete='current-password'
                  id='password'
                  name='password'
                  onChange={onInputChangeHandler}
                  type='password'
                  value={user.password}
                />
              </div>
              <Button className='mt-2 w-full' type='submit'>
                {login ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='justify-between border-t border-border/80 pt-6 text-sm text-muted-foreground'>
            <span>Need an account?</span>
            <Link
              className='inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground'
              to='/user/signup'
            >
              Create one
              <ArrowRight className='size-4' />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Login;
