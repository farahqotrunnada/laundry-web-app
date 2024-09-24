import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import CustomerComplaintGrid from './_components/grid';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Complaints</CardTitle>
        <CardDescription>See all your complaints.</CardDescription>
      </CardHeader>

      <CardContent>
        <CustomerComplaintGrid />
      </CardContent>
    </Card>
  );
}
