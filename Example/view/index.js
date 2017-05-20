import React from 'react';
import { AppRegistry } from 'react-native';
import Main from './Main';
if (__DEV__) {
	global.isPushHot = true;	
}
if (!__DEV__) {
	global.isPushHot=false;
	global.console = {
		info: () => {},
		log: () => {},
		warn: () => {},
		error: () => {},
	};
}
AppRegistry.registerComponent('Example', () => Main);