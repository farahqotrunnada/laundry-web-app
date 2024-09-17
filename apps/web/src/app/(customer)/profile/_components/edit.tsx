'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/image-upload';
import { Input } from '@/components/ui/input';
import Loader from '@/components/loader/loader';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/user';
import { fetcher } from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface ProfileFormProps {
  //
}

const profileSchema = yup.object({
  fullname: yup.string().min(6, 'Full name is too short').max(50, 'Full name is too long').required(),
  phone: yup
    .string()
    .min(10, 'Phone number is too short')
    .max(13, 'Phone number is too long')
    .matches(/^\d+$/, 'Phone number must be a number')
    .required(),
  avatar_url: yup.string().required(),
});

const EditProfileForm: React.FC<ProfileFormProps> = ({ ...props }) => {
  const { toast } = useToast();
  const { update } = useAuth();
  const { confirm } = useConfirm();

  const { data, error, isLoading } = useSWR<{ message: string; data: User }>('/profile', fetcher, {
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to load profile',
        description: error.message,
      });
    },
  });

  const form = useForm<yup.InferType<typeof profileSchema>>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullname: '',
      phone: '',
      avatar_url: '',
    },
  });

  React.useEffect(() => {
    if (data) {
      form.setValue('fullname', data.data.fullname);
      form.setValue('phone', data.data.phone || '');
      form.setValue('avatar_url', data.data.avatar_url || '');
    }
  }, [data, form]);

  const onSubmit = async (formData: yup.InferType<typeof profileSchema>) => {
    confirm({
      title: 'Update Profile',
      description: 'Are you sure you want to update your profile?',
    })
      .then(async () => {
        try {
          await update(formData);
          toast({
            title: 'Profile saved',
            description: 'Your profile has been saved successfully',
          });
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Profile failed',
            description: error.message,
          });
        }
      })
      .catch(() => {
        // do nothing
      });
  };

  if (isLoading) return <Loader />;
  if (error || !data) return <div>Failed to load profile</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
        <div className='grid gap-4'>
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder='enter your email' defaultValue={data.data.email} disabled readOnly />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name='avatar_url'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar Url</FormLabel>
                <ImageUpload
                  imageWidth={300}
                  imageHeight={300}
                  asset_folder={'avatar'}
                  src={form.watch('avatar_url')}
                  eager='w_200,h_200,c_fill'
                  onChangeImage={(original, eager) => form.setValue('avatar_url', eager ? eager : original)}
                  className='overflow-hidden border rounded-full size-32 bg-accent'
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <div className='flex justify-start'>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
