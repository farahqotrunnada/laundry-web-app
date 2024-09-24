import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import CreateAddressForm from './_components/create';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Add Address</CardTitle>
        <CardDescription>Manage your addresses, this information will be used to deliver your orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateAddressForm />
      </CardContent>
    </Card>
  );
}
