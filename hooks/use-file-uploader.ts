import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

// This is a custom hook that returns the upload function
export function useFileUploader(apiType: 'users' | 'threads' | 'comments') {
  // Define which API to use based on type
  const generateUploadUrl = useMutation(
    apiType === 'users'
      ? api.users.generateUploadUrl
      : apiType === 'threads'
        ? api.threads.generateUploadUrl
        : api.comments.generateUploadUrl
  );

  // Return a function that handles the upload
  return async (
    image: ImagePicker.ImagePickerAsset
  ): Promise<Id<'_storage'>> => {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Convert URI to blob
    const response = await fetch(image.uri);
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
}
