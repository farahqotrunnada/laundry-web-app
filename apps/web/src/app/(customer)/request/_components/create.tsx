'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { MapLoader } from '@/components/loader/map';
import axios from '@/lib/axios';
import dynamic from 'next/dynamic';
import { useAddresses } from '@/hooks/use-addresses';
import useConfirm from '@/hooks/use-confirm';
import { useForm } from 'react-hook-form';
import { useNearestOutlet } from '@/hooks/use-nearest-outlet';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface RequestOrderFormProps {
  //
}

const requestOrderSchema = yup.object({
  customer_address_id: yup.string().required("Address is required"),
  outlet_id: yup.string().required("Outlet is required"),
});

const CreateRequestForm: React.FC<RequestOrderFormProps> = ({ ...props }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [addressOpen, setAddressOpen] = React.useState(false);
  const [outletOpen, setOutletOpen] = React.useState(false);

  const MapRange = React.useMemo(
    () =>
      dynamic(() => import('@/components/map-range'), {
        loading: () => <MapLoader />,
        ssr: false,
      }),
    []
  );

  const form = useForm<yup.InferType<typeof requestOrderSchema>>({
    resolver: yupResolver(requestOrderSchema),
    defaultValues: {
      customer_address_id: '',
      outlet_id: '',
    },
  });

  const outlet_id = form.watch('outlet_id');
  const customer_address_id = form.watch('customer_address_id');

  const { data: addresses } = useAddresses();
  const { data: distances } = useNearestOutlet(customer_address_id);

  const address = addresses && addresses.data.find((item) => item.customer_address_id === customer_address_id);
  const distance = distances && distances.data.find((item) => item.outlet.outlet_id === outlet_id);

  const onSubmit = async (formData: yup.InferType<typeof requestOrderSchema>) => {
    confirm({
      title: 'Create Order',
      description: 'Are you sure you want to request this order? Make sure the details are correct.',
    })
      .then(async () => {
        try {
          await axios.post('/deliveries/request', formData);
          toast({
            title: 'Order created',
            description: 'Order has been created successfully',
          });
          router.push('/orders');
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to create order',
            description: error.message,
          });
        }
      })
      .catch(() => {
        // do nothing
      });
  };

  if (!addresses || addresses.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>Create Order</CardTitle>
          <CardDescription>Create new laundry order to the nearest outlet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center w-full h-96'>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-center'>
                <p className='text-2xl font-bold'>No addresses found</p>
                <p className='text-muted-foreground'>Please add your addresses to start creating orders.</p>
              </div>
              <Link href='/profile/addresses/create' className='mt-4'>
                <Button className='mt-4'>Add Address</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid items-start gap-8 lg:grid-cols-5'>
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Create Order</CardTitle>
            <CardDescription>Create new laundry order to the nearest outlet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='customer_address_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Addresses</FormLabel>
                    <Popover open={addressOpen} onOpenChange={setAddressOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={!addresses || addresses.data.length === 0}
                            variant='outline'
                            role='combobox'
                            className='justify-between w-full'>
                            {field.value && address ? address.name : 'Select address'}
                            <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0 popover-content-width-full' align='end'>
                        <Command>
                          <CommandList>
                            <CommandEmpty>No address found.</CommandEmpty>
                            <CommandGroup>
                              {addresses.data.map((address) => (
                                <CommandItem
                                  key={address.customer_address_id}
                                  value={address.customer_address_id}
                                  onSelect={() => {
                                    form.setValue('customer_address_id', address.customer_address_id);
                                    setAddressOpen(false);
                                  }}>
                                  <div className='flex flex-col'>
                                    <div className='flex items-center space-x-2'>
                                      <span className='text-sm font-medium'>{address.name}</span>
                                      {address.is_primary && <Badge>Primary</Badge>}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>{address.address}</div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='outlet_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nearest Outlets</FormLabel>
                    <Popover open={outletOpen} onOpenChange={setOutletOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={!distances || distances.data.length === 0}
                            variant='outline'
                            role='combobox'
                            className='justify-between w-full'>
                            {field.value && distance ? distance.outlet.name : 'Select outlet'}
                            <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0 popover-content-width-full' align='end'>
                        <Command>
                          <CommandList>
                            <CommandEmpty>No outlet found.</CommandEmpty>
                            <CommandGroup>
                              {distances &&
                                distances.data.map((distance) => (
                                  <CommandItem
                                    key={distance.outlet.outlet_id}
                                    value={distance.outlet.outlet_id}
                                    onSelect={() => {
                                      form.setValue('outlet_id', distance.outlet.outlet_id);
                                      setOutletOpen(false);
                                    }}>
                                    <div className='flex flex-col'>
                                      <div className='flex items-center space-x-2'>
                                        <span className='text-sm font-medium'>{distance.outlet.name}</span>
                                        <Badge>{Number(distance.distance).toFixed(2)} km</Badge>
                                      </div>
                                      <div className='text-xs text-muted-foreground'>{distance.outlet.address}</div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Distance</FormLabel>
                <Input readOnly defaultValue={distance ? Number(distance.distance).toFixed(2) + ' km' : ''} />
              </div>

              <div>
                <FormLabel>Total Price</FormLabel>
                <Input readOnly defaultValue={distance ? 'Rp.' + Math.ceil(Number(distance.distance)) * 5000 : ''} />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className='flex justify-start'>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
                Place Order
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Location Range</CardTitle>
            <CardDescription>This information will be used to locate your outlet.</CardDescription>
          </CardHeader>
          <CardContent>
            <MapRange
              center={
                address && {
                  latitude: address.latitude,
                  longitude: address.longitude,
                  name: address.name,
                }
              }
              points={
                distances &&
                distances.data.map((distance) => ({
                  latitude: distance.outlet.latitude,
                  longitude: distance.outlet.longitude,
                  name: distance.outlet.name,
                }))
              }
              className='w-full aspect-square'
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default CreateRequestForm;
