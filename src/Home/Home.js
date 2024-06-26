import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Title,
  Left,
  Right,
  Body,
  Input,
  Item,
  Footer,
  View,
  FooterTab,
  Badge,
  List,
  ListItem,
  Tab,
  Tabs,
  Fab,
  Form,
  Label,
} from "native-base";
import LinearGradient from "react-native-linear-gradient";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "./styles/SliderEntry";
import SliderEntry from "../components/SlideEntry";
import styles, { colors } from "./styles/index";
import { ENTRIES1, ENTRIES2 } from "./static/entries";
import { scrollInterpolators, animatedStyles } from "./utils/animations";
import CardSlide from "../components/CardSlide";
const { height, width } = Dimensions.get("window");
import { urlApi } from "@Config/services";
import { _storeData, _getData } from "@Component/StoreAsync";
import { Actions } from "react-native-router-flux";
import Styles from "./Style";
const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
import SIMILAR from "../Property/Similar";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import moment from "moment";
import Image1 from './instalment.png';
import Image2 from './about.png';
import Image3 from './realtime_unit.png';
import { Colors } from "react-native/Libraries/NewAppScreen";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      name: "",
      email: "",
      dataTower: [],
      dataPromo: [],
      dataNews: [
        { 
          id      : '1',
          picture : Image1,
          descs   : 'Test',
          subject : 'Testing'
        },
        {
          id      : '2',
          picture : Image2,
          descs   : 'Tes2',
          subject : 'Testing'
        },
        {
          id      : '3',
          picture : Image3,
          descs   : 'Tes3',
          subject : 'Testing'
        },
      ],
      attendanceSession: [],
      currentSession: 0,

      isCorLoaded: false,
    };
  }

  // componentWillMount() {
  //   this.startHeaderHeight = 80;
  //   if (Platform.OS == "android") {
  //     this.startHeaderHeight = 100 + StatusBar.currentHeight;
  //   }
  // }

  async componentDidMount() {
    // this.startHeaderHeight = 80;
    // if (Platform.OS == "android") {
    //   this.startHeaderHeight = 100 + StatusBar.currentHeight;
    // }
    const data = {
      email: await _getData("@User"),
      name: await _getData("@Name"),
      dataTower: await _getData("@UserProject"),
      attendanceSession: await _getData("@AttendanceSession"),
      isCorLoaded: true,
    };
    console.log("homedata", data);

    const isAttend = await _getData("@sessAttended");
    console.log("isAttend", isAttend);

    this.setState(data, () => {
      // this.getPromo();
      // this.getNews();
      if (data.attendanceSession != null) {
        this.checkAttendance(isAttend);
      }
    });

  }

  checkAttendance = (session) => {
    const { attendanceSession } = this.state;

    for (let i = 0; i < attendanceSession.length; i++) {
      var from = attendanceSession[i].TimeIn;
      var from_format = moment(new Date(from)).format("H:mm:ss");
      //console.log("format", from_format);
      //console.log("liatdongfr", from);
      var to = attendanceSession[i + 1]
        ? attendanceSession[i + 1].TimeIn
        : moment(new Date(2000, 1, 1, 22, 0, 0, 0)).format("H:mm:ss");
      var to_format = moment(new Date(to)).format("H:mm:ss");
    //   console.log("to_format", to_format);
      var sessAttend = attendanceSession[i].Session_Cd;
    //   console.log("liatdongcd", sessAttend);

      if (
        moment().format("H:mm:ss") >= from_format &&
        moment().format("H:mm:ss") <= to_format
      ) {
        _storeData("@currAttended", sessAttend); //Ini sama aja isAttend
        console.log("liatdong", sessAttend);
        if (sessAttend !== session) {
          console.log("oke", attendanceSession.length);
        //   this.showAlertAttendance(attendanceSession[i]);
          break;
        }
      }
      console.log("from_format", from_format);
      console.log("now", moment().format("H:mm:ss"));
      console.log("to_format", to_format);
    }
  };

  showAlertAttendance = (session) => {
    this.setState({});
    Alert.alert(
      "Attendance Notification",
      `Let's attend your activity [${session.Session_descs}]`,
      [
        {
          text: "Ask me later",
          onPress: () => console.log("Ask me later pressed"),
        },

        {
          text: "Let's Go !",
          onPress: () => {
            Actions.AttendancePage();
          },
        },
      ],
      { cancelable: false }
    );
  };

  getPromo = () => {
    fetch(
      urlApi +
        "c_newsandpromo/getDatapromo/IFCAMOBILE/" +
        this.state.email,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((res) => {
        if (!res.Error) {
          const resData = res.Data;

          this.setState({ dataPromo: resData });
          console.log("dataPRopmo", resData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getNews = () => {
    fetch(
      urlApi +
        "c_newsandpromo/getDatanews/IFCAMOBILE/" +
        this.state.email,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((res) => {
        if (!res.Error) {
          const resData = res.Data;

          this.setState({ dataNews: resData });
          console.log("dataNews", resData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // _renderItem({ item, index }) {
  //   return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
  // }

  _renderItemPromo({ item, index }, parallaxProps) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => Actions.NewsAndPromoDetail({ items: item })}
      >
        <ParallaxImage
          source={{ uri: item.picture }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <View style={styles.newsTitle}>
          <Text style={styles.newsTitleText} numberOfLines={2}>
            {item.subject}
          </Text>
          <Text style={styles.newsTitleText_small}>{item.descs}</Text>
        </View>
        {/* <View style={styles.newsTitle_small}>
              <Text style={styles.newsTitleText_small} numberOfLines={2}>
                  { item.descs }
              </Text>
            </View> */}
      </TouchableOpacity>
    );
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
        onPress={() => Actions.propertydetail({ items: item })}
      />
    );
  }

  _renderLightItem({ item, index }) {
    return <SliderEntry data={item} even={false} />;
  }

  _renderDarkItem({ item, index }) {
    return <SliderEntry data={item} even={true} />;
  }

  mainExample(number, title) {
    const { slider1ActiveSlide } = this.state;

    return (
      <View style={styles.exampleContainer}>
        {/* //??? Di Matiin Belum nemu Solusi Biar ke refresh */}
        {/* <Text style={styles.title}>Hey {this.state.name}</Text> */}
        <Text style={styles.title}>Engineering</Text>
        <Text style={styles.subtitle}>{`This is what you need!`}</Text>
        <Text>{"\n"}</Text>

        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            flex: 1,
            paddingRight: 16,
            marginTop: -20,
          }}
        >
          <Button
            small
            rounded
            style={Styles.sBtnHead}
            onPress={() => Actions.ListingProjectPage()}
          >
            <Text style={Styles.sLinkHead}>ALL PROJECT</Text>
          </Button>
        </View>

        <View style={styles.corContainerStyle}>
          {/* {this.state.dataTower.length == 0 ? (
            <ActivityIndicator size="large" />
          ) :  */}
          (
            <Carousel
              ref={(c) => (this._slider1Ref = c)}
              data={this.state.dataTower}
              renderItem={this._renderItemWithParallax}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              hasParallaxImages={true}
              firstItem={SLIDER_1_FIRST_ITEM}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.7}
              inactiveSlideShift={20}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContentContainer}
              loop={false}
              loopClonesPerSide={2}
              enableMomentum={false}
              lockScrollWhileSnapping={true}
              autoplay={false}
              autoplayDelay={1000}
              autoplayInterval={3000}
            />
          )
          {/* } */}
        </View>
      </View>
    );
  }

  get gradient() {
    return (
      <LinearGradient
        colors={[colors.background2, colors.gray]}
        startPoint={{ x: 0, y: 0 }}
        endPoint={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    );
  }

  renderItemNews(item) {
    console.log('ITEM',item);
    const ImageUri = Image.resolveAssetSource(item.picture).uri;
    console.log('ImageUri',ImageUri);
    return (
      <TouchableOpacity
        style={Styles.item}
        underlayColor="transparent"
        onPress={() => Actions.NewsAndPromoDetail({ items: item })}
      >
        <View>
          <View>
            <Image source={{uri:ImageUri}} style={Styles.itemImg} />
          </View>
          <Text style={Styles.itemPrice}>{item.descs}</Text>
          <Text style={Styles.itemLocation}>{item.subject}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderItemPromo(item) {
    return (
      <TouchableOpacity
        style={Styles.item}
        underlayColor="transparent"
        onPress={() => Actions.NewsAndPromoDetail({ items: item })}
      >
        <View>
          <View>
            <Image source={{ uri: item.picture }} style={Styles.itemImg} />
          </View>
          <Text style={Styles.itemPrice}>{item.descs}</Text>
          <Text style={Styles.itemLocation}>{item.subject}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  
  btnLogoutClick = () => {
    // const mac = await DeviceInfo.getMACAddress().then((mac) => {
    //   return mac;
    // });
    // const formData = {
    //   email: this.state.email,
    //   password: this.state.password,
    //   token: "",
    //   token_firebase: "",
    //   device: Platform.OS,
    //   mac: mac,
    //   app : "M"
    // };
    // var lengthPass = this.state.password.length;
    // if (lengthPass < 4) {
    //   alert("Wrong password !!!");
    // } else {
    //   this.setState({ isLogin: true }, () => {
    //     this.doLogin(formData);
    //   });
    // }
  };

  render() {
    // const example1 = this.mainExample(1, "");
    // const example2 = this.momentumExample(2, 'Momentum | Left-aligned | Active animation');
    // const example3 = this.layoutExample(3, '"Stack of cards" layout | Loop', 'stack');
    // const example4 = this.layoutExample(4, '"Tinder-like" layout | Loop', 'tinder');
    // const example5 = this.customExample(5, 'Custom animation 1', 1, this._renderItem);
    // const example6 = this.customExample(6, 'Custom animation 2', 2, this._renderLightItem);
    // const example7 = this.customExample(7, 'Custom animation 3', 3, this._renderDarkItem);
    // const example8 = this.customExample(8, 'Custom animation 4', 4, this._renderLightItem);

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={"rgba(0, 0, 0, 0.3)"}
          barStyle={"light-content"}
        />
        {/* {this.gradient} */}
        <View>
        <Text style={styles.title}>Engineering</Text>
        <Text style={styles.subtitle}>{`This is what you need!`}</Text>
        <Text>{"\n"}</Text>
        </View>
        <TouchableOpacity style={Styles.download} onPress={()=>Actions.MeterReading()}>
               <Image 
                style={Styles.icondonwload} 
                source={require('@Asset/images/walktrough/meterreading.png')}/>
                  <Text style={Styles.sHeader}>Meter Reading</Text>
                  {/* {this.state.showProgress ? 
                  <ProgressBarAndroid styleAttr="Horizontal"  progress={this.state.progress} indeterminate={this.state.indeterminate} width={200} />
                  :
                  null
                  } */}
        </TouchableOpacity>
        <View style={Styles.menu}>
            <TouchableOpacity style={Styles.reading} onPress={()=>Actions.CustomerService()}>
                  <Image 
                    style={Styles.iconreading} 
                    source={require('@Asset/images/walktrough/cs.png')}/>
                      <Text style={Styles.sHeader}>Customer Service</Text>
                      {/* {this.state.showProgress ? 
                      <ProgressBarAndroid styleAttr="Horizontal"  progress={this.state.progress} indeterminate={this.state.indeterminate} width={200} />
                      :
                      null
                      } */}
            </TouchableOpacity>
            <TouchableOpacity style={Styles.reading} onPress={()=>Actions.Feed()}>
                  <Image 
                    style={Styles.iconreading} 
                    source={require('@Asset/images/walktrough/maintenance.png')}/>
                      <Text style={Styles.sHeader}>Maintenance Asset</Text>
                      {/* {this.state.showProgress ? 
                      <ProgressBarAndroid styleAttr="Horizontal"  progress={this.state.progress} indeterminate={this.state.indeterminate} width={200} />
                      :
                      null
                      } */}
            </TouchableOpacity>

        </View>
              {/* <View style={Styles.sectionTransparent}>
                <View style={Styles.headerBg}>
                  <Text style={Styles.sTitleWhite}>{"News".toUpperCase()}</Text>
                  <Right>
                    <Button
                      small
                      rounded
                      style={Styles.sBtn}
                      onPress={() => Actions.Feed()}
                    >
                      <Text style={Styles.sLink}>See All</Text>
                    </Button>
                  </Right>
                </View>
                <FlatList
                  data={this.state.dataNews}
                  contentContainerStyle={Styles.flatList}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  renderItem={({ item }) => this.renderItemNews(item)}
                />
              </View> */}
              {/* <View style={Styles.sectionTransparent}>
                <TouchableOpacity
                    style={Styles.item}
                    underlayColor="transparent"
                    onPress={()=>Actions.NewsAndPromoDetail({items : item})}>
                    <View>
                      <View>
                        <Image
                          source={{ uri: 'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg' }}
                          style={Styles.itemImg}
                        />
                      </View>
                      <Text style={Styles.itemPrice}>rts</Text>
                      <Text style={Styles.itemLocation}>ess</Text>
                      
                    </View>
                  </TouchableOpacity>
              </View> */}

              {/* <View style={{ marginTop: 40, paddingHorizontal: 20, paddingBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '500' }}>
                    Introducing Ifca SPlus
                </Text>
                <Text style={{ fontWeight: '100', marginTop: 10 }}>
                    A new selection of homes verified for quality & comfort
                </Text>
                <View style={{ width: width - 40, height: 200, marginTop: 20 }}>
                  <Image
                    style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 5, borderWidth: 1, borderColor: '#dddddd' }}
                    source={require('../Images/home.jpg')} />
                </View>
              </View> */}
          
      </View>
    );
  }
}
