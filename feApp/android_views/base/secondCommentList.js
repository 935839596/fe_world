/**
 * Created by linGo on 2018/2/25.
 */

//评论回复列表
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Alert,
  TextInput,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import CommentModal from './commentModal'
import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('../common/config').ip

class SecondCommentItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      secComment: this.props.secComment,
      articleId: this.props.articleId,
      discussionId: this.props.discussionId,

      like: this.props.secComment.like,
      likeCount: this.props.secComment.meta.likeCount,


      //回复的人
      replyToUser: ''
    }
    this._getCommentDetail()

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      like: nextProps.secComment.like,
    })
    console.log(this.state.like)
  }

  _getCommentDetail(){
    var url=''
    if(this.state.articleId){
      url = ip + '/article/comment_detail?id='+this.state.secComment.toSecCommentId
    }else{
      url = ip + '/discussion/comment_detail?id='+this.state.secComment.toSecCommentId
    }
    if(this.state.secComment.type == 2) {
      console.log('in')
      fetch(url)
        .then(res=> res.json())
        .then(data => {
          console.log(data)
          if(data.ret == 0){
            this.setState({
              replyToUser: data.data.author.username
            })
            console.log(this.state.replyToUser)
          }
        })
    }
  }

  _showModal(username, userId) {
    this.props.showModal(username, userId, this.props.articleId, this.state.secComment._id, this.props.discussionId)
  }

  _like(){
    var url;
    if(this.props.articleId){
      url = ip + (this.state.like? '/article/comment_dislike' : '/article/comment_like') + '?id=' + this.state.secComment._id
    }else{
      url = ip + (this.state.like? '/discussion/comment_dislike' : '/discussion/comment_like') + '?id=' + this.state.secComment._id
    }
    var inc = this.state.like?-1:1
    fetch(url)
      .then( res => res.json())
      .then( data => {
        console.log(data)
        if(data.ret===0){
          this.setState({
            like: !this.state.like,
            likeCount: this.state.likeCount + inc
          })
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登录', onPress: ()=>{this.props.navigation.navigate('Login'); this.props.closeModal()}}
            ],
            { cancelable: false }
          )
        }
      })
  }

  _formateTime() {
    var date = new Date(parseInt(this.state.secComment.buildTime))
    return this._formateTwo((date.getMonth()+1)) + '-' +
      this._formateTwo(date.getDate()) + ' '+
      this._formateTwo(date.getHours()) + ':'+
      this._formateTwo(date.getMinutes())
  }

  _formateTwo(num){
    return num<10?'0'+num:num
  }


  render() {
    return (
          <View style = {[styles.commentItem, styles.secondCommentItem]}>
            <View style = {styles.left}>
              <TouchableOpacity
                style={styles.PortraitWrapper}
                onPress= {() => {
                  this.props.navigation.navigate('UserProfile',{userId: this.state.secComment.author._id})
                }}
              >
                <Image
                  source= {
                    this.state.secComment.author.avatarLarge?
                      {uri: this.state.secComment.author.avatarLarge}
                      :
                      require('../../resource/image/mying.png')
                  }style = {styles.userProtrait}
                />
              </TouchableOpacity>
            </View>
            <View style = {styles.right}>
              <View style = {styles.top}>
                <Text style = {styles.username}
                      onPress= {() => {
                        this.props.navigation.navigate('UserProfile',{user: this.state.secComment.author})
                      }}
                >{this.state.secComment.author.username}</Text>
                <View style = {styles.operation}>
                  <Text style = {styles.iconWrapper}
                        onPress = {this._showModal.bind(this, this.state.secComment.author.username, this.state.secComment.author._id)}
                  >
                    <Icon
                      name="comments-o"
                      color="#388bec"
                      size={15}
                      style={ styles.icon }
                    />
                  </Text>
                  <Text style = {styles.iconWrapper}
                        onPress={this._like.bind(this)}
                  >
                    <Icon
                      name={this.state.like?'thumbs-up':'thumbs-o-up'}
                      size={15}
                      color='#388bec'
                      style={ styles.icon }
                    /> {this.state.likeCount}
                  </Text>

                </View>
                <View>
                  <Text style = {[styles.time, {color: '#999', fontSize: 10}]}>
                    {this._formateTime()}
                  </Text>
                </View>
                <Text style = {styles.commentContent}>
                  {
                    this.state.replyToUser? '回复@'+this.state.replyToUser+':  ': ''
                  }
                  {this.state.secComment.content}
                </Text>
              </View>

            </View>
          </View>

    )
  }
}

class SecondCommentList extends Component {
  constructor(props){
    super(props)
    this.state = {
      comment: this.props.navigation.state.params.comment,
      secCommentList: [],

      //评论
      content: '',
      sendable: false,
      sending: false,

      //评论的modal
      modalVisible: false,
      placeholder: '',
      sendInfo: {},

      like: this.props.navigation.state.params.comment.like,
      likeCount: this.props.navigation.state.params.comment.meta.likeCount
    }

    this._getSecComment()
  }


  _send(){
    if(this.state.sending || !this.state.sendable) return;

    //发送
    this.setState({
      sending: true
    })

    var url = '';
    var articleId = this.props.navigation.state.params.articleId;
    if(articleId){
      url = ip + '/article/write_comment'
    }else{
      url = ip + '/discussion/write_comment'
    }

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 1,
        content: this.state.content,
        articleId: this.props.navigation.state.params.articleId,
        discussionId: this.props.navigation.state.params.discussionId,
        toCommentId: this.state.comment._id,
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
          this._getSecComment()
        }else{
          this.setState({
            sending: false,
            sendable: true
          })
        }
      })
  }

  _getSecComment(){
    var artilceId = this.props.navigation.state.params.articleId;
    var url = artilceId ?
                ip + '/article/sec_comment?id='+ this.state.comment._id
              :
                ip + '/discussion/sec_comment?id='+ this.state.comment._id

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if(data.ret === 0){
          this.setState({
            secCommentList: data.data.list
          })
          console.log(this.state.secCommentList)
        }else{

        }
      })
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:SecondCommentList`, this._getSecComment.bind(this))
  }

  _renderItem = ({item}) => (
    <SecondCommentItem
      secComment = {item}
      navigation = {this.props.navigation}
      showModal = {this.showModal.bind(this)}
      articleId = {this.props.navigation.state.params.articleId}
      discussionId = {this.props.navigation.state.params.discussionId}
      closeModal = {this.closeModal.bind(this)}
    />
  )

  showModal(username, userId, articleId, SecCommentId, discussionId) {
    var url = ''
    if(articleId){
      url = ip + '/article/write_comment'
    }else{
      url = ip + '/discussion/write_comment'
    }
    var sendInfo = {
      username: username,
      userId: userId,
      type: 2,
      articleId: articleId,
      discussionId: discussionId,
      toCommentId: this.state.comment._id,
      toSecCommentId: SecCommentId,
      url: url
    }
    this.setState({
      modalVisible: true,
      placeholder: '回复@'+username,
      sendInfo: sendInfo
    })
  }

  _like(){
    var url;
    if(this.props.navigation.state.params.articleId){
      url = ip + (this.state.like? '/article/comment_dislike' : '/article/comment_like') + '?id=' + this.state.comment._id
    }else{
      url = ip + (this.state.like? '/discussion/comment_dislike' : '/discussion/comment_like') + '?id=' + this.state.comment._id
    }
    var inc = this.state.like?-1:1
    fetch(url)
      .then( res => res.json())
      .then( data => {
        console.log(data)
        if(data.ret===0){
          Alert.alert(
            '提示',
            data.message,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
          this.setState({
            like: !this.state.like,
            likeCount: this.state.likeCount + inc
          })
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登陆', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }
      })
  }

  closeModal(){
    this.setState({
      modalVisible: false
    })
    this._getSecComment()
  }

  _formateTime() {
    var date = new Date(parseInt(this.state.comment.buildTime))
    return this._formateTwo((date.getMonth()+1)) + '-' +
      this._formateTwo(date.getDate()) + ' '+
      this._formateTwo(date.getHours()) + ':'+
      this._formateTwo(date.getMinutes())
  }

  _formateTwo(num){
    return num<10?'0'+num:num
  }

  _keyExtractor = (item, index) => item._id;

  render() {
    return (
      <View
         style = {{paddingBottom: 40, flex: 1}}
      >
        <View style = {styles.commentItem}>
          <View style = {styles.left}>
            <TouchableOpacity
              style={styles.PortraitWrapper}
              onPress= {() => {
                this.props.navigation.navigate('UserProfile',{userId: this.state.comment.author._id})
              }}
            >
              <Image
                source= {
                  this.state.comment.author.avatarLarge?
                    {uri: this.state.comment.author.avatarLarge}
                    :
                    require('../../resource/image/mying.png')
                }
                style = {styles.userProtrait}
              />
            </TouchableOpacity>
          </View>
          <View style = {styles.right}>
            <View style = {styles.top}>
              <Text style = {styles.username}
                    onPress= {() => {
                      this.props.navigation.navigate('UserProfile',{userId: this.state.comment.author._id})
                    }}
              >{this.state.comment.author.username}</Text>
              <Text style = {styles.commentContent}>
                {this.state.comment.content}
              </Text>
            </View>
            <View style = {styles. bottom}>
              <View>
                <Text style = {styles.time}>{this._formateTime()}</Text>
              </View>

            </View>
          </View>
        </View>

        {
          this.state.secCommentList.length>0?
            <FlatList
              data = {this.state.secCommentList}
              renderItem = {this._renderItem}
              style = {{flex: 1, marginBottom: 5}}
              keyExtractor={this._keyExtractor}
            />
            :
            <Text
              style = {{color: 'white',flex: 1, textAlign: 'center', marginTop: 15}}
            >
              ------ 暂无回复 ------
            </Text>

        }

        <View style={styles.commentView}>
          <TextInput
            placeholder = '回复...'
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

        <CommentModal
          modalVisible= {this.state.modalVisible}
          placeholder = {this.state.placeholder}
          sendInfo = {this.state.sendInfo}
          navigation = {this.props.navigation}
          closeModal = {this.closeModal.bind(this)}
        />
      </View>
    )
  }



}

const styles = StyleSheet.create({
  commentItem: {
    paddingTop: 10,
    paddingLeft: 5,
    flexDirection: 'row',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 10,
    backgroundColor: '#ffffff'
  },
  secondCommentItem: {
    marginLeft: 10,
    borderBottomWidth: 1,
    backgroundColor: '#fce1e0',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },

  left: {
    width: 30,
    position: 'relative'
  },
  PortraitWrapper:{
    width: 25,
    height: 25
  },
  userProtrait: {
    width: 25,
    height: 25,
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
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    paddingRight: 15
  },
  top: {
    position: 'relative'
  },
  username: {
    fontSize: 12
  },
  commentContent: {
    fontSize: 12,
    color: 'black'
  },
  bottom: {
    position: 'relative',
    marginBottom: 5
  },
  time: {
    fontSize: 11,
    color: '#cccccc'
  },
  operation: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconWrapper: {
    width: 35
  },
  icon: {

  },


  //二级评论专用
  secondLike: {
    position: 'absolute',
    right: 10,
    top: 0,
    fontSize: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
    height: 35,
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

export default SecondCommentList