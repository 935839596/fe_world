/**
 * Created by linGo on 2018/2/26.
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
import { StackNavigator } from 'react-navigation';

import Edit from './edit'
import Login from '../common/login'

class My extends Component {
  constructor(props) {
    super(props)
    // this.props.screenProps.tabBar.hide()
    this.state = {}
  }

  _showFolloees() {
    console.log(123555)
    //过去需要参数，是关注的人还是粉丝，还有好看的用户id
    this.props.navigation.navigate('UserList')
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
                <Text
                  style= {style.textItem1}
                  onPress={()=>{this.props.navigation.navigate('Login')}}
                >往下邀约熊</Text>
                <Text style= {style.textItem2}>写代码的 @ ad sad </Text>
              </View>
            </View>
            <Text
              style = {style.editBtn}
              onPress={()=>this.props.navigation.navigate('Edit')}
            >
              编辑
            </Text>
          </View>
        </View>


        <View style= {style.itemWrapper}>
          <View style= {style.item}>
            <TouchableHighlight style = {style.touch}>
              <Text
                style = {style.itemText}
              >
                <Icon
                  name = 'users'
                  color = '#0f7fba'
                />
                我关注的人
              </Text>
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
          <View style= {style.item}>
            <TouchableHighlight style = {style.touch}>
              <Text
                style = {style.itemText}
              >
                <Icon
                  name = 'users'
                  color = '#0f7fba'
                />
                关注我的人
              </Text>
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

        <View style= {style.itemWrapper}>
          <View style= {style.item}>
            <TouchableHighlight style = {style.touch}>
              <Text
                style = {style.itemText}
              >
                <Icon
                  name = 'bell'
                  color = 'red'
                  iconStyle = {{marginRight: 15}}
                />
                动态
              </Text>
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
              <Text
                style = {style.itemText}
              >
                <Icon
                  name = 'list'
                  color = 'blue'
                  iconStyle = {{marginRight: 15}}
                />
                原创文章
              </Text>
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
              <Text
                style = {style.itemText}
              >
                <Icon
                  name = 'list'
                  color = 'blue'
                />
                喜欢的文章
              </Text>
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
              <Text
                style = {style.itemText}
              >
                <Icon
                  name = 'tag'
                  color = '#fabe3b'
                  style = {style.iconStyle}
                  size={ 15 }
                />
                关注的标签
              </Text>
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
    flexDirection: 'row',
    position: 'relative'
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
  },
  textItem2: {
    fontSize: 15,
    color: 'black',
  },
  editBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderColor: '#4f91d0',
    borderWidth: 1,
    color: '#4f91d0',
    fontSize: 12,
    width: 60,
    height: 23,
    lineHeight: 23,
    textAlign: 'center',
    borderRadius: 1
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
  },
  itemText: {
    color: 'black'
  },
  iconStyle: {
    width: 20,
    textAlign: 'center',
    height: itemHeight,
    lineHeight: itemHeight,
    marginRight: 100
  }

})

var headerStyle = {
    fontSize: 18,
    height: 30,
    lineHeight: 30,
    fontWeight: 0,
    textAlign: 'center',
    justifyItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgb(233, 233, 239)'
  },
  headerTitleStyle= {
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 0,
    alignSelf: 'center'
  }

export default StackNavigator(
  {
    My: {
      screen: My,
      navigationOptions: {
        // tabBarVisible: false,
        headerTitle: '个人主页',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    Edit: {
      screen: Edit,
      navigationOptions: {
        headerTitle: '修改资料',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        headerTitle: '登录',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle

      }
    }

  },
  {
    initialRouteName: 'My'
  }
)