import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/colors';
import { useSSO } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import { Image } from 'expo-image';

export default function LogInScreen() {
  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const logIn = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: 'oauth_google',
          // Defaults to current path
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/login.png')}
        style={styles.img}
        contentFit='cover'
        transition={1000}
      />

      <Text style={styles.heading}>How would you like to use V?</Text>

      <TouchableOpacity style={styles.btnContainer} onPress={logIn}>
        <Text style={styles.btnText}>Continue with Google</Text>
        <Ionicons name='chevron-forward' size={24} color={colors.border} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnContainer2}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.btnText}>Use without a profile</Text>
          <Ionicons name='chevron-forward' size={24} color={colors.border} />
        </View>
        <Text style={styles.paragraph}>
          You can browse Threads without a profile, but won't be able to post,
          interact or get personalised recommendations.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  img: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  heading: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  btnContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnContainer2: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 10,
  },
  btnText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    flex: 1,
    lineHeight: 16,
  },
  paragraph: {
    fontFamily: 'Outfit_400Regular',
    color: '#acacac',
    fontSize: 14,
    marginTop: 5,
  },
});
