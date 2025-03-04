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
  const router = useRouter();
  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const editProfile = () => {
    updateUserProfile({
      _id: id,
      bio: updatedBio.trim(),
      websiteUrl: updatedWebsiteUrl.trim(),
    });
    router.dismiss();
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
      <Image source={{ uri: imageUrl }} style={styles.img} />

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
