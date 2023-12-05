import React, {useEffect} from 'react';
import {LogBox, StatusBar} from 'react-native';
import AppNavigator from './navigator/AppNavigator';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {store} from './redux/store';
import {SheetProvider} from 'react-native-actions-sheet';

const App = () => {
  LogBox.ignoreAllLogs(true);
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle={'dark-content'}
          translucent={true}
        />
        <SheetProvider>
          <AppNavigator />
        </SheetProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
