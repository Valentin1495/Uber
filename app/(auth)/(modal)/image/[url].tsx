import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { useLocalSearchParams } from 'expo-router';

const ImageModal = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <ImageZoom
          uri={url}
          minScale={0.5}
          maxScale={5}
          doubleTapScale={2}
          isSingleTapEnabled
          isDoubleTapEnabled
          style={styles.image}
          resizeMode='contain'
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
