import { colors } from '@/colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFileUploader } from '@/hooks/use-file-uploader';

const EditProfile = () => {
  const { id, bio, imageUrl, websiteUrl } = useLocalSearchParams<{
    id: Id<'users'>;
    imageUrl: string;
    bio: string;
    websiteUrl: string;
  }>();
  const [updatedBio, setUpdatedBio] = useState(bio);
  const [updatedWebsiteUrl, setUpdatedWebsiteUrl] = useState(websiteUrl);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const router = useRouter();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const updateImage = useMutation(api.users.updateImage);
  const uploadFile = useFileUploader();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfilePic = async () => {
    const storageId = await uploadFile(selectedImage!);

    // Step 3: Save the newly allocated storage id to the database
    await updateImage({
      storageId,
      _id: id,
    });
  };

  const editProfile = async () => {
    try {
      setIsSubmitting(true);

      updateUserProfile({
        _id: id,
        bio: updatedBio.trim(),
        websiteUrl: updatedWebsiteUrl.trim(),
      });

      if (selectedImage) {
        await updateProfilePic();
      }

      Alert.alert('Success', 'Profile updated successfully');
      router.dismiss();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Profile update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={editProfile} disabled={isSubmitting}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: isSubmitting ? '#aaa' : colors.submit,
                }}
              >
                {isSubmitting ? 'Updating...' : 'Done'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center' }}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.img} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.img} />
        )}
      </TouchableOpacity>

      <View style={[styles.inputContainer]}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          value={updatedBio}
          onChangeText={setUpdatedBio}
          multiline
          numberOfLines={4}
          placeholder='Enter your bio...'
          textAlignVertical='top'
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={updatedWebsiteUrl}
          onChangeText={setUpdatedWebsiteUrl}
          placeholder='Enter your website...'
          autoCapitalize='none'
        />
      </View>
    </View>
  );
};
export default EditProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bioInput: {
    height: 100,
  },
});
