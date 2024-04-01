import React, { Component } from "react";
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
} from "react-native";
import {Item, Icon, Button, Header} from "native-base";
import {Picker} from '@react-native-picker/picker';
import { color, fonts, padding, dimensions, margin } from "@Asset/styles/base";
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
const Alert = new CAlert();



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
                <Text style={{color: "red"}}>{moment(data.reported_date).format("DD/MM/YYYY HH:MM")}</Text>
        </View>
        <Text style={{color: "green"}}>{data.lot_no} - {data.debtor_acct}</Text>
        <Text style={{color: "black", fontFamily: ""}}>Requested By {data.serv_req_by}</Text>
        </View>
  );

class History extends Component {
  _isMount = false;
  
  

  constructor(props) {
    super(props);

    this.state = {
      tower: "",
      email: "",
      isProgress: false,

      dataSRF: [],
    };
  }

  async componentDidMount() {
    this._isMount = true;
    const datas = {
        email: await _getData("@User"),
    };
    // console.log('datas',datas);
    this.setState(datas, () => {
        this.getList();
      });
  }

  getList = () => {
    let email = this.state.email;
    fetch(urlApi + "c_srf/getListHistory/IFCAPB/" + email , {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.Error === false) {
          let resData = res.Data;
          console.log("resData", resData);
          this.setState({ dataSRF: resData});
        } else {
            console.log('ERROR');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
 getDetail = (data) => {
    const dataPass = {
        report_no: data.report_no,
        email:this.state.email
    };
    console.log('dataPass',dataPass);
    Actions.HistoryDetail(dataPass);
    // Alert.show("Details are not ready yet !!", "cl");
};


  render() {
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.getDetail(item)}>
        <Items data={item} />
        </TouchableOpacity>
      );

     

    return (
        // const [selectedLanguage, setSelectedLanguage] = useState();
       

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
            <Text style={Styles.actionBarText}>{"SRF List".toUpperCase()}</Text>
          </View>
          <View style={Styles.actionBarRight}></View>
        </Header>

        <SafeAreaView style={styles.container}>
        <FlatList
            data={this.state.dataSRF}
            renderItem={renderItem}
            keyExtractor={item => item.report_no}
        />
        </SafeAreaView>
      </View>
    );
  }
}

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    borderRadius: 30,
    backgroundColor: Colors.hijautua,
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
    fontSize: 18,
    fontWeight: "bold"
  },
});
