import { Skeleton } from '@/components/ui/skeleton';

const TodosLoader = () => {
  return Array.from({ length: 5 }, (_, i) => (
    <div
      key={`currTod-${i}`}
      className='flex items-center justify-between rounded-xl border border-border/80 bg-background/70 p-4'
    >
      <div className='flex flex-1 flex-col gap-3'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-3/4' />
      </div>
      <div className='flex gap-2'>
        <Skeleton className='h-8 w-24' />
        <Skeleton className='size-8' />
      </div>
    </div>
  ));
};

export default TodosLoader;
