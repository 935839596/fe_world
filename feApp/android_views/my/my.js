/**
 * Created by linGo on 2018/2/26.
 */
// 用户信息页面

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';

import Edit from './edit'
import MyTag from './myTag'
import InputScreen from './inputScreen'
import Login from '../common/login'
import Register from '../common/register'
import LoveArticle from '../common/loveArticle'
import OriginalArticle from '../common/originalArticle'
import UserList from '../common/userList'
import UserProfile from '../common/userProfile'
import TagSelect from '../common/tagSelect'
import PicModal from '../base/picModal'


const ip = require('../common/config').ip

class My extends Component {
  constructor(props) {
    super(props)
    // this.props.screenProps.tabBar.hide()
    this.state = {
      user: {},
      flag:false,

      picModalVisible: false,
      picModalUrl: ''
    }

    this._refresh()
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:My`, this._refresh.bind(this))
  }

  closePicModal(){
    console.log('close')
    this.setState({
      picModalVisible: false
    })
  }

  showPicModal(url){
    if(!url){
      url =ip +  '/images/mying.png'
    }
    this.setState({
      picModalVisible: true,
      picModalUrl: url
    })
  }

  _showFollowees() {
    //过去需要参数，是关注的人还是粉丝，还有好看的用户id
    this.props.navigation.navigate('UserList', {url: ip + '/common/followees', userId: this.state.user._id, title: '我的关注'})
  }

  _showFollowers() {
    this.props.navigation.navigate('UserList', {url: ip + '/common/followers', userId: this.state.user._id, title: '我的粉丝'})
  }

  _refresh(){
    var url = ip + '/my/me';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({
          user: data.user,
          flag: true
        })
      })
  }

  _logout(){
    fetch(ip + '/logout')
      .then(res => res.json())
      .then(data => {
        if(data.ret === 0){
          this.props.screenProps.refreshApp();
          this._refresh();
        }else{

        }
      })
  }

  _getMeta(){
    var company = this.state.user.company,
      intro = this.state.user.intro;
    var result = '';
    if(intro){
      result += intro;
      result = company?result+' @ '+company : result
    }else{
      result = company?company: ''
    }
    return result?result : '暂无介绍'
  }

  render() {
    return (
      <View
        style={{backgroundColor: 'white', flex:1}}
      >
        {
          this.state.flag?
            this.state.user?
              <View style={style.wrapper}>
                <View style= {style.infoWrapper}>
                  <View style={style.userInfo}>
                    <TouchableOpacity style= {style.right}
                                      onPress={this.showPicModal.bind(this, this.state.user.avatarLarge)}
                    >
                      <Image
                        source= {
                          this.state.user.avatarLarge?
                            {uri: this.state.user.avatarLarge}
                            :
                            require('../../resource/image/mying.png')
                        }
                        style = {style.userProtrait}
                      />
                    </TouchableOpacity>
                    <View style = {style.left}>
                      <View style= {style.text}>
                        <Text
                          style= {style.textItem1}
                         >{this.state.user.username}</Text>
                        <Text style= {style.textItem2}>{this._getMeta()} </Text>
                      </View>
                    </View>
                    <Text
                      style = {style.editBtn}
                      onPress={()=>this.props.navigation.navigate('Edit', {user: this.state.user})}
                    >
                      编辑
                    </Text>
                  </View>
                </View>


                <View style= {style.itemWrapper}>
                  <View style= {style.item}>
                    <TouchableOpacity
                      style = {style.touch}
                      onPress={this._showFollowees.bind(this)}
                    >
                      <Text
                        style = {style.itemText}
                      >
                        <Icon
                          name = 'users'
                          color = '#0f7fba'
                        />
                        我关注的人
                      </Text>
                    </TouchableOpacity>
                    <Text style = {style.number}>
                      {this.state.user.followees.length}
                    </Text>
                    <Icon
                      name="angle-right"
                      size={20}
                      style={ style.arrow }
                    />
                  </View>
                  <View style= {style.item}>
                    <TouchableOpacity
                      style = {style.touch}
                      onPress={this._showFollowers.bind(this)}
                    >
                      <Text
                        style = {style.itemText}
                      >
                        <Icon
                          name = 'users'
                          color = '#0f7fba'
                        />
                        关注我的人
                      </Text>
                    </TouchableOpacity>
                    <Text style = {style.number}>
                      {this.state.user.followers.length}
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
                    <TouchableOpacity style = {style.touch}>
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
                    </TouchableOpacity>
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
                    <TouchableOpacity
                      style = {style.touch}
                      onPress={()=>{
                        this.props.navigation.navigate('OriginalArticle',{userId: this.state.user._id, title: '我原创的文章'})
                      }}
                    >
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
                    </TouchableOpacity>
                    <Text style = {style.number}>
                      {this.state.user.article.length}
                    </Text>
                    <Icon
                      name="angle-right"
                      size={20}
                      style={ style.arrow }
                    />
                  </View>
                  <View style= {style.item}>
                    <TouchableOpacity
                      style = {style.touch}
                      onPress={()=>{
                        this.props.navigation.navigate('LoveArticle',{userId: this.state.user._id, title: '我赞过的文章'})
                      }}
                    >
                      <Text
                        style = {style.itemText}
                      >
                        <Icon
                          name = 'list'
                          color = 'blue'
                        />
                        喜欢的文章
                      </Text>
                    </TouchableOpacity>
                    <Text style = {style.number}>
                      {this.state.user.loveArticle.length}
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
                    <TouchableOpacity
                      style = {style.touch}
                      onPress={()=>{this.props.navigation.navigate('MyTag', {userId: this.state.user._id})}}
                    >
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
                    </TouchableOpacity>
                    <Text style = {style.number}>
                    </Text>
                    <Icon
                      name="angle-right"
                      size={20}
                      style={ style.arrow }
                    />
                  </View>
                </View>

                <View style={style.itemWrapper}>
                  <View style= {style.item}>
                    <TouchableOpacity style={style.touch}>
                      <Text
                        onPress={this._logout.bind(this)}
                        style={{textAlign: 'center', color: 'red'}}
                      >退出账号</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
              :
              <View style={{flex: 1}}>
                <View style={{
                  height: 120,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderColor: 'grey'
                }}>
                  <Image
                    source= {require('../../resource/image/my.png')}
                    style = {style.userProtrait}
                  />
                </View>
                <View style={{backgroundColor: 'white', flex: 1}}>
                  <Text style={{
                    color: 'grey',
                    fontSize: 12,
                    textAlign: 'center',
                    height: 30,
                    lineHeight: 15,
                    width: 180,
                    alignSelf: 'center',
                    marginTop: 80
                  }}>
                    登录后，可以进行点赞、评论、关注用户
                  </Text>
                  <View style={{
                    justifyContent: 'center',
                    alignItem: 'center',
                    flexDirection: 'row'
                  }}>
                    <Text
                      style={style.loginBtn}
                      onPress={()=>{this.props.navigation.navigate('Register')}}
                    >
                      注册
                    </Text>
                    <Text
                      style={style.loginBtn}
                      onPress={()=>{this.props.navigation.navigate('Login')}}
                    >
                      登录
                    </Text>
                  </View>
                </View>

              </View>
            :
            <Text
              style={{backgroundColor: 'white', flex: 1, alignSelf: 'center',height: 50,lineHeight: 50}}
            >loading...</Text>

        }
        <PicModal
          modalVisible={this.state.picModalVisible}
          url = {this.state.picModalUrl}
          closePicModal={this.closePicModal.bind(this)}
        />
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

  loginBtn:{
    borderColor: '#4f91d0',
    borderWidth: 1,
    color: '#4f91d0',
    fontSize: 15,
    width: 70,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    borderRadius: 1,
    marginLeft: 10,
    marginTop: 5
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
    height: 50,
    lineHeight: 50,
    fontWeight: 0,
    textAlign: 'center',
    // justifyItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgb(233, 233, 239)',
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  headerTitleStyle= {
    textAlign: 'center',
    fontSize: 18,
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
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        headerTitle: '个人资料',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    LoveArticle: {
      screen: LoveArticle,
      navigationOptions: {
        // headerTitle: '个人资料',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    OriginalArticle: {
      screen: OriginalArticle,
      navigationOptions: {
        headerTitle: '个人资料',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    UserList: {
      screen: UserList,
      navigationOptions: {
        // headerTitle: `${this.props.navigation.state.params.title}`,
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
    },
    Register: {
      screen: Register,
      navigationOptions: {
        headerTitle: '注册',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle

      }
    },
    InputScreen: {
      screen: InputScreen,
      navigationOptions: {
        header: null,
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    MyTag: {
      screen: MyTag,
      navigationOptions: {
        headerTitle: '我的标签',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    TagSelect: {
      screen: TagSelect,
      navigationOptions: {
        header: null,
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    }

  },
  {
    initialRouteName: 'My'
  }
)