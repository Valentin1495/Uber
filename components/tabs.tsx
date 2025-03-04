import { colors } from '@/colors';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
type Props = {
  tabList: string[];
};
const Tabs = ({ tabList }: Props) => {
  const [selectedTab, setSelectedTab] = useState('Threads');
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  return (
    <View style={styles.tabContainer}>
      {tabList.map((tab, index) => {
        const isSelectedTab = tab === selectedTab;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.tab, isSelectedTab && styles.selectedTab]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[styles.tabText, isSelectedTab && styles.selectedTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default Tabs;
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    padding: 10,
    borderBottomColor: colors.border,
  },
  selectedTab: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: colors.border,
  },
  selectedTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
