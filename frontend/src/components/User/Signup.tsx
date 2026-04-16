import { FormEvent, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCheck, UserRoundPlus } from 'lucide-react';
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

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [registering, setRegistering] = useState(false);

  const { isRegistered, error, clearError, signup } =
    useContext<UserState>(AuthContext);

  const checkValid = () => {
    if (
      user.email === '' ||
      user.password === '' ||
      user.confirmPassword === '' ||
      user.username === ''
    ) {
      toast.error('Fill in every field before continuing.');
      return false;
    }

    if (user.password !== user.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating your account...');
    if (!checkValid()) {
      toast.dismiss(loadingToast);
      return;
    }

    setRegistering(true);
    try {
      if (signup) {
        await signup({
          email: user.email,
          password: user.password,
          username: user.username,
        });
      }

      if (!error) {
        toast.success('Account created successfully.');
        toast.dismiss(loadingToast);
      }
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
    if (isRegistered) {
      navigate('/');
    }
  }, [isRegistered, navigate]);

  useEffect(() => {
    if (error) {
      setRegistering(false);
      toast.error(error);
      clearError && clearError();
    }
  }, [clearError, error]);

  return (
    <main className='flex min-h-screen items-center justify-center px-6 py-10'>
      <div className='grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
        <Card className='order-2 border-border/80 bg-card/90 lg:order-1'>
          <CardHeader className='gap-2'>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Add the basics once and use the same workspace every day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium text-foreground' htmlFor='username'>
                  Name
                </label>
                <Input
                  id='username'
                  name='username'
                  onChange={onInputChangeHandler}
                  type='text'
                  value={user.username}
                />
              </div>
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
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-foreground' htmlFor='password'>
                    Password
                  </label>
                  <Input
                    autoComplete='new-password'
                    id='password'
                    name='password'
                    onChange={onInputChangeHandler}
                    type='password'
                    value={user.password}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-foreground' htmlFor='confirmPassword'>
                    Confirm password
                  </label>
                  <Input
                    autoComplete='new-password'
                    id='confirmPassword'
                    name='confirmPassword'
                    onChange={onInputChangeHandler}
                    type='password'
                    value={user.confirmPassword}
                  />
                </div>
              </div>
              <Button className='mt-2 w-full' type='submit'>
                {registering ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='justify-between border-t border-border/80 pt-6 text-sm text-muted-foreground'>
            <span>Already registered?</span>
            <Link
              className='inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground'
              to='/user/signin'
            >
              Sign in
              <ArrowRight className='size-4' />
            </Link>
          </CardFooter>
        </Card>
        <section className='order-1 flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-8 lg:order-2'>
          <div className='flex flex-col gap-5'>
            <div className='space-y-3'>
              <h1 className='text-3xl font-semibold tracking-tight text-foreground'>
                Create your account and start organizing work
              </h1>
              <p className='max-w-xl text-sm leading-6 text-muted-foreground'>
                Keep the setup short. Name the account, add credentials, and
                get into the task workspace without extra ceremony.
              </p>
            </div>
            <Separator />
            <div className='space-y-4'>
              <div className='rounded-lg border border-border/80 bg-background/70 p-4'>
                <UserRoundPlus className='mb-3 text-muted-foreground' />
                <p className='text-sm font-medium text-foreground'>
                  One clean workspace
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Account setup and planning stay in the same visual system.
                </p>
              </div>
              <div className='rounded-lg border border-border/80 bg-background/70 p-4'>
                <CheckCheck className='mb-3 text-muted-foreground' />
                <p className='text-sm font-medium text-foreground'>
                  Built for steady use
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  No filler, no onboarding maze, just enough structure to get
                  started.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
