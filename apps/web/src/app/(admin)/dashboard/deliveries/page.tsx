import * as React from 'react';

import DeliveryTable from 'views/admins/deliveries/DeliveryTable';

interface DeliveryPageProps {
  //
}

export default async function DeliveryPage({ ...props }: DeliveryPageProps): Promise<React.JSX.Element> {
  return <DeliveryTable />;
}
