import { AuthProvider } from './src/contexts/AuthContext';
import { PostProvider } from './src/contexts/PostContext';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Navigation />
        <StatusBar style="dark" />
      </PostProvider>
    </AuthProvider>
  );
}
