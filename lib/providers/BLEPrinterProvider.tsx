import React, { useEffect, useState, createContext, ReactNode, useCallback } from 'react';
import { BLEPrinter, IBLEPrinter } from 'react-native-thermal-receipt-printer';

export type TPrinter = {
  connected: boolean;
} & IBLEPrinter;

type BLEPrinterContextType = {
  connectedPrinter: TPrinter | null;
  printers: TPrinter[];
  connectPrinter: (printer: TPrinter) => void;
  startScan: () => void;
  disconnectPrinter: () => void;
  print: (content: string) => void;
};

export const BLEPrinterContext = createContext<BLEPrinterContextType | undefined>(undefined);

export function BLEPrinterProvider({ children }: { children: ReactNode }) {
  const [printers, setPrinters] = useState<TPrinter[]>([]);
  const [connectedPrinter, setConnectedPrinter] = useState<TPrinter | null>(null);

  useEffect(() => {
    BLEPrinter.init();
  }, []);

  const startScan = useCallback(() => {
    BLEPrinter.getDeviceList().then((devices) => {
      const formattedDevices = devices.map((device) => ({ ...device, connected: false }));
      setPrinters(formattedDevices);
    });
  }, []);

  const connectPrinter = (printer: TPrinter) => {
    BLEPrinter.connectPrinter(printer.inner_mac_address)
      .then(() => {
        const connected = { ...printer, connected: true };
        setConnectedPrinter(connected);
        console.log('[BLEPrinter.connectPrinter] success', connected);
      })
      .catch((err) => {
        console.error('[BLEPrinter.connectPrinter] failed', err);
        setConnectedPrinter(null);
      });
  };

  const disconnectPrinter = () => {
    return BLEPrinter.closeConn()
      .then(() => {
        setConnectedPrinter(null);
        console.log('[BLEPrinter.disconnectPrinter] success');
      })
      .catch((err) => {
        console.error('[BLEPrinter.disconnectPrinter] failed', err);
      });
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
        startScan,
        connectPrinter,
        disconnectPrinter,
        print,
      }}>
      {children}
    </BLEPrinterContext.Provider>
  );
}
