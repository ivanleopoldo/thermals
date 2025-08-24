import { Stack } from 'expo-router';
import { Button, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';

const SECONDS_TO_SCAN_FOR = 5;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = false;

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map<Peripheral['id'], Peripheral>());
  const [printers, setPrinters] = useState<any[]>([]);
  const [currentPrinter, setCurrentPrinter] = useState<any | undefined>(undefined);

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
    });

    BLEPrinter.init().then(() => {
      console.log('BLEPrinter initialized');
      BLEPrinter.getDeviceList().then((list) => {
        console.log('[BLEPrinter.getDeviceList]', list);
        setPrinters(list);
      });
    });

    const discoverListener = BleManager.onDiscoverPeripheral(handleDiscoverPeripheral);
    const stopListener = BleManager.onStopScan(handleStopScan);

    return () => {
      discoverListener.remove();
      stopListener.remove();
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.log('[DISCOVERED]', peripheral);
    setPeripherals((map) => {
      if (peripheral.advertising?.localName) {
        const newMap = new Map(map);
        newMap.set(peripheral.id, peripheral);
        return newMap;
      }
      return map;
    });
  };

  const handleStopScan = () => {
    console.log('Scan stopped');
    setIsScanning(false);
  };

  const startScan = () => {
    if (!isScanning) {
      setPeripherals(new Map());
      setIsScanning(true);

      BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
        matchMode: BleScanMatchMode.Sticky,
        scanMode: BleScanMode.LowLatency,
        callbackType: BleScanCallbackType.AllMatches,
      }).then(() => {
        console.log('Scanning...');
      });
    }
  };

  const connectPrinter = (printer: any) => {
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      (printerInfo) => {
        console.log('[BLEPrinter.connectPrinter] connected', printerInfo);
        setCurrentPrinter(printerInfo);
      },
      (err) => console.warn('[BLEPrinter.connectPrinter] error', err)
    );
  };

  const printTest = () => {
    if (currentPrinter) {
      BLEPrinter.printText('<C>Hello Printer!</C>\n');
    } else {
      console.log('No printer connected');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />

      <Button onPress={startScan} title={isScanning ? 'Scanning...' : 'Scan'} />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Discovered Peripherals:</Text>
      {Array.from(peripherals.values()).length === 0 ? (
        <Text>No BLE peripherals yet.</Text>
      ) : (
        <FlatList
          data={Array.from(peripherals.values())}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => console.log('Clicked peripheral', item)} style={styles.row}>
              <Text>{item.name ?? item.advertising.localName}</Text>
              <Text>{item.id}</Text>
              <Text>RSSI: {item.rssi}</Text>
            </Pressable>
          )}
        />
      )}

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>BLEPrinter Devices:</Text>
      {printers.length === 0 ? (
        <Text>No printers found yet.</Text>
      ) : (
        printers.map((printer) => (
          <Pressable
            key={printer.inner_mac_address}
            style={styles.row}
            onPress={() => connectPrinter(printer)}>
            <Text>{`Name: ${printer.device_name}`}</Text>
            <Text>{`MAC: ${printer.inner_mac_address}`}</Text>
          </Pressable>
        ))
      )}

      <Button title="Print Test" onPress={printTest} />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});
