import React, { Component } from 'react';
import {ActivityIndicator,AsyncStorage,StatusBar} from 'react-native';
import { Scene, Router, Actions, Stack, ActionConst } from 'react-native-router-flux';
import { _storeData, _getData } from "@Component/StoreAsync";
import Icon from "react-native-vector-icons/FontAwesome";
// import {USER_KEY} from '@Config/Services';
import Applications from './Application';
import Login from './Login/Login';
import Home from './Home/Home';
import Account from './Account';

//Menu Meter Reading
import HomeMeter from './MeterReading/Home';
import Download from './MeterReading/Download';
import Reading from './MeterReading/Reading/Reading';
import ReadScan from './MeterReading/Reading/ReadScan';
import ReadingForm from './MeterReading/Reading/ReadingForm';
import SummaryView from './MeterReading/Summary/SummaryView';
import FilterSearch from './MeterReading/Search/FilterSearch';
import ViewSearch from './MeterReading/Search/ViewSearch';
import Upload from './MeterReading/Upload/UploadAll';
import SeeAll from './MeterReading/Upload/SeeAll';
import Setting from './MeterReading/Setting/setting';

//Menu Customer Service
import HomeCS from './CustomerService/Home';
import SrfList from './CustomerService/SRF';
import SrfDetail from './CustomerService/SRF/SrfDetail';
import UpdateStatus from './CustomerService/Update';
import Search from './CustomerService/Update/Search';
import UpdateDetail from './CustomerService/Update/UpdateDetail';
import History from './CustomerService/History';
import HistoryDetail from './CustomerService/History/HistoryDetail';


const TabIcon = ({ focused, iconName }) => {
    var color = focused ? "#343393" : "#7f8c8d";
    return (
      <Icon
        name={iconName}
        color={color}
        size={24}
        style={{ marginTop: 8 }}
        textStyle={color}
      />
    );
  };

class Routes extends Component {

    constructor(){
        super()

        this.state = {
            hasLogin : false,
            isLoaded : false
        }
    }

    async componentDidMount() {
        // StatusBar.setBarStyle('dark-content', true)
        // StatusBar.setBackgroundColor('#4A98F7',true)
        try {
            const isLogin = await _getData("@isLogin");
            console.log("isLogin: ", isLogin);
            if (isLogin) {
              this.setState({ hasLogin: true, isLoaded: true });
            } else {
              this.setState({ hasLogin: null, isLoaded: true });
            }
        }catch (err) {
            console.log('error: ', err)
        };
        // this.setState({hasLogin: false});
    }

    render() {
        if(!this.state.isLoaded){
            return(
                <ActivityIndicator />
            )
        } else {
            return (
                <Router>
                    <Stack key="root" headerLayoutPreset="center">
                        <Scene key='Login' initial={!this.state.hasLogin} component={Login} hideNavBar={true} title=""/>
                        <Scene
                            key="tabbar"
                            initial={this.state.hasLogin}
                            hideNavBar
                            translucent={true}
                            tabs={true}
                        >
                            <Scene
                                key="home"
                                component={Home}
                                navTransparent={true}
                                hideNavBar={true}
                                title=""
                                tabBarLabel="Home"
                                // titleStyle=""
                                // labelStyle={{color: "#ad1819"}}
                                // activeTintColor="#ad1819"
                                // inactiveTintColor="#fff"
                                iconName="home"
                                icon={TabIcon}
                                // color="#ad1819"
                                // tintColor="#ad1819"
                            />
                            <Scene
                                key="notification"
                                component={Home}
                                navTransparent={true}
                                hideNavBar={true}
                                title=""
                                tabBarLabel="Notification"
                                // titleStyle=""
                                // labelStyle={{color: "#ad1819"}}
                                // activeTintColor="#ad1819"
                                // inactiveTintColor="#fff"
                                iconName="bars"
                                icon={TabIcon}
                                // color="#ad1819"
                                // tintColor="#ad1819"
                            />
                            <Scene
                                key="myaccount"
                                component={Account}
                                navTransparent={true}
                                hideNavBar={true}
                                title=""
                                tabBarLabel="My Account"
                                // titleStyle=""
                                // labelStyle={{color: "#ad1819"}}
                                // activeTintColor="#ad1819"
                                // inactiveTintColor="#fff"
                                iconName="building-o"
                                icon={TabIcon}
                                // color="#ad1819"
                                // tintColor="#ad1819"
                            />
                            
                        </Scene>
                            <Scene
                              key="MeterReading"
                              component={HomeMeter}
                              navTransparent={true}
                              hideNavBar={true}
                              title=""
                              tabBarLabel="MeterReading"
                              iconName="home"
                              icon={TabIcon}
                            />
                            <Scene
                              key="Download"
                              component={Download}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="Reading"
                              component={Reading}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="ReadScan"
                              component={ReadScan}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="ReadingForm"
                              component={ReadingForm}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="SummaryView"
                              component={SummaryView}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="FilterSearch"
                              component={FilterSearch}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="ViewSearch"
                              component={ViewSearch}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="Upload"
                              component={Upload}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="SeeAll"
                              component={SeeAll}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="Setting"
                              component={Setting}
                              hideNavBar={true}
                              title=""
                            />

                            
                            <Scene
                              key="CustomerService"
                              component={HomeCS}
                              navTransparent={true}
                              hideNavBar={true}
                              title=""
                              tabBarLabel="CustomerService"
                              iconName="home"
                              icon={TabIcon}
                            />

                            
                            <Scene
                              key="SrfList"
                              component={SrfList}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="SrfDetail"
                              component={SrfDetail}
                              hideNavBar={true}
                              title=""
                            />
                            
                            <Scene
                              key="UpdateStatus"
                              component={UpdateStatus}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="Search"
                              component={Search}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="UpdateDetail"
                              component={UpdateDetail}
                              hideNavBar={true}
                              title=""
                            />
                            
                            <Scene
                              key="History"
                              component={History}
                              hideNavBar={true}
                              title=""
                            />
                            <Scene
                              key="HistoryDetail"
                              component={HistoryDetail}
                              hideNavBar={true}
                              title=""
                            />
                    </Stack>
                </Router>
            );
        }
    }
}


export default Routes;