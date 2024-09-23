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
import { RequestAccess } from '@/types/request-access';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface EditRequestAccessModalProps {
  request_access: RequestAccess;
}

const statuses = ['Pending', 'Accepted', 'Rejected'] as const;

const requestAccessSchema = yup.object({
  job_id: yup.string().required(),
  reason: yup.string().min(40).max(250).required(),
  status: yup.string().oneOf(statuses).required(),
});

const EditRequestAccessModal: React.FC<EditRequestAccessModalProps> = ({ request_access, ...props }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useSWRConfig();
  const [open, setOpen] = React.useState(false);

  const form = useForm<yup.InferType<typeof requestAccessSchema>>({
    resolver: yupResolver(requestAccessSchema),
    defaultValues: {
      job_id: request_access.job_id,
      reason: request_access.reason,
      status: request_access.status,
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof requestAccessSchema>) => {
    confirm({
      title: 'Update Request Access',
      description: 'Are you sure you want to update this request access? make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.put('/request-accesses/' + request_access.request_access_id, formData);
          toast({
            title: 'Request access updated',
            description: 'Request access has been updated successfully',
          });
          form.reset();
          setOpen(false);
          mutate((key) => Array.isArray(key) && key.includes('/request-accesses'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to update request access',
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
        <div className='block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-default'>
          Edit Request Access
        </div>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Update Request Access</DialogTitle>
          <DialogDescription>Update a request access for your job.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='job_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job ID</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your Job ID' {...field} disabled readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter your reason for requesting access' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                Update Request Access
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestAccessModal;
