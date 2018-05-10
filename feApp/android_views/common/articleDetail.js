/**
 * Created by linGo on 2018/2/6.
 */

// 文章详情页面

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight,
  Image
} from 'react-native';

import { StackNavigator } from 'react-navigation';

const ip = require('./config').ip


class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleId: this.props.navigation.state.params.articleId,
      url: null,
      flag: false
    }
    // this.props.screenProps.tabBar.hide()
    var time1 = Date.now();
    fetch(ip + '/article/articleHTML?id=' + this.state.articleId)
      .then(res => res.text())
      .then( html => {
        this.setState({url: html, flag: true})
        var time2 = Date.now();
        console.log('请求html花费的时间为:'+ (time2-time1))
      })
  }


  componentWillUnmount(){
    // BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid);
    // this.props.screenProps.tabBar.show()

  }

  componentWillMount(){
  }


  componentDidMount() {

  }

  handleMessage(a) {
    var user = JSON.parse(a.nativeEvent.data)
    console.log(this.props.navigation)
    this.props.navigation.navigate('UserProfile',{userId: user.id})
  }

  _goToComment(){
    this.props.navigation.navigate('ArticleComment', {'articleId': this.state.articleId})
  }

  render() {
    return (
        this.state.flag?
        <View style={{flex: 1, position: 'relative'}}>
          <WebView
            ref={webview => { this.webview = webview; }}
            // source = {require('../views/article/articleTem.html')}
            source ={{html: this.state.url,baseUrl: ''}}
            onMessage = {this.handleMessage.bind(this)}
            style={{
              flex: 1
            }}
          />
          <TouchableHighlight
            style={styles.commentBtn}
            onPress={this._goToComment.bind(this)}
          >
            <Text style={{color: 'white'}}>
              评论
            </Text>
          </TouchableHighlight>
        </View>
        :
        <View style={{
          flex: 1,
          // backgroundColor: 'rgba(0,0,0, .8)',
          justifyContent:'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0, bottom: 0, right: 0, left: 0,
          zIndex: 100
        }}>
          <Image
            source={require('../../resource/image/loading.gif')}
            style={{width: 50, height: 50}}
          />
        </View>
    )
  }
}
var Dimensions = require('Dimensions');
const styles = StyleSheet.create({
  commentBtn: {
    backgroundColor: '#1d82fe',
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  }
})

export default ArticleDetail;
