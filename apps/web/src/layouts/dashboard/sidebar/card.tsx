import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface SidebarCardProps {
  //
}

const SidebarCard: React.FC<SidebarCardProps> = ({ ...props }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Welcome Back</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          Hello, <span className='text-primary'>{user.fullname}</span>! You're currently login with {user.role}{' '}
          privileges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href='/profile'>
          <Button className='justify-start w-full' size='sm'>
            <User2 className='w-4 h-4 mr-2' />
            My Account
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SidebarCard;
