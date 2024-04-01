//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage,ProgressBarAndroid ,Alert, StatusBar} from 'react-native';
import {Item, Icon, Button, Header} from "native-base";
import { color, fonts, padding, dimensions } from '@Asset/styles/base';
import Style from '../theme/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux'
// import * as Progress from 'react-native-progress';
import Query from '@Components/Function/Query';
import {urlApi} from '@Config/services';
// import {USER_KEY} from '@Config/Services';
import MAIN from '@Asset/styles/Theme'
import Icons from "react-native-vector-icons/Ionicons";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Color  from "../Themes/Colors";
import Style2  from "../Themes/Style";
import { height } from 'styled-system';

// create a component

class Home extends Component {
    state={
        click: false,
        progress : 0,
        showProgress : false,
        indeterminate : false
    }
    async componentDidMount(){
        const res = await AsyncStorage.getAllKeys();
        console.log('Result Async',res);
    }

    animate() {
        let progress = 0;
        this.setState({progress, showProgress:true,indeterminate:true });
        setTimeout(() => {
          this.setState({ indeterminate: false });
          setInterval(() => {
            progress += 0.01;
            if (progress > 1) {
                this.setState({progress:0, showProgress : false});

            }
            this.setState({ progress});
          }, 1);
        }, 1500);
      }
    
    clickToNavigate = async(to,param) =>{
        const dataAsync = await AsyncStorage.getItem("@DataMeter");
        if(dataAsync || to == 'download' || to=='setting'){
            Actions[to](param);
            this.setState({click:true})
        } else {
            alert('You must download first !')
        }
        
    }

    getData = async(data)=>{
        const dataAsync = await AsyncStorage.getItem('@DataMeter')
        let dataJson = JSON.parse(dataAsync)

        const result = Query(dataJson, data => data.meter_id)

        console.log(result.get(data))
        alert("Last Read : "+result.get(data)[0].last_read)
        
    }

    _storeData = async (name,data) =>{
        try {
            await AsyncStorage.setItem(name,data)
        } catch (error) {
            console.log('ErrorStoreData', error)
        }
    }
  
    render() {
        return (
            <View style={styles.container}>
                <Header style={Style2.navigation}>
                    <StatusBar
                        backgroundColor={Colors.statusBarOrange}
                        animated
                        barStyle="light-content"
                    />
                    <View style={Style2.actionBarLeft}>
                        <Button
                        transparent
                        style={Style2.actionBarBtn}
                        onPress={Actions.pop}
                        >
                        <Icon
                            active
                            name="arrow-left"
                            style={Style2.textWhite}
                            type="MaterialCommunityIcons"
                        />
                        </Button>
                    </View>
                    <View style={Style2.actionBarMiddle}>
                        <Text style={Style2.actionBarText}>{"Customer Service".toUpperCase()}</Text>
                    </View>
                    <View style={Style2.actionBarRight}></View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    {/* <Image 
                    style={styles.iconlogo}
                    source={require('@Asset/images/login/logo-biru.png')}/> */}
                   
               </View>
                </Header>
                <View style={styles.container2}>  
               <TouchableOpacity style={styles.download} onPress={()=>Actions.SrfList()}>
               <Image 
                style={styles.icondonwload} 
                source={require('@Asset/images/menu-dash/srf.png')}/>
                  <Text style={[Style.textBlue,styles.text]}>Service Request Form</Text>
                  {this.state.showProgress ? 
                  <ProgressBarAndroid styleAttr="Horizontal"  progress={this.state.progress} indeterminate={this.state.indeterminate} width={200} />
                  :
                  null
                  }
               </TouchableOpacity>
               <View style={styles.menu}>
                  <TouchableOpacity style={styles.reading}
                  onPress={() => Actions.Search()}>
                   <Image 
                   style={styles.icondonwload}
                   source={require('@Asset/images/menu-dash/update2.png')}/>
                   <Text style={[Style.textBlue,[Style.textBlue,styles.text]]}>Update Status</Text>     
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reading}
                  onPress={()=> Actions.History()}>
                   <Image 
                   style={{height: 60, width: 60}}
                   source={require('@Asset/images/menu-dash/history.png')}/>
                   <Text style={[Style.textBlue,styles.text]}>History</Text>     
                  </TouchableOpacity>
               </View>
            </View>
            </View>
        );
    }
}
 
// define your styles
const styles = StyleSheet.create({
    container: {
        flex :1,
        // paddingLeft: padding.sm,
        // paddingRight: padding.sm,
        width: dimensions.fullWidth,
        backgroundColor: '#FFFFFF',
    },
    container2: {
        flex :1,
        paddingLeft: padding.sm,
        paddingRight: padding.sm,
        paddingTop: padding.sm,
        width: dimensions.fullWidth,
        backgroundColor: '#FFFFFF',
    },
    icondonwload: {
        height: 55,
        width: 55,
        alignItems: 'center',
    },
    iconlogo: {
        height: 50,
        width: 150,
        resizeMode : "cover",
        alignItems:'flex-end',
        marginBottom: 16,
        marginTop: 20
    },
    menu: {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 16
    },
    reading: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        elevation: 10,
        width: wp('43%'),
        height: hp('25%'),
        alignItems:'center',
        justifyContent: 'center',
    },
    download: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10,
        width: null,
        height: null,
        alignItems:'center',
        justifyContent: 'center',
    },
    textdownload: {
        fontSize: fonts.sm,
        fontWeight: '300',
        color: '#F4B132'
    },
    text: {
        fontSize: fonts.sm,
        fontWeight: '300',
        marginTop: 8,
        color: Color.hijautua
    },
    btnLogout :{
        backgroundColor: '#fff',
        elevation : 20,
        borderRadius : 16,
        paddingHorizontal: 20,
        paddingVertical: 5,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center'
    }
});
//make this component available to the app
export default Home;
