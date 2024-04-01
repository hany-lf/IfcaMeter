import React, { Component } from 'react';
import { BackHandler, Platform, AsyncStorage,StyleSheet,  View  } from 'react-native';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
// import ReduxThunk from 'redux-thunk';
// import reducers from './reducers';
import Routes from './src/Routes';
// import { Actions } from 'react-native-router-flux'
// const GLOBAL = require('./config/Services');
// openApps = () => {
//     AsyncStorage.getItem(GLOBAL.CHECK_PAGE).then((value)=>{
//         var data = JSON.parse(value);
//         if(data == null){
//             Actions.launch();
//         }else{
//             Actions.home();
//         }
//     }).done();
// }
export default class App extends Component {
    render() {
        // openApps();
        // const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
        return (
            <View style={styles.container}>
                <Routes />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
      flex: 1,
    },
  
  });