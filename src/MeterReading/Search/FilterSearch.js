//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, AsyncStorage, StatusBar } from "react-native";
import {Item, Icon, Button, Header} from "native-base";
import { Actions } from "react-native-router-flux";
import {Picker} from '@react-native-picker/picker';
import Colors  from "../../Themes/Colors";
// import DatePick from "react-native-datepicker";
import { color, fonts, padding, dimensions, margin } from "@Asset/styles/base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Icon from 'react-native-vector-icons/FontAwesome'
import RoundedView from '@Components/UI/RoundedView';
import TextInputs from "@Components/InputText/TextInput";
import MAIN from '@Asset/styles/Theme';
import Style from '../../theme/Style';
import Style2  from "../../Themes/Style";

const dataMeterType = [
  { id: 1, name: "Electric", type:"E" },
  { id: 2, name: "Water", type:"W" },
  { id: 3, name: "Gas", type :"G" }
]
// create a component
class FilterSearch extends Component {
  _isMount = false;
  constructor(props) {
    super(props);
    this.state = {
      
      dataTower:[],

      dataqr: '',
      modalVisible: false,

      selMeterType : dataMeterType[0],
      selTower: '' 

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
    Actions.readingScan();
    this.setState({click:true})
  }
  
  clickReadingForm() {
    this.goToReadingForm()
    this.setState({click:true})
  }

  goToReadingForm = () =>{
    const {dataqr,selTower, selMeterType } = this.state
    const dataPass = {
      meterId : this.state.dataqr.toUpperCase(),
      selTower,
      selMeterType
    };
    console.log('dataPass',dataPass);
    Actions.ViewSearch(dataPass);
  }
  
  setModalVisible(visible) {
      this.setState({ modalVisible: visible});
  }

  renderPicker(i){
    const ref = {}
    const selRef = 'sel' + i
    var fn = 'render' + (i) 
    return(
      <Picker
        selectedValue={this.state[selRef]}
        mode={this.props.model}
        onValueChange={(itemValue, itemIndex) =>{
          ref['sel'+i] = itemValue
          this.setState(ref)
        }}
      >
        {this[fn]()}
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
                        <Text style={Style2.actionBarText}>{"Search".toUpperCase()}</Text>
                    </View>
                    <View style={Style2.actionBarRight}></View>
         </Header>
        <Text style={[Style.textGreyDark,styles.text]}>Choose Tower</Text>
        <RoundedView renderContent={this.renderPicker('Tower')} width='85%' height="8%"/>

        <Text style={[Style.textGreyDark,styles.text]}>Choose Type</Text>
        <RoundedView renderContent={this.renderPicker('MeterType')} width='85%' height="8%"/>

        <TouchableOpacity style={styles.button} onPress={()=>this.clickReadingForm()} >
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
export default FilterSearch;
