/**
 * Created by linGo on 2018/3/9.
 */

//评论发言界面
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight,
  Image,
  TextInput,
  Alert,
  TouchableOpacity
} from 'react-native';

const  ip = require('../common/config').ip

import Icon from 'react-native-vector-icons/FontAwesome';
import CommentList from '../base/commentList'

class DiscussionComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      discussionId: this.props.navigation.state.params.discussionId,
      meta: '',
      commentList: [],

      sendInfo: {
        discussionId: this.props.navigation.state.params.discussionId
      },

      //发送框中的信息
      content: '',
      sending: false,
      sendable: false,

      following: false,

      flag: false,
      self: false,
      discussion: {}

    }
    this._refresh()
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:DiscussionComment`, this._refresh.bind(this))
  }

  //获取评论详情
  _refresh() {
    console.log('get detail')
    fetch(ip + '/discussion/discussion_detail?id=' + this.state.discussionId)
      .then(res => res.json())
      .then( data => {
        console.log('detail', data)
        if(data.ret == 0)
          this.setState({
              discussion: data.data,
              following: data.data.following,
              self: data.data.self,
              flag: true
            })
      })
    this._getComment()
  }

  _follow(){
    var url = ip + (this.state.following? '/common/move_follow_user' : '/common/add_follow_user') + '?id=' + this.state.discussion.author._id;

    fetch(url)
      .then( res => res.json())
      .then( data => {
        console.log(data)
        if(data.ret===0){
          this.setState({
            following: !this.state.following,
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

  //获取自我介绍
  _getMeta(){
    var company = this.state.discussion.author.company,
      intro = this.state.discussion.author.intro;
    var result = '' ;
    if(intro){
      result += intro;
      result = company?result+' @ '+company : result
    }else{
      result = company?company: ''
    }
    return result?result+' - ' : ''
  }

  //获取评论
  _getComment(){
    fetch(ip + '/discussion/all_comment?id=' + this.state.discussionId)
      .then(res => res.json())
      .then( data => {
        if(data.ret == 0){
          this.setState({
            commentList: data.data.list
          })
        }
      })
  }

  _formateTime() {
    var date = new Date(parseInt(this.state.discussion.buildTime))
    return this._formateTwo((date.getMonth()+1)) + '-' +
      this._formateTwo(date.getDate()) + ' '+
      this._formateTwo(date.getHours()) + ':'+
      this._formateTwo(date.getMinutes())
  }

  _formateTwo(num){
    return num<10?'0'+num:num
  }

  _send(){

    if(this.state.sending || !this.state.sendable) return;

    //发送
    this.setState({
      sending: true
    })

    fetch(ip + '/discussion/write_comment', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 0,
        content: this.state.content,
        discussionId: this.state.sendInfo.discussionId,
        toCommentId: this.state.sendInfo.toCommentId,
        toSecCommentId: this.state.sendInfo.toSecCommentId,
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.ret === 0){
          this.setState({
            sending: false,
            sendable: false,
            content: ''
          })
          this._getComment()
        }else if(data.ret == -1){
          this.setState({
            sending: false
          })
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

  render() {
    return (
      <View style={{flex: 1}}>
        {
          this.state.flag == true?
            <View style = {styles.wrapper}>
              <View style = {styles.discussionItem}>
                <View style = {styles.top}>
                  <TouchableOpacity style = {styles.left}
                                    onPress= {() => {
                                      this.props.navigation.navigate('UserProfile',{userId: this.state.discussion.author._id})
                                    }}>
                    <Image
                      source= {
                        this.state.discussion.author.avatarLarge?
                          {uri: this.state.discussion.author.avatarLarge}
                          :
                          require('../../resource/image/mying.png')
                      }
                      style = {styles.userProtrait}
                    />
                  </TouchableOpacity>
                  <View style = {styles.right}>
                    <Text style = {styles.username}>{this.state.discussion.author.username}</Text>
                    <Text style = {styles.meta}>
                      {this._getMeta() + this._formateTime()}
                    </Text>
                  </View>
                  {
                    !this.state.self?
                      this.state.following ?
                        <Text
                          style = {styles.following}
                          onPress={this._follow.bind(this)}
                        >
                          <Icon
                            name="check"
                            color="#4f91d0"
                            size={12}
                          />
                          已关注
                        </Text>
                        :
                        <Text
                          style = {styles.notFollow}
                          onPress={this._follow.bind(this)}
                        >
                          <Icon
                            name="plus"
                            color="#4f91d0"
                            size={12}
                          />
                          关注
                        </Text>
                      :
                      <Text></Text>
                  }
                </View>
                <View style = {styles.contentWrapper}>
                  <Text style = {styles.discussionContent}>
                    {this.state.discussion.content}
                  </Text>
                  {
                    this.state.discussion.imageCache.length <= 0  ?
                      <Text></Text>
                      :
                      <Image
                        source= {{uri: this.state.discussion.imageCache[0]}}
                        style = {styles.contentImage}
                      />
                  }
                </View>
              </View>
              <CommentList
                navigation = {this.props.navigation}
                commentList = {this.state.commentList}
                articleId = {this.state.articleId}
                // refresh = {this._getComment.bind(this)}
                discussionId = {this.state.discussionId}
              />
              <View style={styles.commentView}>
                <TextInput
                  placeholder = '发表评论'
                  multiline = {false}
                  defaultValue = {this.state.content}
                  underlineColorAndroid= 'transparent'
                  style={styles.textInput}
                  onChangeText = {(text) => {
                    this.setState({
                      content: text
                    })
                    if(!text){
                      this.setState({
                        sendable: false
                      })
                    }else{
                      this.setState({
                        sendable: true
                      })
                    }
                  }}
                />
                <Text
                  style = {[styles.sendBtn, {color: (this.state.sendable && !this.state.sending)?'blue' : 'grey'}]}
                  onPress = {this._send.bind(this)}
                >
                  {this.state.sending? '发送中...':'发送'}
                </Text>
              </View>
            </View>
            :
            <Text style={{alignSelf: 'center'}}>loading...</Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    position: 'relative',
    flex: 1,
    paddingBottom: 35,
  },



  discussionItem: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 10,
    borderBottomColor: '#ecf2f5',
    padding: 10
  },
  top: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  left: {
    width:40,
    position: 'relative'
  },
  userProtrait: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    resizeMode:'cover',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0
  },

  right: {
    flex: 1,
    paddingRight: 15
  },
  username: {
    color: '#1d4266'
  },
  meta: {
    fontSize: 10,
    color: '#8d949e'
  },
  following: {
    position: 'absolute',
    right: 5,
    borderColor: '#4f91d0',
    backgroundColor: 'white',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'#4f91d0',
    textAlign: 'center',
    fontSize: 12,
  },
  notFollow: {
    position: 'absolute',
    right: 5,
    borderColor: '#4f91d0',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'#4f91d0',
    textAlign: 'center',
    fontSize: 12
  },

  contentWrapper: {
    marginTop: 5,
    overflow: 'hidden',
    paddingLeft: 20,
    paddingRight: 20,
  },
  discussionContent: {
    color: 'black'
  },
  contentImage: {
    marginTop: 8,
    marginBottom: 8,
    width: 250,
    height: 120,
    borderColor: 'black',
    resizeMode: 'cover',
    backgroundColor: 'green',
  },

  commentView: {
    width: 350,
    alignSelf: 'center',
    position: 'relative',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    position: 'absolute',
    bottom: 5,
    backgroundColor: 'white'
  },
  textInput: {
    flex: 1
  },
  sendBtn: {
    width: 40
  }

})

export default DiscussionComment