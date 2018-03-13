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
import ArticleComment from '../common/articleComment'
import UserProfile from '../common/userProfile'
import UserList from '../common/userList'
import Login from '../common/login'
import SecondCommentList from '../base/secondCommentList'
import LoveArticle from '../common/loveArticle'
import OriginalArticle from '../common/originalArticle'


const ip = require('../common/config').ip
console.log('gg', ip)

 class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choose: 0,
      url: ip + '/article/all_articles',
      last_date: undefined,
      articleList: [],
      more: true
    }
    this.refresh()
  }

   onFocus(){
    console.log('focus in home')
     this.refresh()
   }

   componentDidMount() {
     this.props['screenProps'].navigationEvents.addListener(`onFocus:Home`, this.onFocus.bind(this))
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
          <View style={{flex: 1}}>
            <ArticleList
              articleList={this.state.articleList}
              loadMoreData={this._loadMoreData.bind(this)}
              navigation = {this.props.navigation}
              refresh = {this.refresh.bind(this)}
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
    height: 50,
    lineHeight: 50,
    backgroundColor:"#eee"
    // marginTop: 10,
  },
  itemBar: {
    textAlign: 'center',
    color: 'grey',
    paddingTop: 5,
    width: 70,
    paddingBottom: 2,
    marginBottom: 0,
    fontSize: 18,
    textAlignVertical: 'center'
  },
  choose: {
    color: 'blue',
    borderBottomColor: 'blue',
    borderBottomWidth: 1
  }
});

var headerStyle = {
  fontSize: 18,
  height: 50,
  lineHeight: 50,
  fontWeight: 0,
  textAlign: 'center',
  justifyItems: 'center',
  overflow: 'hidden',
  backgroundColor: 'rgb(233, 233, 239)'
},
  headerTitleStyle= {
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 0
  };
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
    },
    UserList: {
      screen: UserList,
      navigationOptions: {
        headerTitle: '关注的用户',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    ArticleComment: {
      screen: ArticleComment,
      navigationOptions: {
        headerTitle: '发表评论',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    SecondCommentList: {
      screen: SecondCommentList,
      navigationOptions: {
        headerTitle: '回复评论',
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
  },
  {
    initialRouteName: 'Home'
  }
);