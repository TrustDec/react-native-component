'use strict';

import React,{ Component } from 'react';
import { Image,StyleSheet,Text,TouchableHighlight,PanResponder,View } from 'react-native';
export default class Main extends Component{
  constructor() {
    super();
    _panResponder: {};
    viewLeft: 0;
    viewTop: 0;
    viewStyle: {};
    view: (null : ?{ setNativeProps(props: Object): void });  
  }
  componentWillMount(){
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: ()=> true,
      onStartShouldSetPanResponderCapture: ()=> true,
      onMoveShouldSetPanResponder: ()=> true,
      onMoveShouldSetPanResponderCapture: ()=> true,
      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y}0 现在会被设置为0
         this.startDragView();
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        console.log(gestureState);
        this.viewStyle.style.left = this.viewLeft+gestureState.dx;
        this.viewStyle.style.top = this.viewTop+gestureState.dy;
        this.updateNativeStyle();
      },
      onPanResponderTerminationRequest: ()=> true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        //console.log("onPanResponderRelease");
        this.endDragVies();
        this.viewLeft += gestureState.dx;
        this.viewTop += gestureState.dy;
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        //console.log("onPanResponderTerminate");
        //this.viewStyle.style.left = this.viewLeft + gestureState.dx;
        //this.viewStyle.style.top = this.viewTop + gestureState.dy;
        //this.updateNativeStyle();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        //console.log("onShouldBlockNativeResponder");
        return true;
      },
    });
    this.viewLeft = 20;
    this.viewTop = 20;
    this.viewStyle = {
      style: {
        left:this.viewLeft,
        top:this.viewTop,
        backgroundColor: '#188eee'
      }
    } 
  }
  componentDidMount(){
    this.updateNativeStyle();
  }
  startDragView(){
    this.viewStyle.style.backgroundColor = 'blue';
    this.updateNativeStyle();
  }
  endDragVies(){
    this.viewStyle.style.backgroundColor = 'green';
    this.updateNativeStyle();
  }
  updateNativeStyle(){
    this.view && this.view.setNativeProps(this.viewStyle);
    //console.log(this.view);
  }
  render(){
    return(
      <View style={styles.container}>
        <View ref={view=>this.view=view} {...this._panResponder.panHandlers} style={styles.lanyoView}>
          
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  lanyoView:{
    width:100,
    height:100,
    backgroundColor:'red',
    borderRadius:50,
    position: 'absolute',
    left: 0,
    top: 0,
  }
});
