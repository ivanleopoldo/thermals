import React, { useEffect, useState, createContext, ReactNode } from 'react';
import { BLEPrinter, IBLEPrinter } from 'react-native-thermal-receipt-printer';

export type TPrinter = {
  connected: boolean;
} & IBLEPrinter;

type BLEPrinterContextType = {
  connectedPrinter: TPrinter | null;
  printers: TPrinter[];
  connectPrinter: (printer: TPrinter) => void;
  disconnectPrinter: () => void;
  print: (content: string) => void;
};

export const BLEPrinterContext = createContext<BLEPrinterContextType | undefined>(undefined);

export function BLEPrinterProvider({ children }: { children: ReactNode }) {
  const [printers, setPrinters] = useState<TPrinter[]>([]);
  const [connectedPrinter, setConnectedPrinter] = useState<TPrinter | null>(null);

  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then((v) => {
        const scannedPrinters = v.map((p) => ({
          ...p,
          connected: false,
        }));
        setPrinters(scannedPrinters);
      });
    });
  }, []);

  const connectPrinter = (printer: TPrinter) => {
    BLEPrinter.connectPrinter(printer.inner_mac_address)
      .then(() => {
        const connected = { ...printer, connected: true };
        setConnectedPrinter(connected);
        console.log('[BLEPrinter.connectPrinter] connected', connected);
      })
      .catch((err) => {
        console.error('[BLEPrinter.connectPrinter] error', err);
      });
  };

  const disconnectPrinter = () => {
    BLEPrinter.closeConn();
    setConnectedPrinter(null);
  };

  const print = (content: string) => {
    if (!connectedPrinter) {
      throw new Error('No printer connected');
    }
    BLEPrinter.printBill(content);
  };

  return (
    <BLEPrinterContext.Provider
      value={{
        connectedPrinter,
        printers,
        connectPrinter,
        disconnectPrinter,
        print,
      }}>
      {children}
    </BLEPrinterContext.Provider>
  );
}
