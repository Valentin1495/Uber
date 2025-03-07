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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
  const { id, bio, imageUrl, websiteUrl } = useLocalSearchParams<{
    id: Id<'users'>;
    imageUrl: string;
    bio: string;
    websiteUrl: string;
  }>();
  const [updatedBio, setUpdatedBio] = useState(bio);
  const [updatedWebsiteUrl, setUpdatedWebsiteUrl] = useState(websiteUrl);
  const [updatedImageUrl, setUpdatedImageUrl] = useState(imageUrl);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const router = useRouter();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);

  const updateProfilePic = async () => {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Convert URI to blob
    const response = await fetch(selectedImage!.uri);
    const blob = await response.blob();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': selectedImage!.mimeType!,
      },
      body: blob,
    });

    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await updateImage({
      storageId,
      _id: id,
    });
  };
  const editProfile = async () => {
    updateUserProfile({
      _id: id,
      bio: updatedBio.trim(),
      websiteUrl: updatedWebsiteUrl.trim(),
    });

    if (selectedImage) {
      await updateProfilePic();
    }

    router.dismiss();
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
        name='(modal)/edit-profile'
        options={{
          presentation: 'modal',
          title: 'Edit Profile',
          headerRight: () => (
            <TouchableOpacity onPress={editProfile}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: colors.submit,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <TouchableOpacity onPress={pickImage}>
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
