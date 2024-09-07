import * as React from 'react';

import DeliveryTable from 'views/admins/deliveries/DeliveryTable';

interface OngoingDeliveryPageProps {
  //
}

export default async function OngoingDeliveryPage({ ...props }: OngoingDeliveryPageProps): Promise<React.JSX.Element> {
  return <DeliveryTable status="Ongoing" />;
}
