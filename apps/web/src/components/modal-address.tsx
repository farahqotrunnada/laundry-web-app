import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Address } from '@/types/address';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapLoader } from './loader/map';
import dynamic from 'next/dynamic';
import { Customer, User } from '@/types/user';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface AddressModalProps extends React.PropsWithChildren {
  title: string;
  description: string;
  data: {
    customer: Customer & {
      User: User;
    };
    address: Address;
  };
}

const AddressModal: React.FC<AddressModalProps> = ({ title, description, data, children }) => {
  const Map = React.useMemo(
    () =>
      dynamic(() => import('@/components/map'), {
        loading: () => <MapLoader />,
        ssr: false,
      }),
    []
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='h-full overflow-y-scroll max-h-modal hide-scrollbar'>
          <div className='grid gap-4 px-1 py-2 text-sm'>
            <div className='flex flex-col space-y-2'>
              <Label className='block'>Location</Label>
              <Map
                location={{
                  latitude: data.address.latitude,
                  longitude: data.address.longitude,
                }}
                setLocation={() => {}}
                className='w-full aspect-video'
              />
            </div>

            <div className='flex flex-col space-y-2'>
              <Label className='block'>Customer Name</Label>
              <Input readOnly className='text-muted-foreground' defaultValue={data.customer.User.fullname} />
            </div>

            <div className='flex flex-col space-y-2'>
              <Label className='block'>Customer Phone</Label>
              <Input readOnly className='text-muted-foreground' defaultValue={data.customer.User.phone!} />
            </div>

            <div className='flex flex-col space-y-2'>
              <Label className='block'>Address</Label>
              <Textarea readOnly className='text-muted-foreground' defaultValue={data.address.address} />
            </div>
          </div>
        </div>

        <DialogFooter className='sm:justify-end'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
