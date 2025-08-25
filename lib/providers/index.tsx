import { PropsWithChildren } from 'react';
import { BLEPrinterProvider } from './BLEPrinterProvider';

export default function Providers({ children }: PropsWithChildren) {
  return <BLEPrinterProvider>{children}</BLEPrinterProvider>;
}
