import { CheckCheck, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Todo } from '@/types/todo';

type CompleteTodoHandler = (id: string) => void;

const TodoItem = ({
  todo,
  id,
  markAsDone,
  deleteTodoHandler,
}: {
  todo: Todo;
  id: string;
  markAsDone: CompleteTodoHandler;
  deleteTodoHandler: CompleteTodoHandler;
}) => {
  return (
    <Card className='border-border/80 bg-background/70'>
      <CardContent className='flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between'>
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <h3
              className={`text-sm font-medium text-foreground ${
                todo.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {todo.title}
            </h3>
            <Badge variant={todo.completed ? 'secondary' : 'outline'}>
              {todo.completed ? 'Done' : 'Open'}
            </Badge>
          </div>
          <p
            className={`text-sm leading-6 text-muted-foreground ${
              todo.completed ? 'line-through' : ''
            }`}
          >
            {todo.description}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            disabled={todo.completed}
            onClick={() => markAsDone(id)}
            variant='secondary'
          >
            <CheckCheck data-icon='inline-start' />
            Mark done
          </Button>
          <Button
            aria-label={`Delete ${todo.title}`}
            onClick={() => deleteTodoHandler(id)}
            size='icon'
            variant='ghost'
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
