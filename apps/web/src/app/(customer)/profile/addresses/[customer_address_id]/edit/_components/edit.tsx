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
import { useAddressDetail } from '@/hooks/use-address-detail';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useLocation } from '@/hooks/use-location';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface EditAddressFormProps {
  customer_address_id: string;
}

const addressSchema = yup.object({
  name: yup.string().required(),
  address: yup.string().required().min(10, 'Address is too short').max(100, 'Address is too long'),
  latitude: yup.number().required(),
  longitude: yup.number().required(),
});

const EditAddressForm: React.FC<EditAddressFormProps> = ({ customer_address_id, ...props }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [location, setLocation] = React.useState<Location>(DEFAULT_LOCATION);
  const { data: address } = useAddressDetail(customer_address_id);

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
    if (address) {
      form.setValue('name', address.data.name);
      form.setValue('address', address.data.address);
      setLocation({
        latitude: address.data.latitude,
        longitude: address.data.longitude,
      });
    }
  }, [address, form]);

  React.useEffect(() => {
    form.setValue('latitude', location.latitude);
    form.setValue('longitude', location.longitude);
  }, [form, location]);

  const onSubmit = async (formData: yup.InferType<typeof addressSchema>) => {
    confirm({
      title: 'Update Address',
      description: 'Are you sure you want to update this address? Make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.put('/profile/addresses/' + customer_address_id, formData);
          toast({
            title: 'Address updated',
            description: 'Address has been updated successfully',
          });
          router.push('/profile/addresses');
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to update address',
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
            Update Address
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditAddressForm;
