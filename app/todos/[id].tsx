import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function EditScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Edit Screen - ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
