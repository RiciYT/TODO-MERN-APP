import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  LogOut,
  ArrowUpRight,
  PencilLine,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AuthContext from '@/context/auth/AuthContext';
import TodoContext from '@/context/todo/TodoContext';
import { Todo, TodoState } from '@/types/todo';
import { UserState } from '@/types/user';
import TodoItem from './TodoItem';
import TodosLoader from './TodosLoader';

const TodoLayout = () => {
  const navigate = useNavigate();
  const [currTodo, setCurrTodo] = useState<Todo>({
    title: '',
    description: '',
    completed: false,
  });
  const { logout, user }: UserState = useContext(AuthContext);
  const {
    todos,
    todoLoading,
    loading,
    error,
    getTodos,
    createTodo,
    markComplete,
    deleteTodo,
    clearError,
  } = useContext<TodoState>(TodoContext);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrTodo({
      ...currTodo,
      [e.target.name]: e.target.value,
    });
  };

  const checkValid = () => {
    if (currTodo.title === '' || currTodo.description === '') {
      toast.error('Add both a title and a description.');
      return false;
    }

    return true;
  };

  const clearCurrTodo = () => {
    setCurrTodo({
      title: '',
      description: '',
      completed: false,
    });
  };

  const addTodoHandler = async () => {
    const loadingToast = toast.loading('Adding task...');
    try {
      if (!checkValid()) {
        toast.dismiss(loadingToast);
        return;
      }

      if (!createTodo) {
        toast.error('Something went wrong.');
        return;
      }

      await createTodo(currTodo);
      if (!error) {
        toast.success('Task added.');
        toast.dismiss(loadingToast);
        clearCurrTodo();
      }
    } catch {
      toast.error(error as string);
    }
  };

  const markCompleteHandler = async (id: string) => {
    try {
      const loadingToast = toast.loading('Marking task done...');

      if (!markComplete) {
        toast.error('Something went wrong.');
        return;
      }

      await markComplete(id);
      if (!error && !loading) {
        toast.success('Task marked done.');
        toast.dismiss(loadingToast);
      }
    } catch {
      toast.error(error as string);
    }
  };

  const deleteTodoHandler = async (id: string) => {
    try {
      const loadingToast = toast.loading('Removing task...');

      if (!deleteTodo) {
        toast.error('Something went wrong.');
        return;
      }

      await deleteTodo(id);
      if (!error && !loading) {
        toast.success('Task removed.');
        toast.dismiss(loadingToast);
      }
    } catch {
      toast.error(error as string);
    }
  };

  const logoutHandler = () => {
    logout();
    toast.success('Logged out.');
    navigate('/user/signin');
  };

  useEffect(() => {
    getTodos && getTodos();
  }, [getTodos]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (clearError) {
        clearError();
      }
    }
  }, [clearError, error]);

  return (
    <main className='min-h-screen px-6 py-8'>
      <div className='mx-auto flex max-w-6xl flex-col gap-6'>
        <header className='flex flex-col gap-4 rounded-xl border border-border/80 bg-card/70 p-6 sm:flex-row sm:items-end sm:justify-between'>
          <div className='space-y-3'>
            <Badge variant='outline'>Task workspace</Badge>
            <div className='space-y-2'>
              <h1 className='text-3xl font-semibold tracking-tight text-foreground'>
                Task workspace
              </h1>
              <p className='max-w-2xl text-sm leading-6 text-muted-foreground'>
                Capture what needs attention, keep the queue readable, and move
                finished work out of the way.
              </p>
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <a
              className='inline-flex items-center justify-center rounded-lg border border-border/80 bg-background/70 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              href='https://twitter.com/its_ikD'
              rel='noreferrer'
              target='_blank'
            >
              <span className='text-sm'>X</span>
            </a>
            <a
              className='inline-flex items-center justify-center rounded-lg border border-border/80 bg-background/70 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              href='https://github.com/its-id/TODO-MERN-APP'
              rel='noreferrer'
              target='_blank'
            >
              <ArrowUpRight className='size-4' />
            </a>
            <Button onClick={logoutHandler} variant='outline'>
              <LogOut data-icon='inline-start' />
              Log out
            </Button>
          </div>
        </header>

        <section className='grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]'>
          <Card className='border-border/80 bg-card/80'>
            <CardHeader className='gap-2'>
              <h2 className='text-lg font-semibold text-foreground'>
                Create a task
              </h2>
              <CardDescription>
                Add one clear task at a time and keep the description useful.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium text-foreground' htmlFor='title'>
                  Title
                </label>
                <Input
                  id='title'
                  name='title'
                  onChange={onInputChange}
                  placeholder='Finish the API review'
                  type='text'
                  value={currTodo.title}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-medium text-foreground' htmlFor='description'>
                  Description
                </label>
                <Textarea
                  id='description'
                  name='description'
                  onChange={onInputChange}
                  placeholder='Add enough context so the next pass is easy.'
                  value={currTodo.description}
                />
              </div>
              <Button className='w-full' onClick={addTodoHandler}>
                <Plus data-icon='inline-start' />
                Add task
              </Button>
            </CardContent>
          </Card>

          <Card className='border-border/80 bg-card/80'>
            <CardHeader className='gap-3'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-semibold text-foreground'>Inbox</h2>
                  <CardDescription>
                    {user?.username
                      ? `${user.username}, this is the current queue.`
                      : 'Everything still open lives here.'}
                  </CardDescription>
                </div>
                <Badge variant='secondary'>{todos?.length ?? 0} tasks</Badge>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              {todoLoading ? (
                <TodosLoader />
              ) : todos && todos.length > 0 ? (
                todos.map((todo) => (
                  <TodoItem
                    key={todo._id ?? todo.title}
                    deleteTodoHandler={deleteTodoHandler}
                    id={todo._id as string}
                    markAsDone={markCompleteHandler}
                    todo={todo}
                  />
                ))
              ) : (
                <div className='rounded-xl border border-dashed border-border/80 bg-background/60 p-8'>
                  <PencilLine className='mb-4 text-muted-foreground' />
                  <p className='text-sm font-medium text-foreground'>
                    No tasks yet.
                  </p>
                  <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                    Start with one actionable item. The list will stay focused
                    if each entry is specific.
                  </p>
                  <div className='mt-4'>
                    <Button onClick={addTodoHandler} variant='ghost'>
                      Add your first task
                      <ArrowRight data-icon='inline-end' />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default TodoLayout;
