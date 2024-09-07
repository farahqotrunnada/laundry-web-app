import * as React from 'react';

interface CreateOrderProps {
  //
}

export default async function CreateOrder({ ...props }: CreateOrderProps): Promise<React.JSX.Element> {
  return (
    <div>
      <h1>Create Order Page</h1>
    </div>
  );
}
