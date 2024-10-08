'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { PasswordInput } from '@/components/password-input';
import Link from 'next/link';

interface LoginFormProps {
  //
}

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const LoginForm: React.FC<LoginFormProps> = ({ ...props }) => {
  const { toast } = useToast();
  const { signin } = useAuth();

  const form = useForm<yup.InferType<typeof loginSchema>>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof loginSchema>) => {
    try {
      await signin(formData);
      toast({
        title: 'Login successful',
        description: 'Logged in successfully',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
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

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel>Password</FormLabel>
              </div>
              <FormControl>
                <PasswordInput type='password' placeholder='Enter your password' {...field} />
              </FormControl>
              <FormMessage />
              <div className='text-right mt-1'>
                <Link href='/auth/forgot-password' className='text-sm font-medium hover:text-primary'>
                  Forgot your password?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
