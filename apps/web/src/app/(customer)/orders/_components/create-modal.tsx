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
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface CreateComplaintModalProps {
  order_id: string;
}

const complaintSchema = yup.object({
  order_id: yup.string().required(),
  description: yup.string().min(10, 'Description is too short').max(250, 'Description is too long').required(),
});

const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({ order_id, ...props }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [open, setOpen] = React.useState(false);

  const form = useForm<yup.InferType<typeof complaintSchema>>({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      order_id: order_id,
      description: '',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof complaintSchema>) => {
    confirm({
      title: 'Create Complaint',
      description: 'Are you sure you want to create this complaint? make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.post('/profile/complaints', formData);
          toast({
            title: 'Complaint created',
            description: 'Complaint has been created successfully',
          });
          form.reset();
          setOpen(false);
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to create complaint',
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
          Create Complaint
        </div>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create Complaint</DialogTitle>
          <DialogDescription>Create a complaint for this order.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='order_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order ID</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your Order ID' {...field} disabled readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter your description' {...field} />
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
                Create Complaint
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateComplaintModal;
