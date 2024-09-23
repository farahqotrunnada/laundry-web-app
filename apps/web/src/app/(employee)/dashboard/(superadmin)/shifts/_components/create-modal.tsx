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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from '@/lib/axios';
import moment from 'moment';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useShifts } from '@/hooks/use-shifts';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface CreateShiftProps {
  //
}

const shiftSchema = yup.object({
  start: yup
    .string()
    .required('Start time cannot be empty')
    .test('is-time', 'Start should be a valid time', function (value) {
      return moment(value, 'HH:mm').isValid();
    }),

  end: yup
    .string()
    .required('End time cannot be empty')
    .test('is-time', 'End should be a valid time', function (value) {
      return moment(value, 'HH:mm').isValid();
    }),
});

const CreateShiftModal: React.FC<CreateShiftProps> = ({ ...props }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useShifts();
  const [open, setOpen] = React.useState(false);

  const form = useForm<yup.InferType<typeof shiftSchema>>({
    resolver: yupResolver(shiftSchema),
    defaultValues: {
      start: '06:00',
      end: '10:00',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof shiftSchema>) => {
    confirm({
      title: 'Create Shift',
      description: 'Are you sure you want to create this shift? make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.post('/shifts', formData);
          toast({
            title: 'Shift created',
            description: 'Shift has been created successfully',
          });
          form.reset();
          setOpen(false);
          mutate();
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to create shift',
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
          <span>Add Shift</span>
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Shift</DialogTitle>
          <DialogDescription>Create a new shift for the employee.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='start'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Start</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter start hour' type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='end'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift End</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter end hour' type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='mt-4 sm:justify-end'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
                Create Shift
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShiftModal;
