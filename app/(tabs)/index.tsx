import { View, Text, Button } from 'react-native';
import { useBLEPrinter } from '~/lib/hooks/useBLEPrinter';

export default function Home() {
  const { print } = useBLEPrinter();
  return (
    <View>
      <Text>Home</Text>
      <Button title="Test Print" onPress={() => print('<C>hello welcome</C>')} />
    </View>
  );
}
