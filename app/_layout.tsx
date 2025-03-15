import { tokenCache } from '@/cache';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { useEffect } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });

  const Layout = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const [fontsLoaded] = useFonts({
      Outfit_400Regular,
      Outfit_500Medium,
      Outfit_700Bold,
    });

    useEffect(() => {
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);

    useEffect(() => {
      if (!isLoaded) return;

      if (isSignedIn) {
        router.replace('/(auth)/(tabs)/feed');
      } else {
        router.replace('/(public)');
      }
    }, [isLoaded, isSignedIn]);

    return <Slot />;
  };

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <SafeAreaProvider>
            <Layout />
          </SafeAreaProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
