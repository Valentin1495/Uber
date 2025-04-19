import { useCallback, useRef, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTabBar } from '@/app/(auth)/(tabs)/_layout';

export const useTabScrollHandler = (tabName: string) => {
  const { updateOpacity, setActiveTab } = useTabBar();
  const scrollY = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setActiveTab(tabName);
      return () => {
        setActiveTab(tabName);
      };
    }, [setActiveTab, tabName])
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const isScrollDown = currentScrollY > scrollY.current;

    if (isScrollDown !== isScrollingDown) {
      setIsScrollingDown(isScrollDown);
    }

    const threshold = 100;
    const scrollDelta = Math.min(threshold, Math.abs(currentScrollY));
    const newOpacity = isScrollDown
      ? 1 - (scrollDelta / threshold) * 0.8
      : 0.2 + (scrollDelta / threshold) * 0.8;

    updateOpacity(tabName, newOpacity);
    scrollY.current = currentScrollY;
  };

  return { handleScroll };
};
