/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Routes from './src/Routes';
import App from './App';
import {name as appName} from './app.json';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Remote debugger']);
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native']);
LogBox.ignoreLogs(['If you want to use Reanimated 2']);
LogBox.ignoreLogs(["Deprecation in 'navigationOptions'"]);
LogBox.ignoreLogs(["Deprecation in 'createStackNavigator'"]);
LogBox.ignoreLogs(["Warning: componentWillReceiveProps has been renamed"]);
LogBox.ignoreLogs(["Require cycle: node_modules"]);

AppRegistry.registerComponent(appName, () => App);

// AppRegistry.registerComponent(appName, () => Routes);
