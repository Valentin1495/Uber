import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from 'react-native';
import icedCoffee from '@/assets/images/iced-coffee.png';
import { Link } from 'expo-router';

const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={icedCoffee}
        resizeMode='cover'
      >
        <Text style={styles.title}>Coffee Shop</Text>

        <Link asChild href='/menu' style={{ marginHorizontal: 'auto' }}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Our menu</Text>
          </Pressable>
        </Link>
        <Link asChild href='/contact' style={{ marginHorizontal: 'auto' }}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Contact us</Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View>
  );
};
export default app;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 120,
  },
  link: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    padding: 4,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 6,
    justifyContent: 'center',
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    padding: 4,
  },
});
