'use client';

import { ReactElement } from 'react';

// project-imports
import ThemeCustomization from 'themes';
import { ConfigProvider } from 'contexts/ConfigContext';
import Customization from 'components/customization';
import ScrollTop from 'components/ScrollTop';

// ==============================|| PROVIDER WRAPPER  ||============================== //

export default function ProviderWrapper({ children }: { children: ReactElement }) {
  return (
    <ConfigProvider>
      <ThemeCustomization>
        <ScrollTop>
          <>
            {children}
            <Customization />
          </>
        </ScrollTop>
      </ThemeCustomization>
    </ConfigProvider>
  );
}
