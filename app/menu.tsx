import { Colors } from '@/constants/Colors';
import { MENU_ITEMS } from '@/constants/MenuItems';
import MenuImages from '@/constants/MenuImages';
import {
  Appearance,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function MenuScreen() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;
  const separator = () => <View style={styles.separator} />;
  const footer = <Text style={styles.footer}>End of menu</Text>;
  //   const header = <Text style={styles.header}>Top of list</Text>;

  return (
    <Container>
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.menuTextRow}>
              <Text style={[styles.menuItemTitle, styles.menuItemText]}>
                {item.title}
              </Text>
              <Text style={styles.menuItemText}>{item.description}</Text>
            </View>
            <Image source={MenuImages[item.id - 1]} style={styles.menuImage} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ItemSeparatorComponent={separator}
        // ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListFooterComponentStyle={styles.footer}
        ListEmptyComponent={<Text>No items</Text>}
      />
    </Container>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
    },
    text: {
      color: theme.text,
      fontSize: 20,
    },
    separator: {
      height: 1,
      backgroundColor: colorScheme === 'dark' ? 'papayawhip' : '#000',
      width: '50%',
      maxWidth: 300,
      marginHorizontal: 'auto',
      marginBottom: 10,
    },
    footer: {
      color: theme.text,
      marginHorizontal: 'auto',
    },
    header: {},
    row: {
      flexDirection: 'row',
      width: '100%',
      maxWidth: 600,
      height: 100,
      marginBottom: 10,
      borderStyle: 'solid',
      borderColor: colorScheme === 'dark' ? 'papayawhip' : '#000',
      borderWidth: 1,
      borderRadius: 20,
      overflow: 'hidden',
      marginHorizontal: 'auto',
    },
    menuTextRow: {
      width: '65%',
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 5,
      flexGrow: 1,
    },
    menuItemTitle: {
      fontSize: 18,
      textDecorationLine: 'underline',
    },
    menuItemText: {
      color: theme.text,
    },
    menuImage: {
      width: 100,
      height: 100,
    },
  });
}
