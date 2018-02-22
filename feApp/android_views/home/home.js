/**
 * Created by linGo on 2018/2/6.
 */
// 首页

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import ArticleList from '../base/articleList'
import ArticleDetail from '../common/articleDetail'
import UserProfile from '../common/userProfile'

const ip = 'http://192.168.1.103:3000'

 class Home extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {
      choose: 0,
      url: ip + '/article/all_articles',
      last_date: undefined,
      articleList: [],
      more: true
    }
    var website = this.state.url
    fetch(website, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( res => res.json())
      .then( data => {
        console.log('test', data.data)
        this.setState({
          articleList: data.data.list,
          last_date: data.data.last_date,
          more: data.data.more,
          loading: false
        })
      })

    console.log('constructor')
  }

  _loadData(type){
    if(type == 0){
      //推荐文章
      this.setState({
        choose: 0
      })
    }else if(type == 1){
      //全部文章
      this.setState({
        choose: 1
      })
    }
  }

  _loadMoreData() {
    if(this.state.loading){
      return;
    }
    var website = this.state.url + '?last_date=' + this.state.last_date
    console.log(website)
    if(!this.state.more){
      console.log('no more article!!')
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

  componentWillMount(){
    // this.props.screenProps.tabBar.show()
    console.log('will mount')
  }
   componentWillUnmount(){
    console.log(123)
   }

   componentDidMount() {
     console.log('did mount')
   }

  render() {
    var _this = this;

    //点击修改样式
    function choose(index){
      if(_this.state.choose === index){
        return {
          color: 'blue',
          borderBottomColor: 'blue',
          borderBottomWidth: 1
        }
      }else{
        return {}
      }
    }

    return (
        <View style={{flex: 1}}>
          <View style={styles.topBar}>
            <Text style={[styles.itemBar, choose(0)]}
                   onPress={this._loadData.bind(this, 0)}
            >
              推荐
            </Text>
            <Text style={[styles.itemBar, choose(1)]}
                  onPress={this._loadData.bind(this, 1)}
            >
              全部
            </Text>
          </View>
          <View>
            <ArticleList
              articleList={this.state.articleList}
              loadMoreData={this._loadMoreData.bind(this)}
              navigation = {this.props.navigation}
            />
          </View>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    flexDirection: 'row',
    // marginTop: 10,
  },
  itemBar: {
    textAlign: 'center',
    color: 'grey',
    paddingTop: 5,
    width: 70,
    paddingBottom: 2,
    marginBottom: 0,
    fontSize: 17,
  },
  choose: {
    color: 'blue',
    borderBottomColor: 'blue',
    borderBottomWidth: 1
  }
});

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
    marginHorizontal: 0
  }
export default StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
        tabBarVisible: false
      }
    },
    Detail: {
      screen: ArticleDetail,
      navigationOptions: {
         // header: {},
        headerTitle: '文章详情',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
        // headerTintColor: '#cccccc'
      }
    },
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        headerTitle: '个人资料',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    }
  },
  {
    initialRouteName: 'Home'
  }
);