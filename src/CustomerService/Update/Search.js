//import liraries
import React, { Component } from "react";
import { View, Text, StatusBar, StyleSheet,  TextInput, TouchableOpacity, Modal, AsyncStorage } from "react-native";
import {Item, Icon, Button, Header, Row} from "native-base";
import {Picker} from '@react-native-picker/picker';
import { Actions } from "react-native-router-flux";
import DatePicker from "react-native-datepicker";
import { color, fonts, padding, dimensions, margin } from "@Asset/styles/base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import nbStyles from './Style';
import Icons from 'react-native-vector-icons/FontAwesome'
import RoundedView from '@Components/UI/RoundedView';
import TextInputs from "../../MeterReading/components/InputText/TextInput";
import MAIN from '@Asset/styles/Theme';
import Style from '../../theme/Style';
import Styles  from "../../Themes/Style";
import Colors  from "../../Themes/Colors";
import { Vibration } from "react-native";

const dataMeterType = [
  { id: 1, name: "Electric", type:"E" },
  { id: 2, name: "Water", type:"W" },
  { id: 3, name: "Gas", type :"G" }
]
// create a component
class Search extends Component {
  _isMount = false;
  constructor(props) {
    super(props);
    this.state = {
      
      dataTower:[],

      dataqr: '',
      modalVisible: false,

      selMeterType : dataMeterType[0],
      selTower: '' ,
      startdate: new Date(),
      enddate: new Date(),

    };
    this.renderPicker = this.renderPicker.bind(this)
    this.renderMeterType = this.renderMeterType.bind(this)
  }

  async componentDidMount(){
    const dataAsync = await AsyncStorage.getItem('@DataTower')
    const dataTowers = JSON.parse(dataAsync)

    const data = {
      dataTower : dataTowers,
      selTower : dataTowers[0]
    }


    this.setState(data)
  }

  UNSAFE_componentWillReceiveProps(props) {

    console.log('props',props);
    // alert("oke")

    if(props.type == "saving"){
      this.setState({dataqr : "",});
    } else if(props.type == "reading") {
      this.setState({dataqr : props.meterId},()=>{
        this.goToReadingForm()
      })
    }

  }

  clickReadingScan() {
    Actions.ReadScan();
    this.setState({click:true})
  }
  
  clickReadingForm() {
    if(this.state.dataqr.length < 1 ){
      alert('Fill Meter-Id corectly !')
    } else {
      this.goToReadingForm()
      this.setState({click:true})
    }
  }

  goToReadingForm = () =>{
    const {dataqr,selTower, selMeterType } = this.state
    const dataPass = {
      meterId : this.state.dataqr.toUpperCase(),
      selTower,
      selMeterType
    };
    console.log('dataPass',dataPass);
    Actions.ReadingForm(dataPass);
  }

  getList = () => {
      const dataList = {
          status : this.state.status,
          startdate : this.state.startdate,
          enddate : this.state.enddate
      };

      console.log('Data List', dataList);
      Actions.UpdateStatus(dataList);
  }
  
  setModalVisible(visible) {
      this.setState({ modalVisible: visible});
  }

  renderPicker(i){
    const {selectedItem, setSelectedItem} = this.state
    return(
        <Picker
            selectedValue={this.state.selectedItem}
            onValueChange={(itemValue, itemIndex) =>
           (this.setState({selectedItem:itemValue, status: itemValue}))
        }>
            <Picker.Item label="Cancel" value="X" />
            <Picker.Item label="Process" value="P" />
            <Picker.Item label="Modify" value="M" />
            <Picker.Item label="Confirm" value="F" />
            <Picker.Item label="Approved" value="Y" />
            <Picker.Item label="Posted" value="Z" />
        </Picker>
    )
  }

  renderTower() {
    return this.state.dataTower.map((tower,key) => (
      <Picker.Item key={key} label={tower.project_descs} value={tower} />
    ));
  }

  renderMeterType() {
    return dataMeterType.map((offc,key) => (
      <Picker.Item key={key} label={offc.name} value={offc} />
    ));
  }

  render() {
    return (
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
            <Text style={Styles.actionBarText}>{"Status".toUpperCase()}</Text>
          </View>
          <View style={Styles.actionBarRight}></View>
        </Header>

        <Text style={[Style.textGreyDark,styles.text]}>Choose Status</Text>
        <RoundedView renderContent={this.renderPicker('Tower')} width='85%' height="8%"/>

        <Text style={[Style.textGreyDark,styles.text]}>Range Date</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <DatePicker
            style={{width: 180}}
            date={this.state.startdate}
            mode="date"
            placeholder="select date"
            format="DD/MM/YYYY"
            // minDate="2016-05-01"
            // maxDate="2016-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
            dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
                display: 'none'
            },
            dateInput: {
                marginTop: 15,
                marginLeft: 40,
                marginRight: 0,
                borderRadius: 16,  
            }
            // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {this.setState({startdate: date})}}
        />
        <Text style={[Style.textGreyDark,styles.text]}> - </Text>
        <DatePicker
            style={{width: 180}}
            date={this.state.enddate}
            mode="date"
            placeholder="select date"
            format="DD/MM/YYYY"
            // minDate="2016-05-01"
            // maxDate="2016-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
            dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
                display: 'none'
            },
            dateInput: {
                marginTop: 15,
                marginLeft: 15,
                marginRight: 30,
                borderRadius: 16,
                // alignSelf: "center",
                // elevation : 2,
                // justifyContent :'center',
                // flexDirection : 'row',
            }
            // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {this.setState({enddate: date})}}
        />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={()=>this.getList()} >
          <Text style={[Style.textWhite,styles.textscan]}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingLeft: padding.sm,
    // paddingRight: padding.sm,
    width: dimensions.fullWidth,
  },
  readForm : {
    flexDirection : 'row',
    width: wp('85%'),
    alignSelf: "center",
    justifyContent:'space-between'
  },
  readInput :{
    paddingLeft : 20,
    backgroundColor: "#FFF",
    borderRadius: 16,
    width : '80%',
    height : 60,
    alignItems : 'flex-start',
    justifyContent :'center',
    elevation : 20
  },
  btnScan : {
    marginTop: 5,
    backgroundColor: "#fff",
    width : wp('16%'),
    height : hp('8%'),
    justifyContent :'center',
    alignItems :'center',
    borderRadius : 16,
    elevation :3
  },  
  dates: {
    marginTop: margin.sm,
    paddingLeft: padding.sm,
    paddingRight: padding.sm
  },
  text: {
    marginTop: margin.sm,
    fontSize: fonts.sm,
    fontWeight: "300",
    marginLeft: margin.sm
  },
  textscan: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff"
  },
  scan: {
    width: null,
    height: hp('10%'),
    borderRadius: 5,
    backgroundColor: "#FFC864",
    justifyContent: "center",
    alignItems : "center",
    marginTop:30,
    marginLeft: margin.sm,
    marginRight: margin.sm
  },
  button: {
    width: null,
    height: hp("7%"),
    borderRadius: 30,
    backgroundColor: Colors.hijautua,
    justifyContent: "center",
    alignItems: "center",
    margin: margin.lg,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  picker: {
        marginTop: 24,
        backgroundColor: "#FFF",
        width: wp('80%'),
        alignSelf: "center",
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
    },
});

//make this component available to the app
export default Search;
