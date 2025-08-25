import { useContext } from 'react';
import { BLEPrinterContext } from '../providers/BLEPrinterProvider';

export const useBLEPrinter = () => {
  const context = useContext(BLEPrinterContext);
  if (!context) {
    throw new Error('useBLEPrinter must be used within a BLEPrinterProvider');
  }
  return context;
};
