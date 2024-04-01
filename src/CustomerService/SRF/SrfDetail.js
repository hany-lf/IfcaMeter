import React, { Component  } from "react";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  SafeAreaView,
  FlatList,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import {Item, Icon, Button, Header, Content, Container, Tabs, Tab} from "native-base";
import {Picker} from '@react-native-picker/picker';
import { color, fonts, padding, dimensions, margin } from "@Asset/styles/base";
import DatePicker from "@Components/Datepicker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { urlApi } from "@Config/services";
import Style from "../../theme/Style";
import Styles  from "../../Themes/Style";
import Colors  from "../../Themes/Colors";
import RoundedView from "@Components/UI/RoundedView";
import CSpinner from "@Components/Alert/CSpinner";
import { _storeData, _getData } from "@Component/StoreAsync";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import CAlert from "@Components/Alert/CAlert";
import TextInputs from "@Components/InputText/TextInput";
import { Fonts, Metrics } from "@Theme";
import { paddingTop } from "styled-system";
import Textarea from "react-native-textarea";
import Signature from "react-native-signature-canvas";
import SignatureScreen from "react-native-signature-canvas";
import RNFetchBlob from "rn-fetch-blob";
import RNFS from 'react-native-fs';

const Alert = new CAlert();
// const ref = useRef();
const imgWidth = 256;
const imgHeight = 256;

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];
  
  const Items = ({ data }) => (
    
        <View style={styles.item}>
        <View style={{flexDirection : 'row', justifyContent:'space-between'}}>
                <Text style={[styles.title,{color: "black", fontFamily: "monospace"}]}>#{data.report_no}</Text>
                <Text style={{color: "red"}}>{moment(data.reported_date).format("DD MMMM YYYY")}</Text>
        </View>
        <Text style={{color: "green"}}>{data.lot_no} - {data.debtor_acct}</Text>
        <Text style={{color: "black", fontFamily: ""}}>Requested By {data.serv_req_by}</Text>
        </View>
  );

class SrfDetail extends Component {
  _isMount = false;
  
  

  constructor(props) {
    super(props);

    this.state = {
      tower: "",
      email: "",
      isProgress: false,
      disabled: true,

      dataSRF: [],

      report_no: "",
      reported_date: "",
      serv_req_by: "",
      lot_no: "",
      contact_no: "",
      reported_by: "",
      billing_type: "",
      complain_source: "",
      work_requested: "",
      datadetail: [],
      picture: [],
      category_cd: '',
      name: '',
      assign_to: '',
      source: '',
      currency: '',
      area: '',
      location: '',
      floor: '',
      status: '',
      problem_cause: '',
      action_taken: '',
      remarks: '',
      entity_cd: '',
      project_no: '',
      processDate: '01-01-2021',
      img64: '',
      status_approval: '',
      name_approval: '',
      date_approval: '',
      link_url: '',
    };
    console.log('PROPS',props);
  }

  async componentDidMount() {
    this._isMount = true;
    const datas = {
        email: await _getData("@User"),
    };
    // this.setState(dataSRF, () => {
        this.getSrfDetail();
        Font.loadAsync({
          'Roboto': require('@Asset/fonts/AmericanTypewriter-CondensedBold.ttf'),
        })  
    //   });
    //   console.log('dataSRF',this.state.dataSRF);
  }

  getSrfDetail = () => {
    let email = this.state.email;
    let report_no = this.props.report_no;
    console.log('REPORT',report_no);
    fetch(urlApi + "c_srf/getDetail/IFCAPB/" + report_no , {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.Error === false) {
          let resData = res.Data;
          let resImages = res.DataImages;
          this.setState({ dataSRF: resData});
          this.setState({ report_no: resData[0].report_no});
          this.setState({ reported_date: resData[0].reported_date});
          this.setState({ serv_req_by: resData[0].serv_req_by});
          this.setState({ lot_no: resData[0].lot_no});
          this.setState({ contact_no: resData[0].contact_no});
          this.setState({ reported_by: resData[0].reported_by});
          this.setState({ billing_type: resData[0].billing_type});
          this.setState({ complain_source: resData[0].complain_source});
          this.setState({ work_requested: resData[0].work_requested});
          this.setState({ datadetail: resData});
          this.setState({ picture: resImages});
          this.setState({ category_cd: resData[0].category_cd});
          this.setState({ name: resData[0].name});
          this.setState({ assign_to: resData[0].assign_to});
          this.setState({ source: resData[0].complain_source});
          this.setState({ currency: resData[0].currency_cd});
          this.setState({ area: resData[0].area});
          this.setState({ location: resData[0].location});
          this.setState({ floor: resData[0].area});
          this.setState({ entity_cd: resData[0].entity_cd});
          this.setState({ project_no: resData[0].project_no});
          this.setState({ status_approval: resData[0].status_approval});
          this.setState({ name_approval: resData[0].name_approval});
          this.setState({ date_approval: resData[0].date_approval});
          this.setState({ link_url: resData[0].link_url});
          console.log('DATASrf',this.state.datadetail);
        } else {
            console.log('ERROR');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateStatus = () => {
    const formData = {
      status : this.state.status,
      problem_cause : this.state.problem_cause,
      action_taken  : this.state.action_taken,
      remarks       : this.state.remarks,
      entity_cd     : this.state.entity_cd,
      project_no     : this.state.project_no,
      report_no     : this.state.report_no,
    };
 console.log('Status',this.state.status.length);
//  return;
    if(this.state.status.length > 0  ){
        fetch(urlApi + "c_srf/updateStatus/IFCAPB",{
          method : "POST",
          body   : JSON.stringify(formData),
        })
        .then((res)=> {
          console.log('update',res);
          // return;
          if(!res.Error){
            alert('Success Updated');
            Actions.home();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('Please Choose the Status !');
    }
  };

  saveImage = (img) => {
    
    this.setState({img64 : img});
    var image_data = this.state.img64.split('data:image/png;base64,');
    image_data = image_data[1];
    
    let fileName = "Signature_"+this.state.report_no+".png";

    const formDatas = {
      dataSign : this.state.img64,
      report_no : this.state.report_no,
      name  : this.state.name
    };
    
      
        console.log('formDatas', JSON.stringify(formDatas));
        fetch(urlApi + "c_srf/saveApproval/IFCAPB",{
          method : "POST",
          body   : JSON.stringify(formDatas),
        })
        .then((res) => {
          console.log('res',res);
          if(!res.Error){
            this.setState({disabled : false});
            alert('Approval Success');
          }
        }) 
        .catch((error) => {
          console.log(error);
        });

  };

  handleClear = () => {
    this.setState({disabled: true});
    this.setState({img64 : ''});
  };

 getDetail = (data) => {
    const dataPass = {
        report_no: data.report_no,
        email:this.state.email
    };
    console.log('dataPass',dataPass);
    // Actions.SRFDetail(dataPass);
    Alert.show("Details are not ready yet !!", "cl");
};


  render() {
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.getDetail(item)}>
        <Items data={item} />
        </TouchableOpacity>
      );

      let data = this.state;return (
        // const [selectedLanguage, setSelectedLanguage] = useState();
      
    // <Container>
      <View style={styles.container}>
          <Header style={Styles.navigation}>
          <StatusBar
            backgroundColor={Colors.statusBarOrange}
            animated
            barStyle="light-content"
          />
          <View style={Styles.actionBarLeft}>
            <Button
              transparent
              style={Styles.actionBarBtn}
              onPress={Actions.pop}
            >
              <Icon
                active
                name="arrow-left"
                style={Styles.textWhite}
                type="MaterialCommunityIcons"
              />
            </Button>
          </View>
          <View style={Styles.actionBarMiddle}>
            <Text style={Styles.actionBarText}>{"Service Request Form".toUpperCase()}</Text>
          </View>
          <View style={Styles.actionBarRight}></View>
        </Header>

        {/* <SafeAreaView style={styles.container}> */}
        {/* <FlatList
            data={this.state.dataSRF}
            renderItem={renderItem}
            keyExtractor={item => item.report_no}
        /> */}
    <Content>
        {/* <View> */}
        <Tabs tabBarUnderlineStyle={{backgroundColor: Colors.hijaumuda,}}  
                    tabBarBackgroundColor='#000' 
                    tabStyle = {{backgroundColor: Colors.white}}
                    locked = 'false'>
            <Tab    tabStyle={{backgroundColor: Colors.white}}
                    textStyle={{color:Colors.black, fontFamily: 'Cochin-Bold', fontSize: 15}}
                    activeTabStyle={{backgroundColor:Colors.white}}
                    activeTextStyle={{color:Colors.hijaumuda, fontFamily: 'Cochin-Bold', fontSize: 15}}
                    // borderColor={{color:Colors.black}}
                    heading= "DETAIL"
            >
            <ScrollView  style={[styles.innercontainer, 
                // {elevation: 7, backgroundColor : Colors.white, height: Metrics.HEIGHT * 0.3}
                ]}>
            <View style={{flexDirection: 'row', paddingTop: 20}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>Status</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20}}>
                    <Text style={{textDecorationLine: 'underline', fontWeight: 'bold', fontFamily: 'sfuiDisplaySemibold'}}>Report No</Text>
                </View>
            </View>

            <View style={{flexDirection: 'row'}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{color: Colors.hijaumuda}}>
                        Assign
                        </Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20}}>
                    <Text style={{fontWeight: 'bold', fontFamily: 'Fonts.type.sfuiDisplaySemibold', color: Colors.oren}}>{this.state.report_no}</Text>
                </View>
            </View>

            <View style={{flexDirection: 'row', paddingTop: 20}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}} >Ticket Date</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20}}>
                    <Text style={{fontFamily: 'Palatino-Bold'}}>{moment(this.state.reported_date).format("DD/MM/YYYY hh:mm")}</Text>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Category</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20}}>
                    <Text style={{fontFamily: 'Palatino-Bold'}}> {this.state.category_cd} </Text>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Lot No</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20}}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.lot_no} </Text>
                </View>
            </View>

           
           
            {/* <View style={{ paddingHorizontal: 20}}>
                <View 
                    style={{
                        borderBottomColor: Colors.grey,
                        borderBottomWidth: 2,
                        paddingVertical: 10,
                        paddingLeft: 10,
                    }}
                />
            </View> */}

            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Name of Owner</Text>
                </View>
                <View style={{alignContent: 'space-between', paddingRight: 23, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}>{this.state.serv_req_by}</Text>
                </View>
            </View>

            
            <View style={{flexDirection: 'row', paddingTop: 10, }}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20,}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Request By</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.reported_by} </Text>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Contact Person</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.name} </Text>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Contact No</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.contact_no} </Text>
                </View>
            </View>
            
            {/* <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text>Assign To</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.assign_to} </Text>
                </View>
            </View>
            
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text>Source</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.source} </Text>
                </View>
            </View> */}
            
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Currency</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.currency} </Text>
                </View>
            </View>
            
            {/* <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text>Area</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.area} </Text>
                </View>
            </View> */}
            
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Location</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.location} </Text>
                </View>
            </View>
{/*             
            <View style={{flexDirection: 'row', paddingTop: 10}}>
                <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20}}>
                    <Text>Floor</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <Text style={{ fontFamily: 'Palatino-Bold'}}> {this.state.floor} </Text>
                </View>
            </View> */}
            
            {/* <View style={{flexDirection: 'row', paddingTop: 10}}> */}
                <View style={{ alignContent: 'space-between', flex: 1, paddingTop: 10 ,paddingLeft: 20, paddingRight: 20}}>
                    <Text style={{fontFamily: 'Palatino-Roman'}}>Work Requested</Text>
                </View>
                <View style={{ alignContent: 'space-between', paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, }}>
                        <Textarea
                          containerStyle={[styles.textareaContainer, {backgroundColor: '#f2f2f2'}]}
                          style={[styles.textarea,{fontFamily: 'Palatino-Bold'}]}
                          onChangeText={(text) => this.setState({remarks: text})}
                          defaultValue={this.state.work_requested}
                          // maxLength={250}
                          // placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'}
                          placeholderTextColor={'#c7c7c7'}
                          underlineColorAndroid={'transparent'}
                          editable = {false}
                        />
                    {/* <Text style={{fontWeight: 'bold', fontFamily: 'Fonts.type.sfuiDisplaySemibold'}}> {this.state.work_requested} </Text> */}
                </View>
            {/* </View> */}
            
            </ScrollView>

            </Tab>
            <Tab tabStyle={{backgroundColor: Colors.white}}
                    textStyle={{color:Colors.black, fontFamily: 'Cochin-Bold', fontSize: 15}}
                    activeTabStyle={{backgroundColor:Colors.white}}
                    activeTextStyle={{color:Colors.hijaumuda, fontFamily: 'Cochin-Bold', fontSize: 15}} 
                    heading = 'GALLERY'
            >
                {this.state.picture.map(pict => (
                    <View style={styles.containImageTop}>
                    <Image style={{width: 200, height: 130, borderColor: Colors.hijautua, borderWidth: 3}} source={{uri: pict.file_url}} />
                    </View>
                ))}

            </Tab>

            

            <Tab tabStyle={{backgroundColor: Colors.white}}
                    textStyle={{color:Colors.black, fontFamily: 'Cochin-Bold', fontSize: 15}}
                    activeTabStyle={{backgroundColor:Colors.white}}
                    activeTextStyle={{color:Colors.hijaumuda, fontFamily: 'Cochin-Bold', fontSize: 15}} 
                    heading = 'FEEDBACK'
            >

                    <View style={this.state.status == 'P' ? {display: 'none'} : {paddingLeft: 10, paddingTop: 5, width: 350, height: 380 }}>
                        <Text style={{fontFamily: 'Palatino-Bold'}} >Please Approve Here</Text>
                        <Signature
                              // ref={ref}
                              // overlaySrc={this.state.link_url}
                              // bgSrc={this.state.link_url}
                              // overlayWidth={imgWidth}
                              // overlayHeight={imgHeight}
                              // webStyle={style}
                              onOK={(img) => this.saveImage(img) }
                              onClear={() => this.handleClear()}
                            />
                    </View>

               <View style={this.state.disabled == true ? {display: 'none'} :{flexDirection: 'row', paddingTop: 10}}>
                     
                    <View style={{ alignContent: 'space-between', flex: 1 ,paddingLeft: 20, paddingTop: 17}}>
                        <Text style={{fontFamily: 'Palatino-Bold'}} >Status</Text>
                    </View>
                    <View style={{alignContent: 'space-between', paddingRight: 23, }}>
                    <Picker
                        selectedValue={this.state.status}
                        style={{ height: 20, width: 200, 
                            borderBottomColor: 'black',
                            borderBottomWidth: 3 }}
                        onValueChange={(itemValue, itemIndex) => this.setState({status: itemValue})}
                    >
                        <Picker.Item label="Choose Status" value="" />
                        <Picker.Item label="Process" value="P" />
                        <Picker.Item label="Cancel" value="X" />
                    </Picker>
                    </View>
                </View>

                <View style={this.state.status != 'P' ? {display: 'none'} : {paddingTop: 10,paddingLeft: 20, paddingRight: 20, flexDirection: 'row'}}>
                    <View style={{alignContent: 'space-between', flex: 1,  paddingTop: 17}}>
                        <Text style={{fontFamily: 'Palatino-Bold'}} >Process Date</Text>
                    </View>
                    <View style={{ alignContent: 'space-between', paddingRight: 20, }}>
                    <DatePicker
                            style={styles.dates}
                            date={this.state.processDate}
                            format={"DD-MM-YYYY"}
                            onChange={date => this.setState({ processDate: date })}
                    />
                    </View>
                </View>

                <View style={this.state.status != 'P' ? {display: 'none'} : {paddingTop: 10,paddingLeft: 20, paddingRight: 20}}>
                    <View style={{   paddingTop: 17}}>
                        <Text style={{fontFamily: 'Palatino-Bold'}} >Problem Cause</Text>
                    </View>
                    <View style={{ paddingTop: 5}}>
                        <Textarea
                          containerStyle={styles.textareaContainer}
                          style={styles.textarea}
                          onChangeText={(text) => this.setState({problem_cause: text})}
                          defaultValue={this.state.problem_cause}
                          // maxLength={250}
                          // placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'}
                          placeholderTextColor={'#c7c7c7'}
                          underlineColorAndroid={'transparent'}
                        />
                    </View>
                </View>

                <View style={this.state.status != 'P' ? {display: 'none'} :{paddingTop: 10,paddingLeft: 20, paddingRight: 20}}>
                    <View style={{   paddingTop: 17}}>
                        <Text style={{fontFamily: 'Palatino-Bold'}} >Action Taken</Text>
                    </View>
                    <View style={{ paddingTop: 5}}>
                        <Textarea
                          containerStyle={styles.textareaContainer}
                          style={styles.textarea}
                          onChangeText={(text) => this.setState({action_taken: text})}
                          defaultValue={this.state.action_taken}
                          // maxLength={250}
                          // placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'}
                          placeholderTextColor={'#c7c7c7'}
                          underlineColorAndroid={'transparent'}
                        />
                    </View>
                </View>
                

                <View style={this.state.status != 'P' ? {display: 'none'} :{paddingTop: 10, paddingRight: 20,paddingLeft: 20}}>
                    <View style={{   paddingTop: 17}}>
                        <Text style={{fontFamily: 'Palatino-Bold'}} >Remarks</Text>
                    </View>
                    <View style={{ paddingTop: 5}}>
                        <Textarea
                          containerStyle={styles.textareaContainer}
                          style={styles.textarea}
                          onChangeText={(text) => this.setState({remarks: text})}
                          defaultValue={this.state.remarks}
                          // maxLength={250}
                          // placeholder={'好玩有趣的，大家同乐，伤感忧闷的，大家同哭。。。'}
                          placeholderTextColor={'#c7c7c7'}
                          underlineColorAndroid={'transparent'}
                        />
                    </View>
                </View>

                <TouchableOpacity disabled={this.state.disabled} style={this.state.disabled == true ? {display: 'none'} :styles.button} onPress={()=>this.updateStatus()} >
                  <Text style={[Style.textWhite,styles.textscan]}>Update Status</Text>
                </TouchableOpacity>

            </Tab>
            </Tabs>
        {/* </View> */}
        </Content>
        {/* </SafeAreaView> */}
      </View>
      // </Container>
    );
  }
}

export default SrfDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innercontainer: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 25,
    // paddingVertical: 5,
  },
  overview: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,

  },
  overviewTitle: {
    flex: 1,
    fontFamily: Fonts.type.robotoRegular,
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold'
  },
  textInputBold: {
    // fontFamily: Fonts.type.bold,
    fontWeight: 'bold',
    borderBottomWidth: 0,
    borderColor: '#DDD',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 12,
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    color: 'black'
  },
  picker: {
    marginTop: 24,
    backgroundColor: "#FFF",
    width: wp("80%"),
    alignSelf: "center",
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 1,
  },
  button: {
    width: null,
    height: hp("7%"),
    borderRadius: 10,
    backgroundColor: Colors.oren,
    justifyContent: "center",
    alignItems: "center",
    margin: margin.lg,
  },
  textscan: {
    fontSize: fonts.sm,
    fontWeight: "700",
    color: "#fff",
  },
  containers: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: Colors.backgrey,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 0.5
    // marginVertical: 8,
    // marginHorizontal: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    // textAlign: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  textInput: {
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    borderBottomWidth: 0,
    borderColor: '#DDD',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 13,
    // width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  containImageTop: {
    // backgroundColor: "#fff",
    width: Metrics.WIDTH * 1,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    elevation: 3,
    paddingVertical: 20
  },
  headerDetail: {
    backgroundColor: "#fff",
    width: Metrics.WIDTH * 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    elevation: 3,
    paddingVertical: 20
  },
  textareaContainer: {
    height: 100,
    padding: 5,
    backgroundColor: '#FFF',
    borderColor: Colors.abumuda,
    borderWidth: 0,
    borderRadius: 16,
    // shadowColor: Colors.abumuda,
            // shadowOffset: {
            //   width: 0,
            //   height: 10,
            // },
            // shadowOpacity: 0.12,
            // shadowRadius: 60,

            elevation: 3
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
    height: 90,
    fontSize: 14,
    color: '#333',
    borderWidth: 0,
    fontFamily: 'Palatino-Roman'
  },
  dates: {
      paddingVertical: 2,
      width: wp("55%"),
      backgroundColor: "#FFF",
      alignSelf: "center",
      borderRadius: 16,
      elevation: 3,
      justifyContent: "center",
      borderWidth: 0
  },
});
