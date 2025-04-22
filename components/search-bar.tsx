import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchBar = ({ searchText, setSearchText }: SearchBarProps) => {
  const handleClear = (): void => {
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons
          name='search'
          size={24}
          color='#666'
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder='Search....'
          placeholderTextColor='#999'
          returnKeyType='search'
        />

        {searchText.length > 0 && (
          <TouchableOpacity style={styles.clearIcon} onPress={handleClear}>
            <Ionicons name='close-circle' size={20} color='#999' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    padding: 5,
  },
});

export default SearchBar;
