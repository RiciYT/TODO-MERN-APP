import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Page404 = () => {
  return (
    <main className='flex min-h-screen items-center justify-center px-6 py-10'>
      <Card className='w-full max-w-lg border-border/80 bg-card/85'>
        <CardHeader className='gap-2'>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The route does not exist, or the session took you somewhere stale.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-between gap-4'>
          <p className='text-sm leading-6 text-muted-foreground'>
            Return to the main workspace and continue from there.
          </p>
          <Button onClick={() => window.location.assign('/')}>
            <ArrowLeft data-icon='inline-start' />
            Go home
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Page404;
