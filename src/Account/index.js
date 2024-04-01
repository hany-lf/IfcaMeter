import React, { Component } from "react";
import { View,Text,StyleSheet, TouchableOpacity, Dimensions, Alert, AsyncStorage, PermissionsAndroid } from "react-native";
import { Actions } from 'react-native-router-flux'
import Style from '../theme/Style';
import MAIN from '@Asset/styles/Theme';
import {USER_KEY} from '@Config/services';
import Colors  from "../Themes/Colors";
const {COLORS} = MAIN;
const { width } = Dimensions.get("window");
import { _storeData, _getData } from "@Component/StoreAsync";

class Setting extends Component {

    handleLogout = async () => {
        // await AsyncStorage.removeItem(USER_KEY)
        try {
        _storeData("@isLogin", false);
        // const dataAsyncLogIn = await AsyncStorage.setItem('@isLogin', false);

        // console.log('dataAsyncLogIn',dataAsyncLogIn);
        } catch (err) {
            console.log("error:", err);
        }
        Actions.reset('Login');
    }

    handleClear = async () => {
        
        await AsyncStorage.setItem('@SaveDataMeter', "[]");
        
        const dataAsyncSave = await AsyncStorage.getItem('@SaveDataMeter')
        
        Actions.MeterReading();
    }

    handleClick = (parm) => {
        const to = 'handle' + parm;
        
        if (to == 'handleClear'){
            Alert.alert(
                'Are you sure to '+ parm +' ?',
                'It will be remove your data permanently',
                [
                    { text: "Cancel", onPress: () => console.log('Cancel') },
                    { text: "OK", onPress: () => this.handleClear() }
                ],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'Are you sure to '+ parm +' ?',
                'It will be remove your data permanently',
                [
                    { text: "Cancel", onPress: () => console.log('Cancel') },
                    { text: "OK", onPress: () => this.handleLogout() }
                ],
                { cancelable: false }
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={()=>this.handleClick('Logout')} style={[styles.btn,{backgroundColor : COLORS.PRIMARY }]}>
                    <Text style={[Style.textBlack,styles.text]}>Logout</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={()=>this.handleClick('Clear')} style={[styles.btn,{backgroundColor : COLORS.ERROR }]}>
                    <Text style={[Style.textBlack,styles.text]}>Clear Data</Text>
                </TouchableOpacity> */}
            </View>
        );
    }
}
export default Setting;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : '#fff'
    },
    btn : {
        padding : 20,
        margin : 20,
        backgroundColor  :'#f3f3f3',
        justifyContent : 'center',
        alignItems  :'center',
        borderRadius  : 20,
        elevation : 10,
        width : width * 0.7
    },
    text : {
        fontSize : 18,
        color : '#fff'
    }
});