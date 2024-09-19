'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/image-upload';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface CreateLaundryItemProps {
  //
}

const laundryItemSchema = yup.object({
  name: yup.string().required(),
  icon_url: yup.string().url().required(),
});

const CreateLaundryItemForm: React.FC<CreateLaundryItemProps> = ({ ...props }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const form = useForm<yup.InferType<typeof laundryItemSchema>>({
    resolver: yupResolver(laundryItemSchema),
    defaultValues: {
      name: '',
      icon_url: '',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof laundryItemSchema>) => {
    confirm({
      title: 'Create Laundry Item',
      description: 'Are you sure you want to create this laundry item? make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.post('/laundry-items', formData);
          toast({
            title: 'Laundry Item created',
            description: 'Your laundry item has been created successfully',
          });
          router.push('/dashboard/laundry-items');
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to create laundry item',
            description: error.message,
          });
        }
      })
      .catch(() => {
        // do nothing
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Create Laundry Item</CardTitle>
            <CardDescription>Make sure to add all the details of your laundry item.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='icon_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <ImageUpload
                      imageWidth={300}
                      imageHeight={300}
                      asset_folder={'laundry_items'}
                      src={form.watch('icon_url')}
                      eager='w_200,h_200,c_fill'
                      onChangeImage={(original, eager) => form.setValue('icon_url', eager ? eager : original)}
                      className='overflow-hidden border rounded-lg max-w-32 bg-accent aspect-square'
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
              Create Laundry Item
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateLaundryItemForm;
