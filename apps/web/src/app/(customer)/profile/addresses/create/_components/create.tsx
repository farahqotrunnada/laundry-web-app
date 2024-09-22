'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { DEFAULT_LOCATION } from '@/lib/constant';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Location } from '@/types/location';
import { MapLoader } from '@/components/loader/map';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/lib/axios';
import dynamic from 'next/dynamic';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useLocation } from '@/hooks/use-location';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface CreateAddressFormProps {
  //
}

const addressSchema = yup.object({
  name: yup.string().required(),
  address: yup.string().required().min(10, 'Address is too short').max(100, 'Address is too long'),
  latitude: yup.number().required(),
  longitude: yup.number().required(),
});

const CreateAddressForm: React.FC<CreateAddressFormProps> = ({ ...props }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { state } = useLocation();
  const [location, setLocation] = React.useState<Location>(DEFAULT_LOCATION);

  const Map = React.useMemo(
    () =>
      dynamic(() => import('@/components/map'), {
        loading: () => <MapLoader />,
        ssr: false,
      }),
    []
  );

  const form = useForm<yup.InferType<typeof addressSchema>>({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
    },
  });

  React.useEffect(() => {
    if (state) setLocation(state);
  }, [state, form]);

  React.useEffect(() => {
    form.setValue('latitude', location.latitude);
    form.setValue('longitude', location.longitude);
  }, [form, location]);

  const onSubmit = async (formData: yup.InferType<typeof addressSchema>) => {
    confirm({
      title: 'Create Address',
      description: 'Are you sure you want to create this address? make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.post('/profile/addresses', formData);
          toast({
            title: 'Address saved',
            description: 'Your address has been saved successfully',
          });
          router.push('/profile/addresses');
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to save address',
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
        <div className='grid gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter label name for address' {...form.register('name')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder='Enter your address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='latitude'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your latitude' {...form.register('latitude')} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='longitude'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your longitude' {...form.register('longitude')} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem>
            <FormLabel>Location</FormLabel>
            {location ? <Map location={location} setLocation={setLocation} className='aspect-video' /> : <MapLoader />}
          </FormItem>
        </div>

        <div className='flex justify-start'>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
            Create Address
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateAddressForm;
