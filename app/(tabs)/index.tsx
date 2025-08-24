import { View, Text, Button } from 'react-native';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';

export default function Home() {
  const printTest = () => {
    BLEPrinter.printText('<C>Hello Printer!</C>\n');
  };
  return (
    <View>
      <Text>Home</Text>
      <Button title="Test Print" onPress={() => printTest()} />
    </View>
  );
}
