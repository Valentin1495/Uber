import { useContext, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Bangers_400Regular, useFonts } from '@expo-google-fonts/bangers';
import { ThemeContext } from '@/context/theme-context';
import Octicons from '@expo/vector-icons/Octicons';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

type Todo = {
  title: string;
  completed: boolean;
  id: number;
};

export default function Index() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const context = useContext(ThemeContext);
  const colorScheme = context?.colorScheme;
  const setColorScheme = context?.setColorScheme;
  const theme = context?.theme;

  const addTodo = () => {
    if (todo.trim()) {
      setTodoList([
        ...todoList,
        { title: todo, completed: false, id: todoList.length + 1 },
      ]);
      setTodo('');
    }
  };

  const removeTodo = (id: number) => {
    setTodoList(todoList.filter((t) => t.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodoList(
      todoList.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <Text
        onPress={() => toggleTodo(item.id)}
        style={[styles.todoText, item.completed && styles.completedText]}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons
          name='delete-circle'
          size={36}
          color='red'
          selectable={undefined}
        />
      </Pressable>
    </View>
  );

  const [fontsLoaded, error] = useFonts({ Bangers_400Regular });
  const styles = createStyles(colorScheme, theme);

  if (!fontsLoaded && !error) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Add to do'
          placeholderTextColor='gray'
          value={todo}
          onChangeText={setTodo}
          style={styles.input}
        />

        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setColorScheme &&
              setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
          }}
          style={{ marginLeft: 10 }}
        >
          <Octicons
            name={colorScheme === 'light' ? 'sun' : 'moon'}
            size={36}
            color={theme?.text}
            selectable={undefined}
            style={{ width: 36 }}
          />
        </Pressable>
      </View>

      <Animated.FlatList
        data={todoList}
        keyExtractor={(todo) => todo.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        layout={LinearTransition}
        keyboardDismissMode='on-drag'
      />

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const createStyles = (
  colorScheme: 'light' | 'dark' | null | undefined,
  theme:
    | {
        text: string;
        background: string;
        icon: string;
        button: string;
      }
    | undefined
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Bangers_400Regular',
      minWidth: 0,
      color: theme?.text,
    },
    addButton: {
      backgroundColor: theme?.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Bangers_400Regular',
      color: theme?.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
  });
