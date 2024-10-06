'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface OutletCreateProps {
  //
}

const outletSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  address: yup.string().required(),
  latitude: yup.number().required(),
  longitude: yup.number().required(),
});

const CreateOutletForm: React.FC<OutletCreateProps> = ({ ...props }) => {
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

  React.useEffect(() => {
    if (state) setLocation(state);
  }, [state, setLocation]);

  const form = useForm<yup.InferType<typeof outletSchema>>({
    resolver: yupResolver(outletSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      latitude: 0,
      longitude: 0,
    },
  });

  React.useEffect(() => {
    form.setValue('latitude', location.latitude);
    form.setValue('longitude', location.longitude);
  }, [form, location]);

  const onSubmit = async (formData: yup.InferType<typeof outletSchema>) => {
    confirm({
      title: 'Create Outlet',
      description: 'Are you sure you want to create this outlet? Make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.post('/outlets', formData);
          toast({
            title: 'Outlet created',
            description: 'Outlet has been created successfully',
          });
          router.push('/dashboard/outlets');
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to create outlet',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid items-start gap-8 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Outlet Detail</CardTitle>
            <CardDescription>Make sure to add all the details of your outlet.</CardDescription>
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
                      <Input placeholder='Enter outlet name' {...field} />
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
                      <Textarea placeholder='Enter outlet description' {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center justify-end space-x-4'>
                <Button type='submit' disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
                  Create Outlet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Outlet Location</CardTitle>
            <CardDescription>This information will be used to locate your outlet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter outlet address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='latitude'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter outlet latitude' {...field} />
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
                        <Input placeholder='Enter outlet longitude' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormItem>
                <FormLabel>Location</FormLabel>
                {location ? (
                  <Map location={location} setLocation={setLocation} className='aspect-[4/3]' />
                ) : (
                  <MapLoader />
                )}
              </FormItem>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default CreateOutletForm;
