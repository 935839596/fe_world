/**
 * Created by linGo on 2018/2/23.
 */

//评论文章界面
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight,
  Image,
  TextInput
} from 'react-native';

const ip = require('./config').ip

import CommentList from '../base/commentList'

class ArticleComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articleId: this.props.navigation.state.params.articleId,
      article: {},
      meta: '',
      commentList: [],


      articleModalVisible: false,
      placeholder: '发表评论',
      sendInfo: {
        articleId: this.props.navigation.state.params.articleId,
      }, //指的是要发送到后台需要的各种信息

      //发送框中的信息
      content: '',
      sending: false,
      sendable: false
    }
    fetch(ip + '/article/article_detail?id=' + this.state.articleId)
      .then(res => res.json())
      .then( data => {
        if(data.ret == 0)
          this.setState({
            article: data.data,
            meta: data.data.meta.likeCount+'人喜欢-'+data.data.author.username+'-'+this._formateTime(data.data.buildTime)
          })
      })


   this._getComment();

  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:ArticleComment`, this._getComment.bind(this))
  }

  _formateTime(timeStamp) {
    timeStamp = Math.floor(timeStamp) * 1000
    var date = new Date(timeStamp)
    return date.getFullYear()+ '年'
      + (date.getMonth()+1) + '月' +
      date.getDate() + '日'
  }

  _send(){
    var content = this.state.content;

    if(this.state.sending || !this.state.sendable) return;

    //发送
    this.setState({
     sending: true
    })

    fetch(ip + '/article/write_comment', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 0,
        content: this.state.content,
        articleId: this.state.sendInfo.articleId,
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
        }
      })
  }

  //获取评论
  _getComment(){
    fetch(ip + '/article/all_comment?id=' + this.state.articleId)
      .then(res => res.json())
      .then( data => {
        console.log('like??',data)
        if(data.ret == 0){
          this.setState({
            commentList: data.data.list
          })
        }
      })
  }

  render() {
    return (
      <View style = {styles.wrapper}>
        <View style = {styles.articleInfo}>
          <Text style = {styles.title}>
            {this.state.article.title}
          </Text>
          <Text style = {styles.meta}>
            {this.state.meta}
          </Text>
        </View>
        <CommentList
          navigation = {this.props.navigation}
          commentList = {this.state.commentList}
          articleId = {this.state.articleId}
          // refresh = {this._getComment.bind(this)}
        />
        <View style={styles.commentView}>
          <TextInput
            placeholder = {this.state.placeholder}
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


  articleInfo: {
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 10,
    padding: 10
  },
  title: {
    fontSize: 15,
    color: '#000000',
    fontWeight: 'bold'
  },
  meta: {
    fontSize: 12,
    height: 20,
    lineHeight: 20,
    color: '#cccccc'
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

export default ArticleComment