import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';

export const getStorageId = async (
  image: ImagePicker.ImagePickerAsset,
  apiType: string
) => {
  const generateUploadUrl = useMutation(
    apiType === 'users'
      ? api.users.generateUploadUrl
      : api.threads.generateUploadUrl
  );

  // Step 1: Get a short-lived upload URL
  const postUrl = await generateUploadUrl();

  // Convert URI to blob
  const response = await fetch(image!.uri);
  const blob = await response.blob();

  // Step 2: POST the file to the URL
  const result = await fetch(postUrl, {
    method: 'POST',
    headers: {
      'Content-Type': image.mimeType!,
    },
    body: blob,
  });

  const { storageId } = await result.json();

  return storageId;
};
