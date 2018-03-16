/**
 * Created by linGo on 2018/2/6.
 */

// 用户信息页面

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import PicModal from '../base/picModal'


const ip = require('../common/config').ip


class UserProfile extends Component {
  constructor(props) {
    super(props)
    // this.props.screenProps.tabBar.hide()
    this.state = {
      user: {},
      userId: this.props.navigation.state.params.userId,
      following: false,
      flag: false,
      self: false,
      fansCount: 0,

      picModalVisible: false,
      picModalUrl: ''
    }
    this._refresh()
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:UserProfile`, this._refresh.bind(this))
  }

  _refresh(){
    console.log(this.state)
   fetch(ip + '/common/get_user?id=' + this.state.userId)
     .then(res=>res.json())
     .then(data => {
       this.setState({
         user: data.data.user,
         following: data.data.following,
         self: data.data.self,
         flag: true,
         fansCount: data.data.user.followers.length
       })
     })
  }

  _showFollowees() {
    //过去需要参数，是关注的人还是粉丝，还有好看的用户id
    this.props.navigation.navigate('UserList', {url: ip + '/common/followees', userId: this.state.user._id, title: '他的关注'})
  }

  _showFollowers() {
    console.log('fans')
    this.props.navigation.navigate('UserList', {url: ip + '/common/followers', userId: this.state.user._id, title: '他的粉丝'})
  }

  _getMeta(){
    var company = this.state.user.company,
      intro = this.state.user.intro;
    var result ='' ;
    if(intro){
      result += intro;
      result = company?result+' @ '+company : result
    }else{
      result = company?company: ''
    }
    return result
  }

  _follow(){
    console.log('follow')

    var url = ip + (this.state.following? '/common/move_follow_user' : '/common/add_follow_user') + '?id=' + this.state.user._id,
      inc = this.state.following? -1 : 1

    fetch(url)
      .then( res => res.json())
      .then( data => {
        console.log(123)
        if(data.ret===0){
          this.setState({
            following: !this.state.following,
            fansCount: this.state.fansCount + inc
          })
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登录', onPress: ()=>{this.props.navigation.navigate('Login')}}
            ],
            { cancelable: false }
          )
        }
      })

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

  render() {
    return (
      <View style={{flex: 1}}>
        {
          this.state.flag == true?
            <View style={style.wrapper}>
              <View style= {style.infoWrapper}>
                <View style={style.userInfo}>
                  <TouchableOpacity style= {style.right}
                                    onPress={this.showPicModal.bind(this, this.state.user.avatarLarge)}
                  >
                    <Image
                      source= {
                        this.state.user.avatarLarge?
                          {uri: this.state.user.avatarLarge}:
                          require('../../resource/image/mying.png')
                      }
                      style = {style.userProtrait}
                    />
                  </TouchableOpacity>
                  <View style = {style.left}>
                    <View style= {style.text}>
                      <Text style= {style.textItem1}>{this.state.user.username}</Text>
                      <Text style= {style.textItem2}>{this._getMeta()}</Text>
                    </View>
                  </View>
                </View>
                <View style= {style.operationWrapper}>
                  <Text style= {style.operation}
                        onPress={this._showFollowees.bind(this)}
                  >
                    关注:{this.state.user.followees.length}
                  </Text>
                  <Text style= {style.operation}
                        onPress = {this._showFollowers.bind(this)}
                  >
                    粉丝:{this.state.user.followers.length}
                  </Text>
                  {
                    !this.state.self ?
                      this.state.following ?
                        <Text
                          style = {style.following}
                          onPress={this._follow.bind(this)}
                        >
                          <Icon
                            name="check"
                            color="white"
                            size={12}
                          />
                          已关注
                        </Text>
                        :
                        <Text
                          style = {style.notFollow}
                          onPress={this._follow.bind(this)}
                        >
                          <Icon
                            name="plus"
                            color="green"
                            size={12}
                          />
                          关注
                        </Text>
                      :
                      <Text></Text>
                  }

                </View>
              </View>

              <View style = {style.itemWrapper}>
                <View style= {style.item}>
                  <TouchableOpacity
                    style = {style.touch}
                    onPress={()=>{
                      this.props.navigation.navigate('OriginalArticle',{userId: this.state.user._id, title: '他原创的文章'})
                    }}
                  >
                    <Text>原创文章</Text>
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
                      this.props.navigation.navigate('LoveArticle',{userId: this.state.user._id, title: '他赞过的文章'})
                    }}
                  >
                    <Text>喜欢的文章</Text>
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
                <TouchableOpacity
                  onPress={() => {this.props.navigation.navigate('UserTag',{userId: this.state.userId})}}
                >
                  <View style= {style.item}>
                    <TouchableOpacity style = {style.touch}>
                      <Text>关注的标签</Text>
                    </TouchableOpacity>
                    <Text style = {style.number}
                    >
                    </Text>
                    <Icon
                      name="angle-right"
                      size={20}
                      style={ style.arrow }
                    />
                  </View>
                </TouchableOpacity>
              </View>

            </View>
            :
            <Text style={{alignSelf: 'center'}}>loading...</Text>
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
  },
  textItem2: {
    fontSize: 15,
    color: 'black',
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
  following: {
    position: 'absolute',
    right: 5,
    borderColor: 'green',
    backgroundColor: 'green',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'white',
    textAlign: 'center',
    fontSize: 12
  },
  notFollow: {
    position: 'absolute',
    right: 5,
    borderColor: 'green',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'green',
    textAlign: 'center',
    fontSize: 12
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