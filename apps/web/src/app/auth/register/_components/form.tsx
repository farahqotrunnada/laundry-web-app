'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface LoginFormProps {
  //
}

const registerSchema = yup.object({
  email: yup.string().email().required(),
  fullname: yup.string().min(6, 'Full name is too short').max(50, 'Full name is too long').required(),
  phone: yup
    .string()
    .min(10, 'Phone number is too short')
    .max(13, 'Phone number is too long')
    .matches(/^\d+$/, 'Phone number must be a number')
    .required(),
});

const RegisterForm: React.FC<LoginFormProps> = ({ ...props }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth();

  const form = useForm<yup.InferType<typeof registerSchema>>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      fullname: '',
      phone: '',
    },
  });

  const onSubmit = async (formData: yup.InferType<typeof registerSchema>) => {
    try {
      await signup(formData);
      toast({
        title: 'Register successful',
        description: 'Please check your email to verify your account',
      });
      router.push('/auth/verify');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Register failed',
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
                <Input
                  placeholder='enter your phone'
                  {...field}
                  inputMode='numeric'
                  pattern='\d*'
                  onKeyDown={(e) => {
                    if (
                      !/^[0-9]$/.test(e.key) &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Tab' &&
                      e.key !== 'ArrowLeft' &&
                      e.key !== 'ArrowRight'
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
          Register
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
