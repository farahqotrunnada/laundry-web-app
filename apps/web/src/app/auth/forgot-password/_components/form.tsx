'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface ResetPasswordProps {
  //
}

const resetPasswordSchema = yup.object({
  email: yup.string().email().required(),
});

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ ...props }) => {
  const { toast } = useToast();

  const form = useForm<yup.InferType<typeof resetPasswordSchema>>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof resetPasswordSchema>) => {
    try {
      await axios.post('/auth/forgot-password', formData);
      toast({
        title: 'Password reset successful',
        description: "We've sent you an email with a link to reset your password",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reset password failed',
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
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

        <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
          Reset Password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
