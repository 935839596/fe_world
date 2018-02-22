/**
 * Created by linGo on 2018/2/6.
 */

// 用户信息页面

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight,
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class UserProfile extends Component {
  constructor(props) {
    super(props)
    // this.props.screenProps.tabBar.hide()
  }

  render() {
    return (
      <View style={style.wrapper}>
        <View style= {style.infoWrapper}>
          <View style={style.userInfo}>
            <View style= {style.right}>
            <Image
              source= {require('../../resource/image/mying.png')}
              style = {style.userProtrait}
            />
            </View>
            <View style = {style.left}>
              <View style= {style.text}>
                <Text style= {style.textItem1}>往下邀约熊</Text>
                <Text style= {style.textItem2}>写代码的 @ ad sad </Text>
              </View>
            </View>
          </View>
          <View style= {style.operationWrapper}>
              <Text style= {style.operation}>
                关注:152
              </Text>
              <Text style= {style.operation}>
                粉丝:152
              </Text>
              <Text style= {style.focus}>
                <Icon
                  name="plus"
                  color="green"
                  size={12}
                />
                关注
              </Text>
          </View>
        </View>

        <View style= {style.itemWrapper}>
          <View style= {style.item}>
            <TouchableHighlight style = {style.touch}>
              <Text>动态</Text>
            </TouchableHighlight>
            <Text style = {style.number}>
              15
            </Text>
            <Icon
              name="angle-right"
              size={20}
              style={ style.arrow }
            />
          </View>
        </View>

        <View style = {style.itemWrapper}>
          <View style= {style.item}>
            <TouchableHighlight style = {style.touch}>
              <Text>原创文章</Text>
            </TouchableHighlight>
            <Text style = {style.number}>
              155
            </Text>
            <Icon
              name="angle-right"
              size={20}
              style={ style.arrow }
            />
          </View>
          <View style= {style.item}>
            <TouchableHighlight style = {style.touch}>
              <Text>喜欢的文章</Text>
            </TouchableHighlight>
            <Text style = {style.number}>
              155
            </Text>
            <Icon
              name="angle-right"
              size={20}
              style={ style.arrow }
            />
          </View>
        </View>

        <View style= {style.itemWrapper}>
          <View style= {style.item}>
            <TouchableHighlight style = {style.touch}>
              <Text>关注的标签</Text>
            </TouchableHighlight>
            <Text style = {style.number}>
              15
            </Text>
            <Icon
              name="angle-right"
              size={20}
              style={ style.arrow }
            />
          </View>
        </View>

      </View>
    )
  }
}

var itemHeight = 40

const style = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  infoWrapper: {
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 10
  },
  userInfo: {
    height: 100,
    flexDirection: 'row'
  },
  right: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userProtrait: {
    width: 70,
    height: 70,
    overflow: 'hidden',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
    resizeMode:'cover',
    backgroundColor: 'transparent'
  },
  left: {
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    height: 70,
    lineHeight: 35
  },
  textItem1: {
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
    // height: 35,
    // lineHeight: 35
  },
  textItem2: {
    fontSize: 15,
    color: 'black',
    // height: 35,
    // lineHeight: 35
  },
  operationWrapper: {
    height: 30,
    lineHeight: 30,
    position: 'relative',
    flexDirection: 'row'
  },
  operation: {
    fontSize: 15,
    color: 'grey',
    width: 80,
    height: 30,
    lineHeight: 30,
    textAlign: 'center'
  },
  focus: {
    position: 'absolute',
    right: 5,
    borderColor: 'green',
    borderWidth: 1,
    width: 50,
    height: 28,
    lineHeight: 28,
    color:'green',
    textAlign: 'center',
  },

  itemWrapper: {
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 10
  },

  item: {
    position: 'relative',
    justifyContent: 'center',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1
  },
  touch: {
    marginLeft: 10,
    height: itemHeight,
    justifyContent: 'center'
  },
  number: {
    height: itemHeight,
    lineHeight: itemHeight,
    fontSize: 13,
    position: 'absolute',
    right: 18,
    textAlign: 'right'
  },
  arrow: {
    position: 'absolute',
    right: 5,
    height: itemHeight,
    lineHeight: itemHeight
  }

})

export default UserProfile;