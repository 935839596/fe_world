/**
 * Created by linGo on 2018/3/9.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated
} from 'react-native';

import ArticleList from '../base/articleList'

const ip = require('../common/config').ip;

class LoveArticle extends Component{
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title
  });

  constructor(props){
    super(props)
    this.state = {
      articleList: [],

      userId: this.props.navigation.state.params.userId,

      url: ip + '/common/love_articles' + '?id=' + this.props.navigation.state.params.userId,
      last_date: undefined,
      articleList: [],
      more: true,

      moreVisible: true,
      fadeAnim: new Animated.Value(1),          // 透明度初始值设为0
    }

    this.refresh()

  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:LoveArticle`, this.refresh.bind(this))
  }

  refresh(){
    var website = this.state.url
    fetch(website, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( res => res.json())
      .then( data => {
        console.log('loading loveARticle', data)
        if(data.ret === 0){
          this.setState({
            articleList: data.data.list,
            last_date: data.data.last_date,
            more: data.data.more,
            loading: false
          })
        }else{
          this.setState({
            loading: false
          })
          Alert.alert(
            '警告',
            '加载失败，请重试',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '刷新', onPress: ()=>{
                this.refresh();
              }}
            ],
            { cancelable: false }
          )
        }

      })
  }

  _loadMoreData() {
    if(this.state.loading){
      return;
    }
    var website = this.state.url + '&last_date=' + this.state.last_date
    console.log(website)
    if(!this.state.more){
      console.log('no more article!!')
      this.setState({
        moreVisible: false
      })
      Animated.timing(                            // 随时间变化而执行的动画类型
        this.state.fadeAnim,                      // 动画中的变量值
        {
          toValue: 0,                             // 透明度最终变为1，即完全不透明
          duration: 3000
        }
      ).start(()=>{
        this.setState({
          moreVisible: true
        })
      });
      return;
    }
    this.setState({
      loading: true
    })
    fetch(website, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( res => res.json())
      .then( data => {
        this.setState({
          articleList: this.state.articleList.concat(data.data.list),
          last_date: data.data.last_date,
          more: data.data.more,
          loading: false
        })
      })
  }

  render(){
    return(
      <View
        style={{flex: 1}}
      >
        <ArticleList
          articleList = {this.state.articleList}
          loadMoreData={this._loadMoreData.bind(this)}
          navigation = {this.props.navigation}
          refresh = {this.refresh.bind(this)}/>
        <Animated.View
          style={[{
            height: 44,
            backgroundColor: '#388bec',
            width: 150,
            alignSelf: 'center',
            borderRadius: 5,
            position: 'absolute',
            bottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            opacity: this.state.fadeAnim
          },!this.state.moreVisible?{height: 30}:{height: 0}]}
        >
          <Text style={{color: 'white', fontSize: 15}}>暂无更多</Text>
        </Animated.View>
      </View>
    )
  }
}

export default LoveArticle