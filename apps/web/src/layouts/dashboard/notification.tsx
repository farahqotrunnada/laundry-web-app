'use client';

import * as React from 'react';

import { Bell, MailOpen, Trash } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import { Employee, Role, User, UserToken } from '@/types/user';
import { SOCKET_URL } from '@/lib/constant';
import { fetcher } from '@/lib/axios';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationStore } from '@/store/useNotification';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';

interface NotificationProps {
  //
}

interface Toast {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
}

const socket = io(SOCKET_URL);

const Notification: React.FC<NotificationProps> = ({ ...props }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { notifications, append, remove, purge } = useNotificationStore();

  const { data } = useSWR<{
    message: string;
    data: Employee;
  }>(user && user.role !== 'SuperAdmin' && user.role !== 'Customer' && '/profile/employee', fetcher);

  React.useEffect(() => {
    if (user) {
      let room: Role | UserToken['user_id'] = user.role;
      if (data) room = data.data.outlet_id + '-' + user.role;
      if (user.role === 'Customer') room = user.user_id;

      socket.emit('room', room);
      socket.on('notification', ({ title, description, variant = 'default' }: Toast) => {
        toast({
          title,
          description,
          variant,
        });
        append(title, description, variant);
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [data, user, socket, toast]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='relative ml-auto'>
          <Bell className='size-4' />
          <span className='sr-only'>Toggle notifications</span>
          <div className='absolute top-0 right-0 -m-1'>
            <div className='flex items-center justify-center text-xs text-white rounded-full size-4 bg-primary'>
              <span>{notifications.length}</span>
            </div>
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>This is a list of notifications you have received.</SheetDescription>
        </SheetHeader>

        <div className='grid gap-4 py-8'>
          <Button onClick={() => purge()} disabled={notifications.length === 0}>
            <MailOpen className='mr-2 size-4' />
            <span>Mark all as read</span>
          </Button>

          <div className='h-full overflow-y-scroll max-h-modal hide-scrollbar'>
            <div className='grid gap-4'>
              {notifications.map((notification) => (
                <div key={notification.title} className='relative p-6 border rounded-lg bg-card'>
                  <div className='flex flex-col space-y-1'>
                    <span className='text-sm font-medium'>{notification.title}</span>
                    <p className='text-sm text-muted-foreground'>{notification.description}</p>
                  </div>

                  <div className='absolute bottom-0 right-0 m-3'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            onClick={() => remove(notification.id)}
                            className='flex items-center justify-center rounded-lg size-5'>
                            <Trash className='cursor-pointer size-4 text-destructive' />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove Notification</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Notification;
