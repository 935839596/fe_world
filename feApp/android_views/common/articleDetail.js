/**
 * Created by linGo on 2018/2/6.
 */

// 文章详情页面

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import { StackNavigator } from 'react-navigation';

const ip = 'http://192.168.1.103:3000'


class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleId: this.props.navigation.state.params.articleId,
      url: null,
      navigation: this.props.navigation
    }
    // this.props.screenProps.tabBar.hide()
    fetch(ip + '/article/articleHTML?id=' + this.state.articleId)
      .then(res => res.text())
      .then( html => {
        this.setState({url: html})
      })
  }


  componentWillUnmount(){
    // BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid);
    // this.props.screenProps.tabBar.show()

  }

  componentWillMount(){
  }


  componentDidMount() {
    console.log(this.webview)
    this.webview.postMessage(152)
  }

  handleMessage(a) {
    var user = JSON.parse(a.nativeEvent.data)
    console.log(this.props.navigation)
    this.props.navigation.navigate('UserProfile')
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <WebView
          ref={webview => { this.webview = webview; }}
          // source = {require('../views/article/articleTem.html')}
          source ={{html: this.state.url,baseUrl: ''}}
          onMessage = {this.handleMessage.bind(this)}
          style={{
            flex: 1
          }}
        />
      </View>
    )
  }
}
var Dimensions = require('Dimensions');
/*const styles = StyleSheet.create({
  detail: {
    'zIndex': 100000000,
    'backgroundColor': 'red',
    'elevation': 1000000000,
    'height': Dimensions.get('window').height  + 50000,
    'width': Dimensions.get('window').width,
    overflow: 'scroll'


  }
})*/

export default ArticleDetail;
