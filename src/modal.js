import {
  View,
  Text,
  Pressable,
  Animated,
  NativeModules,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  ScrollView,
} from 'react-native-gesture-handler';
const {StatusBarManager} = NativeModules;

const height =
  Dimensions.get('screen').height -
  (Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0);

const SMALL_MODAL = (height * 25) / 100;

export default function Modal({showModal, callBackFunction}) {
  React.useEffect(() => {
    openModal();
  }, []);
  const panGestureRef = React.useRef(Gesture.Pan());
  const [scrollEnabled, setScrollEnable] = React.useState(false);
  const [ifOnTop, setIfOnTop] = React.useState(true);
  const scroll = React.useRef(true);
  const modalVerticalLocation = React.useRef(
    new Animated.Value(height),
  ).current;
  const [modalLocation, setModalLocation] = React.useState(SMALL_MODAL);
  const openModal = () => {
    Animated.sequence([
      Animated.timing(modalVerticalLocation, {
        toValue: SMALL_MODAL,
        useNativeDriver: true,
        duration: 100,
      }),
    ]).start();
    setModalLocation(() => SMALL_MODAL);
  };
  const bringUpActionSheet = () => {
    Animated.sequence([
      Animated.timing(modalVerticalLocation, {
        toValue: 0,
        useNativeDriver: true,
        duration: 500,
      }),
    ]).start();
    setModalLocation(() => 0);
    setScrollEnable(true);
  };
  const bringDownActionSheet = () => {
    Animated.sequence([
      Animated.timing(modalVerticalLocation, {
        toValue: SMALL_MODAL,
        useNativeDriver: true,
        duration: 500,
      }),
    ]).start();
    setModalLocation(() => SMALL_MODAL);
  };

  const bringCloseActionSheet = () => {
    Animated.sequence([
      Animated.timing(modalVerticalLocation, {
        toValue: height,
        useNativeDriver: true,
        duration: 250,
      }),
    ]).start();
    setTimeout(()=> {
        callBackFunction();
    }, 250)
  };

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      const currentLocation = Number.parseInt(
        JSON.stringify(modalVerticalLocation),
      );
      if (currentLocation >= 0) {
        modalVerticalLocation.setValue(modalLocation + event.translationY);
      }
      if (currentLocation + event.translationY >= 0) {
        modalVerticalLocation.setValue(modalLocation + event.translationY);
      }
    })
    .onEnd(event => {
      if (event.translationY < 0) bringUpActionSheet();
      else if (event.translationY > 0 && modalLocation === SMALL_MODAL)
        bringCloseActionSheet();
      else if (event.translationY > 0 && event.velocityY > 2000)
        bringCloseActionSheet();
      else bringDownActionSheet();
    });
  const gestureHandler = e => {
    if (
      !ifOnTop &&
      e.nativeEvent.velocity.y < 1 &&
      e.nativeEvent.contentOffset.y === 0
    )
      setIfOnTop(() => true);
    else if (ifOnTop && e.nativeEvent.contentOffset.y > 0) {
      setIfOnTop(() => false);
    }
    if (e.nativeEvent.contentOffset.y > 0) bringUpActionSheet();
  };
  const panGesture = Gesture.Pan()
    .onStart(event => {
      if (ifOnTop) scroll.current = true;
      else scroll.current = false;
    })
    .onChange(e => {
      const currentLocation = Number.parseInt(
        JSON.stringify(modalVerticalLocation),
      );
      if (
        modalLocation === SMALL_MODAL &&
        (currentLocation >= 0 || currentLocation + e.translationY >= 0)
      )
        modalVerticalLocation.setValue(modalLocation + e.translationY);
      else if (scroll.current && modalLocation === 0 && e.translationY > 0)
        modalVerticalLocation.setValue(modalLocation + e.translationY);
      if (scroll.current && e.translationY > 0) setScrollEnable(() => false);
    })
    .onEnd(event => {
      if (event.translationY < 0 && ifOnTop) bringUpActionSheet();
      else if (
        event.translationY > 0 &&
        modalLocation === SMALL_MODAL &&
        ifOnTop
      )
        bringCloseActionSheet();
      else if (
        event.translationY > 0 &&
        event.velocityY > 2000 &&
        scroll.current &&
        ifOnTop
      )
        bringCloseActionSheet();
      else if (event.translationY > 200 && scroll.current && ifOnTop)
        bringCloseActionSheet();
      else if (ifOnTop) bringDownActionSheet();
    })
    .withRef(panGestureRef);
  return (
    <View style={style.fullContainer}>
      <View style={style.bottomFullComponent}>
        <GestureHandlerRootView style={{flex: 1}}>
          <GestureDetector gesture={gesture}>
            <View>
              <Animated.View
                style={{
                  height: height,
                  transform: [{translateY: modalVerticalLocation}],
                  position: 'absolute',
                  width: 360,
                  top: -height,
                }}>
                <Pressable style={{flex: 1}} onPress={callBackFunction} />
              </Animated.View>
              <Animated.View
                style={[
                  style.bottomComponent,
                  {transform: [{translateY: modalVerticalLocation}]},
                ]}>
                <View style={style.header}>
                  <View style={style.headerStick} />
                </View>
                <View style={{paddingHorizontal: 10}}>
                  <ScrollView
                    simultaneousHandlers={[panGestureRef]}
                    onScroll={gestureHandler}
                    scrollEnabled={scrollEnabled}>
                    <GestureDetector gesture={panGesture}>
                      <View>
                        {Array.from(Array(150).keys()).map((item, index) => (
                          <Text key={index}>Item</Text>
                        ))}
                      </View>
                    </GestureDetector>
                  </ScrollView>
                </View>
              </Animated.View>
            </View>
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  fullContainer: {
    position: 'absolute',
    zIndex: 999,
    top: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomFullComponent: {
    height: height,
    width: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
  },
  bottomComponent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: height,
  },
  header: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStick: {
    width: '3%',
    height: 2,
    backgroundColor: 'black',
  },
});
