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
import { Loader2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import PasswordMeter from '@/components/password-meter';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { useShifts } from '@/hooks/use-shifts';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface CreateEmployeeModalProps {
  outlet_id: string;
}

const roles = ['Driver', 'OutletAdmin', 'WashingWorker', 'IroningWorker', 'PackingWorker'] as const;

const createUserSchema = yup.object({
  email: yup.string().email().required(),
  fullname: yup.string().required(),
  phone: yup
    .string()
    .min(10, 'Phone number is too short')
    .max(13, 'Phone number is too long')
    .matches(/^\d+$/, 'Phone number must be a number')
    .required(),
  password: yup
    .string()
    .min(10, 'Password is too short')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required(),
  role: yup.string().oneOf(roles).required(),
  shift_id: yup.string().required(),
});

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ outlet_id, ...props }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useSWRConfig();
  const [open, setOpen] = React.useState(false);
  const { data: shifts } = useShifts();

  const form = useForm<yup.InferType<typeof createUserSchema>>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      email: '',
      fullname: '',
      phone: '',
      password: '',
      shift_id: '',
      role: 'Driver',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof createUserSchema>) => {
    confirm({
      title: 'Create Employee',
      description: 'Are you sure you want to create this employee? make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.post('/outlets/' + outlet_id + '/employees', formData);
          toast({
            title: 'Employee created',
            description: 'User has been created successfully',
          });
          form.reset();
          setOpen(false);
          mutate((key) => Array.isArray(key) && key.includes('/outlets/' + outlet_id + '/employees'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to create user',
            description: error.message,
          });
        }
      })
      .catch(() => {
        // do nothing
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full'>
          <Plus className='inline-block w-4 h-4 mr-2' />
          <span>Add Employee</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>Create a new employee for your outlet.</DialogDescription>
        </DialogHeader>
        <div className='h-full overflow-y-scroll max-h-modal hide-scrollbar'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-4 px-1'>
                <FormField
                  control={form.control}
                  name='fullname'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter your full name' {...field} />
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
                        <Input type='number' inputMode='numeric' placeholder='enter your phone' {...field} />
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
                        <Input placeholder='Enter your email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='shift_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select shift' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!shifts || shifts.data.length === 0 ? (
                              <SelectItem value='empty'>No shifts found</SelectItem>
                            ) : (
                              shifts.data.map((shift) => (
                                <SelectItem key={shift.shift_id} value={shift.shift_id}>
                                  {shift.start} - {shift.end}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select role for this employee' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput type='password' placeholder='Enter your password' {...field} />
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
                <Button type='submit' disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
                  Create Employee
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeModal;
