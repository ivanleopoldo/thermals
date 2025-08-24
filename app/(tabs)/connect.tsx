import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BLEPrinter, IBLEPrinter } from 'react-native-thermal-receipt-printer';

type TPrinter = {
  connected: boolean;
} & IBLEPrinter;

export default function BluetoothConnection() {
  const [printers, setPrinters] = useState<TPrinter[]>([]);
  const [currentPrinter, setCurrentPrinter] = useState<TPrinter | null>(null);

  useEffect(() => {
    BLEPrinter.getDeviceList().then((v) => {
      setPrinters(() =>
        v.map((p) => ({
          ...p,
          connected: false,
        }))
      );
    });
  }, []);

  const connectPrinter = (printer: TPrinter) => {
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      (printerInfo) => {
        console.log('[BLEPrinter.connectPrinter] connected', printerInfo);
        setCurrentPrinter({ ...printerInfo, connected: true });
      },
      (err) => console.error('[BLEPrinter.connectPrinter] error', err)
    );
  };

  return (
    <View className="flex-1 items-center gap-6 p-4">
      <View className="w-full gap-2">
        <Text className="pl-4 text-sm text-neutral-500">PAIRED PRINTERS</Text>
        <Pressable
          disabled={currentPrinter ? false : true}
          onPress={() => BLEPrinter.closeConn()}
          className="items-center justify-center rounded-lg bg-neutral-200 p-4 active:bg-red-400">
          <Text>{currentPrinter ? currentPrinter.device_name : 'No Printer Connected'}</Text>
        </Pressable>
      </View>
      <View className="w-full gap-2">
        <Text className="pl-4 text-sm text-neutral-500">AVAILABLE PRINTERS</Text>
        {printers.map((v) => {
          return (
            <Pressable
              className="rounded-lg bg-neutral-200 p-4 active:bg-red-400"
              onPress={() => {
                connectPrinter(v);
              }}
              key={v.inner_mac_address}>
              <Text>{v.device_name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
