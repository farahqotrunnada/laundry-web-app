import * as React from 'react';
import * as yup from 'yup';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import EditAddressForm from './_components/edit';

interface PageProps {
  params: {
    customer_address_id: string;
  };
}

export default async function Page({ params, ...props }: PageProps): Promise<React.JSX.Element> {
  try {
    const { customer_address_id } = await yup
      .object({
        customer_address_id: yup.string().required(),
      })
      .validate(params);

    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>Edit Address</CardTitle>
          <CardDescription>
            Manage your addresses, this information will be used to deliver your orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditAddressForm customer_address_id={customer_address_id} />
        </CardContent>
      </Card>
    );
  } catch (error) {
    redirect('/profile/addresses');
  }
}
