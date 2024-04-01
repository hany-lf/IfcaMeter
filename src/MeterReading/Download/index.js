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
import {notifikasi} from "@Component/Notifikasi";

class Download extends Component {
  _isMount = false;

  constructor(props) {
    super(props);

    this.state = {
      tower: "",
      email: "",
      isProgress: false,

      dataTower: [],
    };
  }

  async componentDidMount() {
    this._isMount = true;
    const datas = {
        email: await _getData("@User"),
    };
    console.log('datas',datas);
    this.setState(datas, () => {
        this.getTower();
      });
  }

//   componentWillUnmount() {
//     this._isMount = false;
//   }

//   loadData = (data) => {
//     if (this._isMount) {
//       this.setState(data, () => {
//         this.getTower();
//       });
//     }
//   };

  getTower = () => {
    let email = this.state.email;
    fetch(urlApi + "c_product_info/getData/IFCA/" + email, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.Error === false) {
          let resData = res.Data;
          console.log("resData", resData);
          this.setState({ dataTower: resData, tower: resData[0] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  download = async () => {
    const data = this.state.dataTower.filter(
      (item) => item.project_no == this.state.tower.project_no
    );
    this.setState({ isProgress: !this.state.isProgress });

    let project_no = data[0].project_no;
    let db = data[0].db_profile;

    await fetch(urlApi + "c_meter_utility/getDataMu/" + db + "/" + project_no, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        if (!res.Error) {
          this.pushToStorage(res.Data);
          // console.log("resort", res);
          // notifikasi.configure();
          // notifikasi.buatChannel("1");
          // notifikasi.kirimNotifikasi("1","Judul","Pesan");
        } else {
          alert(res.Pesan);
        }
        
       
        this.setState({ isProgress: !this.state.isProgress });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isProgress: !this.state.isProgress });
      });
  };

  pushToStorage = async (data) => {
    const { entity_cd, project_no } = this.state.tower;

    const dataMeter = await _getData("@DataMeter");
    console.log('dataMeter',dataMeter);
    let newData = [];
    if (dataMeter) {
      const deleteDuplicateData = dataMeter.filter(
        (item) =>
          item.project_no.trim() !== project_no &&
          item.entity_cd.trim() !== project_no
      );
      newData = [...deleteDuplicateData, ...data];
    } else {
      newData = [...data];
    }
    this._storeData("@DataMeter", JSON.stringify(newData));
    this._storeData("@DataTower", JSON.stringify(this.state.dataTower));
    alert("Download Successful");
    console.log('@DataMeter',_getData("@DataMeter"));
  };

  _storeData = async (name, data) => {
    try {
      await AsyncStorage.setItem(name, data);
    } catch (error) {
      console.log("ErrorStoreData", error);
    }
  };

//   _getData = async (name) => {
//     try {
//       const value = await AsyncStorage.getItem(name);
//       let item = "";
//       try {
//         item = JSON.parse(value);
//       } catch (error) {
//         item = value;
//       }
//       return item;
//     } catch (error) {
//       console.log("ErrorGetData", error);
//     }
//   };

  renderPicker() {
    return (
      <Picker
        selectedValue={this.state.tower}
        mode={this.props.model}
        itemStyle={[Style.textBlack, { borderRadius: 20 }]}
        onValueChange={(itemValue, itemIndex) =>
          this.setState({ tower: itemValue })
        }
      >
        {this.loadOffice()}
      </Picker>
    );
  }

  loadOffice() {
      console.log('this.state.dataTower',this.state.dataTower);
    return this.state.dataTower.map((data, key) => (
      <Picker.Item key={key} label={data.project_descs} value={data} />
    ));
  }

  render() {
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
            <Text style={Styles.actionBarText}>{"Download".toUpperCase()}</Text>
          </View>
          <View style={Styles.actionBarRight}></View>
        </Header>

        <CSpinner visible={this.state.isProgress} />
        <View style={{ height: 20 }} />
        <RoundedView
          renderContent={this.renderPicker()}
          width="85%"
          height="8%"
        />
        <TouchableOpacity style={styles.button} onPress={() => this.download()}>
          <Text style={[Style.textWhite, styles.textscan]}>Download</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Download;

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
});
