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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useOutletEmployee } from '@/hooks/use-outlet-employee';
import { useSWRConfig } from 'swr';
import { useShifts } from '@/hooks/use-shifts';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface EditEmployeeModalProps {
  outlet_id: string;
  user_id: string;
}

const roles = ['Driver', 'OutletAdmin', 'WashingWorker', 'IroningWorker', 'PackingWorker'] as const;

const updateEmployeeSchema = yup.object({
  email: yup.string().email().required(),
  fullname: yup.string().required(),
  phone: yup
    .string()
    .min(10, 'Phone number is too short')
    .max(13, 'Phone number is too long')
    .matches(/^\d+$/, 'Phone number must be a number')
    .required(),
  role: yup.string().oneOf(roles).required(),
  shift_id: yup.string().required(),
});

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ outlet_id, user_id, ...props }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useSWRConfig();
  const [open, setOpen] = React.useState(false);
  const { data: shifts } = useShifts();
  const { data: employee } = useOutletEmployee(outlet_id, user_id);

  const form = useForm<yup.InferType<typeof updateEmployeeSchema>>({
    resolver: yupResolver(updateEmployeeSchema),
    defaultValues: {
      email: '',
      fullname: '',
      phone: '',
      shift_id: '',
      role: 'Driver',
    },
  });

  React.useEffect(() => {
    if (employee) {
      form.setValue('fullname', employee.data.fullname);
      form.setValue('phone', employee.data.phone || '');
      form.setValue('email', employee.data.email);
      form.setValue('role', employee.data.role);
      form.setValue('shift_id', employee.data.Employee.Shift?.shift_id || '');
    }
  }, [employee, form]);

  const onSubmit = async (formData: yup.InferType<typeof updateEmployeeSchema>) => {
    confirm({
      title: 'Update Employee',
      description: 'Are you sure you want to update this employee? make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.put('/outlets/' + outlet_id + '/employees/' + user_id, formData);
          toast({
            title: 'Employee updated',
            description: 'User has been updated successfully',
          });
          form.reset();
          setOpen(false);
          mutate((key) => Array.isArray(key) && key.includes('/outlets/' + outlet_id + '/employees'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to update user',
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
        <div className='block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-default'>Edit Employee</div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogDescription>Update employee data in this outlet.</DialogDescription>
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
                        <Input placeholder='Enter your email' {...field} disabled readOnly />
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

export default EditEmployeeModal;
