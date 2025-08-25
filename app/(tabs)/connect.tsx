import { View, Text, Pressable } from 'react-native';
import { useBLEPrinter } from '~/lib/hooks/useBLEPrinter';

export default function BluetoothConnection() {
  const { connectedPrinter, printers, connectPrinter, disconnectPrinter } = useBLEPrinter();

  return (
    <View className="flex-1 items-center gap-6 p-4">
      <View className="w-full gap-2">
        <Text className="text-md pl-4 text-neutral-500">AVAILABLE PRINTERS</Text>
        {printers.map((v) => {
          return (
            <Pressable
              className="w-full flex-row items-center justify-between rounded-lg bg-neutral-200 p-4 active:bg-red-400"
              onPress={() => {
                if (connectedPrinter) {
                  disconnectPrinter();
                } else {
                  connectPrinter(v);
                }
              }}
              key={v.inner_mac_address}>
              <Text className="text-lg font-medium">{v.device_name}</Text>
              <Text className="text-lg text-neutral-400">
                {connectedPrinter && v.inner_mac_address === connectedPrinter.inner_mac_address
                  ? 'Connected'
                  : 'Not Connected'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
