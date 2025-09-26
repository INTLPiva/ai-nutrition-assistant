import { StatusBar } from 'expo-status-bar';
import './global.css';
import ChatScreen from './src/screens/ChatScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ChatScreen />
    </SafeAreaView>
  );
}
