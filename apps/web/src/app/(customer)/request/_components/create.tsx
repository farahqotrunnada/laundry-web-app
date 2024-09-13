'use client';

import * as React from 'react';
import * as yup from 'yup';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Outlet } from '@/types/outlet';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useCustomerAddresses } from '@/hooks/use-customer-addresses';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';

interface RequestOrderFormProps {
  //
}

const requestOrderSchema = yup.object({
  customer_address_id: yup.string().required(),
  outlet_id: yup.string().required(),
});

const RequestOrderForm: React.FC<RequestOrderFormProps> = ({ ...props }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data } = useCustomerAddresses();
  const addresses = React.useMemo(() => {
    return data ? data.data : [];
  }, [data]);

  const form = useForm<yup.InferType<typeof requestOrderSchema>>({
    resolver: yupResolver(requestOrderSchema),
    defaultValues: {
      customer_address_id: '',
      outlet_id: '',
    },
  });

  const [outlets, setOutlets] = React.useState<
    {
      outlet: Outlet;
      distance: number;
    }[]
  >([]);

  const address = form.watch('customer_address_id');

  React.useEffect(() => {
    if (address) {
      const fetchOutlets = async () => {
        try {
          const { data } = await axios.get('/outlets/nearest', {
            params: {
              customer_address_id: address,
            },
          });
          setOutlets(data.data);
          if (data.data.length === 0) {
            toast({
              variant: 'destructive',
              title: 'No outlet found nearby, please select another address',
            });
          }
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to load outlets',
            description: error.message,
          });
        }
      };

      form.setValue('outlet_id', '');
      fetchOutlets();
    }
  }, [address, toast, form]);

  const onSubmit = async (formData: yup.InferType<typeof requestOrderSchema>) => {
    try {
      await axios.post('/deliveries/request', formData);
      toast({
        title: 'Order created',
        description: 'Your order has been created successfully',
      });
      router.push('/orders');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to create order',
        description: error.message,
      });
    }
  };

  const selectedOutlet = outlets.find((item) => item.outlet.outlet_id === form.watch('outlet_id'));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Outlet Detail</CardTitle>
            <CardDescription>Make sure to add all the details of your outlet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='customer_address_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Addresses</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                            {field.value
                              ? addresses.find((address) => address.customer_address_id === field.value)?.name
                              : 'Select address'}
                            <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0 popover-content-width-full' align='end'>
                        <Command>
                          <CommandInput placeholder='Search address...' />
                          <CommandList>
                            <CommandEmpty>No address found.</CommandEmpty>
                            <CommandGroup>
                              {addresses.map((address) => (
                                <CommandItem
                                  value={address.customer_address_id}
                                  key={address.customer_address_id}
                                  onSelect={() => {
                                    form.setValue('customer_address_id', address.customer_address_id);
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={!outlets || outlets.length === 0}
                            variant='outline'
                            role='combobox'
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                            {field.value
                              ? outlets.find((item) => item.outlet.outlet_id === field.value)?.outlet.name
                              : 'Select outlet'}
                            <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-full p-0 popover-content-width-full' align='end'>
                        <Command>
                          <CommandInput placeholder='Search outlet...' />
                          <CommandList>
                            <CommandEmpty>No outlet found.</CommandEmpty>
                            <CommandGroup>
                              {outlets.map((item) => (
                                <CommandItem
                                  value={item.outlet.outlet_id}
                                  key={item.outlet.outlet_id}
                                  onSelect={() => {
                                    form.setValue('outlet_id', item.outlet.outlet_id);
                                  }}>
                                  <div className='flex flex-col'>
                                    <div className='flex items-center space-x-2'>
                                      <span className='text-sm font-medium'>{item.outlet.name}</span>
                                      <Badge>{Number(item.distance).toFixed(2)} km</Badge>
                                    </div>
                                    <div className='text-xs text-muted-foreground'>{item.outlet.address}</div>
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
                <Input readOnly defaultValue={selectedOutlet && Number(selectedOutlet.distance).toFixed(2) + ' km'} />
              </div>

              <div>
                <FormLabel>Total Price</FormLabel>
                <Input
                  readOnly
                  defaultValue={selectedOutlet && 'Rp.' + Math.ceil(Number(selectedOutlet.distance)) * 5000}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className='flex justify-start'>
              <Button type='submit'>Save</Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default RequestOrderForm;
