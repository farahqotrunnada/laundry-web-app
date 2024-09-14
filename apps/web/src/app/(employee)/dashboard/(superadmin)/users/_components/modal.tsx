'use client';

import * as React from 'react';
import * as yup from 'yup';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordMeter from '@/components/password-meter';
import { Plus } from 'lucide-react';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface AddUserModalProps {
  //
}

const createUserSchema = yup.object({
  email: yup.string().email().required(),
  fullname: yup.string().required(),
  phone: yup.string().required(),
  password: yup
    .string()
    .min(10, 'Password is too short')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required(),
});

const AddUserModal: React.FC<AddUserModalProps> = ({ ...props }) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const [open, setOpen] = React.useState(false);

  const form = useForm<yup.InferType<typeof createUserSchema>>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      email: '',
      fullname: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof createUserSchema>) => {
    try {
      await axios.post('/users', formData);
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      mutate((key) => typeof key === 'string' && key.startsWith('/users'));
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to create user',
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full'>
          <Plus className='inline-block w-4 h-4 mr-2' />
          <span>Add Users</span>
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>Create a new employee for your outlet.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='fullname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='enter your full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='enter your phone' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='enter your email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='enter your password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <PasswordMeter password={form.watch('password')} />
            </div>

            <DialogFooter className='mt-4 sm:justify-end'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <Button type='submit'>Create Employee</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
