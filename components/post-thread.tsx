import { colors } from '@/colors';
import { Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useFileUploader } from '@/hooks/use-file-uploader';

type Props = {
  isReply?: boolean;
  threadId?: Id<'threads'>;
};

const PostThread = ({ isReply, threadId }: Props) => {
  const { isModal } = useLocalSearchParams();
  const currentUser = useCurrentUser();
  const [text, setText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>(
    []
  );
  const postThread = useMutation(api.threads.postThread);
  const createComment = useMutation(api.comments.createComment);
  const router = useRouter();
  const uploadFile = useFileUploader();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePress = async () => {
    if (!text.trim() && mediaFiles.length === 0) return;

    try {
      setIsSubmitting(true);

      const storageIds = await Promise.all(
        mediaFiles.map((f) => uploadFile(f))
      );

      if (isReply) {
        createComment({
          text: text.trim(),
          mediaFiles: storageIds,
          threadId: threadId!,
        });
        router.dismiss();
      } else {
        postThread({ text: text.trim(), mediaFiles: storageIds });
        if (isModal) {
          router.dismiss();
        }
      }

      setText('');
      setMediaFiles([]);
    } catch (error) {
      console.error('Error posting thread:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    if (!text.trim() && mediaFiles.length === 0) return router.dismiss();

    Alert.alert('Discard thread?', '', [
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => router.dismiss(),
      },
      {
        text: 'Save draft',
        style: 'default',
        onPress: () => router.dismiss(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const reset = () => {
    setText('');
    setMediaFiles([]);
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ['images'],
    };

    let result;

    switch (source) {
      case 'camera':
        await ImagePicker.requestCameraPermissionsAsync();

        result = await ImagePicker.launchCameraAsync(options);
        break;

      case 'library':
        result = await ImagePicker.launchImageLibraryAsync(options);
      default:
        break;
    }

    if (result && !result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };

  const deleteImage = (idx: number) =>
    setMediaFiles((prev) => prev.filter((_, index) => index !== idx));

  if (currentUser) {
    const { imageUrl, first_name, last_name } = currentUser;

    return (
      <View>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={cancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            ),
            headerTitleAlign: 'center',
          }}
        />

        <View style={styles.container}>
          <View style={styles.topContainer}>
            {imageUrl && (
              <Image source={{ uri: imageUrl }} style={styles.avatar} />
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.username}>
                {first_name} {last_name}
              </Text>
              <TextInput
                placeholder={isReply ? 'Reply to thread...' : "What's new?"}
                multiline
                value={text}
                onChangeText={setText}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              onPress={reset}
              style={text.trim() || mediaFiles.length ? '' : styles.hidden}
            >
              <Ionicons name='close' size={20} color={colors.border} />
            </TouchableOpacity>
          </View>

          {mediaFiles.length > 0 && (
            <View style={styles.middleContainer}>
              <ScrollView horizontal>
                {mediaFiles.map((f, idx) => (
                  <View key={idx} style={styles.imageContainer}>
                    <Image source={{ uri: f.uri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => deleteImage(idx)}
                    >
                      <Ionicons name='close' color='#fff' size={20} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => pickImage('library')}>
              <Ionicons name='image-outline' size={24} color={colors.border} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage('camera')}>
              <Ionicons name='camera-outline' size={24} color={colors.border} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.postBtn, { opacity: isSubmitting ? 0.5 : 1 }]}
              onPress={handlePress}
              disabled={isSubmitting}
            >
              <Text style={styles.postBtnText}>
                {isSubmitting ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};
export default PostThread;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  topContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  inputContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    padding: 0,
    maxHeight: 100,
    fontSize: 16,
  },
  middleContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 200,
    borderRadius: 6,
    marginRight: 6,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingRight: 16,
    paddingLeft: 66,
    alignItems: 'center',
    gap: 5,
  },
  postBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 9999,
    padding: 2,
  },
  hidden: {
    display: 'none',
  },
});
