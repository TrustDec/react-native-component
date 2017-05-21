'use strict';
import React,{ Component } from 'react';
import ReactNative from 'react-native';
import Util from './util';
const {Image,StyleSheet,LayoutAnimation,Text,TouchableHighlight,PanResponder,View} = ReactNative;
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
export default class Main extends Component {
  constructor() {
    super();
    this._width = Util.size.width/4;
    this.topIndex = 0;
    this.leftIndex = 0;
    this.index = 0;
    this.prev_left = 0;
    this.prev_top = 0;
    this.finalTopIndex = 0;
    this.finalLeftIndex = 0;
    this.animations = {
      duration: 200,
      create: {
        type: LayoutAnimation.Types.linear,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        springDamping: 0.7,
      },
    };
    this.state={
      selected: 14,
      days:viewbox
    }
  }
  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx!==0;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (event, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        const {pageX,pageY} = evt.nativeEvent;
        this.topIndex = Math.floor((pageY-30)/this._width);
        this.leftIndex = Math.floor((pageX)/this._width);
        this.index = this.topIndex*4 + this.leftIndex;
        this.prev_left = this._width * this.leftIndex;
        this.prev_top = this._width * this.topIndex;
        this.setState({
          selected:this.index
        });
        let box = this.refs["box" + this.index];
        box.setNativeProps({
          style:{
            opacity:0.7,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 5,
            shadowOffset: {
              height: 0,
              width: 2
            }
          }
        });
      },
      onPanResponderMove:(evt, gestureState)=>{
        this.left = this.prev_left + gestureState.dx;
        this.top =  this.prev_top + gestureState.dy;
        console.log(this.index);
        let box = this.refs["box" + this.index];
          box.setNativeProps({
            style: {top:this.top, left:this.left},
          });
        this.endMove(evt, gestureState);
      },
      onPanResponderRelease: (evt, gestureState) => this._release(evt, gestureState),
      onPanResponderTerminate: (evt, gestureState) => this._release(evt, gestureState),
    });
  }
  endMove(evt, gestureState){
    this.finalTopIndex = Math.floor(this.top / this._width + 0.5);
    this.finalLeftIndex = Math.floor(this.left / this._width + 0.5);
    if ((-1 < this.finalTopIndex) && (this.finalTopIndex <4) && (-1 < this.finalLeftIndex) && this.finalLeftIndex < 4) {
      this.finalIndex = this.finalTopIndex*4 + this.finalLeftIndex;
      let days = this.state.days;
      let movedBox = days[this.index];
      days.splice(this.index, 1);
      days.splice(this.finalIndex, 0, movedBox);
      this.setState({
        days
      });

      if (this.finalIndex != this.index) {
        this.index = this.finalIndex;
        this.setState({
          selected: this.finalIndex,
        });
      }

      LayoutAnimation.configureNext(this.animations);
    }else {
      let box = this.refs["box" + this.index];
      let top = this.topIndex*this._width;
      let left = this.leftIndex*this._width;
      LayoutAnimation.configureNext(this.animations);
    }
  }
  _release(){
    const shadowStyle = {
      opacity:1,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
        width: 0,
      }
    };
    if ((-1 < this.finalTopIndex) && (this.finalTopIndex <4) && (-1 < this.finalLeftIndex) && this.finalLeftIndex < 4) {     
      let box = this.refs["box" + this.finalIndex];
      let top = this.finalTopIndex*this._width;
      let left = this.finalLeftIndex*this._width;
      if (box) {
      box.setNativeProps({
        style: {top,left,...shadowStyle},
      });
        
      }
      LayoutAnimation.configureNext(this.animations);
    } else {
      let box = this.refs["box" + this.index];
      let top = this.topIndex*this._width;
      let left = this.leftIndex*this._width;
      box.setNativeProps({
        style: {top,left,...shadowStyle},
      });
      LayoutAnimation.configureNext(this.animations);
    }
  }
  render(){
    const boxes = this.state.days.map((item,index)=>{
      let top = Math.floor(index/4)*this._width;
      let left = (index%4)*this._width;
      return(
        <View ref={"box"+index}
          key={item.key}
          {...this._panResponder.panHandlers}
          style={[styles.touchBox,{top,left}]}
          underlayColor="#eee"
        >
        <View style={styles.boxContainer}>
          <Text style={styles.boxText}>Day{index+1}</Text>
          {item.isFA? <IconFA size={item.size} name={item.icon} style={[styles.boxIcon,{color:item.color}]}></IconFA>:
              <Icon size={item.size} name={item.icon} style={[styles.boxIcon,{color:item.color}]}></Icon>}
        </View>
        </View>
      );
    });
    let selectedItem = boxes[this.state.selected];
    boxes.splice(this.state.selected, 1);
    boxes.push(selectedItem);
    return(
      <View style={styles.touchBoxContainer}>
        {boxes}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  itemWrapper:{
    backgroundColor: '#f3f3f3'
  },
  touchBox:{
    width: Util.size.width/4,
    height: Util.size.width/4,
    backgroundColor:"#fff",
    position:"absolute",
    left:0,
    top:0,
    borderWidth: Util.pixel,
    borderColor:"#ccc",
  },
  touchBoxContainer:{
    width: Util.size.width,
    marginTop:30,
  },
  boxContainer:{
    alignItems:"center",
    justifyContent:"center",
    width: Util.size.width/4,
    height:Util.size.width/4,
  },
  boxIcon:{
    position:"relative",
    top:-10
  },
  boxText:{
    position:"absolute",
    bottom:15,
    width:Util.size.width/4,
    textAlign:"center",
    left: 0,
    backgroundColor:"transparent"
  },
});
const viewbox = [{
        key: 0,
        title: "A stopwatch",
        isFA: false,
        icon: "ios-stopwatch",
        size: 48,
        color: "#ff856c",
        hideNav: false,
      }, {
        key: 1,
        title: "A weather app",
        isFA: false,
        icon: "ios-partly-sunny",
        size: 60,
        color: "#90bdc1",
        hideNav: true,
      }, {
        key: 2,
        title: "twitter",
        isFA: false,
        icon: "logo-twitter",
        size: 50,
        color: "#2aa2ef",
        hideNav: true,
      }, {
        key: 3,
        title: "cocoapods",
        isFA: true,
        icon: "contao",
        size: 50,
        color: "#FF9A05",
        hideNav: false,
      }, {
        key: 4,
        title: "find my location",
        isFA: false,
        icon: "md-pin",
        size: 50,
        color: "#00D204",
        hideNav: false,
      }, {
        key: 5,
        title: "Spotify",
        isFA: true,
        icon: "spotify",
        size: 50,
        color: "#777",
        hideNav: true,
      }, {
        key: 6,
        title: "Moveable Circle",
        isFA: false,
        icon: "ios-baseball",
        size: 50,
        color: "#5e2a06",
        hideNav: true,
      }, {
        key: 7,
        title: "Swipe Left Menu",
        isFA: true,
        icon: "google",
        size: 50,
        color: "#4285f4",
        hideNav: true,
      }, {
        key: 8,
        title: "Twitter Parallax View",
        isFA: true,
        icon: "twitter-square",
        size: 50,
        color: "#2aa2ef",
        hideNav: true,
      }, {
        key: 9,
        title: "Tumblr Menu",
        isFA: false,
        icon: "logo-tumblr",
        size: 50,
        color: "#37465c",
        hideNav: true,
      }, {
        key: 10,
        title: "OpenGL",
        isFA: false,
        icon: "md-contrast",
        size: 50,
        color: "#2F3600",
        hideNav: false,
      }, {
        key: 11,
        title: "charts",
        isFA: false,
        icon: "ios-stats",
        size: 50,
        color: "#fd8f9d",
        hideNav: false,
      }, {
        key: 12,
        title: "tweet",
        isFA: false,
        icon: "md-chatboxes",
        size: 50,
        color: "#83709d",
        hideNav: true,
      }, {
        key: 13,
        title: "tinder",
        isFA: true,
        icon: "fire",
        size: 50,
        color: "#ff6b6b",
        hideNav: true,
      }, {
        key: 14,
        title: "Time picker",
        isFA: false,
        icon: "ios-calendar-outline",
        size: 50,
        color: "#ec240e",
        hideNav: false,
      }];