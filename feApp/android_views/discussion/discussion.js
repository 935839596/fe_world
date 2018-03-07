/**
 * Created by linGo on 2018/2/26.
 */
//讨论区

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  FlatList
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome';

import ArticleList from '../base/articleList'
import ArticleDetail from '../common/articleDetail'
import ArticleComment from '../common/articleComment'
import UserProfile from '../common/userProfile'
import UserList from '../common/userList'
import SecondCommentList from '../base/secondCommentList'

class DiscussionItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      discussion: this.props.discussion
    }
  }

  render() {
    return(
      <View>
        <TouchableHighlight
          // onPress = {() => {this.props.navigation.navigate('SecondCommentList')}}
          activeOpacity={0.1}
          underlayColor='grey'
        >
          <View style = {styles.discussionItem}>
            <View style = {styles.top}>
              <View style = {styles.left}>
                <Image
                  source= {require('../../resource/image/mying.png')}
                  style = {styles.userProtrait}
                />
              </View>
              <View style = {styles.right}>
                <Text style = {styles.username}>RXlee</Text>
                <Text style = {styles.meta}>
                  AndroidDeveloper @ Google * 26分钟前
                </Text>
              </View>
              {this.state.following ?
                <Text style = {styles.following}>
                  <Icon
                    name="check"
                    color="#e1e5e9"
                    size={12}
                  />
                  已关注
                </Text>
                :
                <Text style = {styles.notFollow}>
                  <Icon
                    name="plus"
                    color="#e1e5e9"
                    size={12}
                  />
                  关注
                </Text>
              }
            </View>
            <View style = {styles.contentWrapper}>
              <Text style = {styles.discussionContent}>
                快乐的池塘有一只小跳蛙{'\n'}
                leapleapleap frog{'\n'}
                长着两只大眼睛
              </Text>
              {
                this.state.discussion.b === 1 ?
                  <Text>这张没有图</Text>
                  :
                  <Image
                  source= {require('../../resource/image/pic.png')}
                  style = {styles.contentImage}
                  />
              }
            </View>
            <View style = {styles.bottom}>
              <View style = {styles.likeWrapper}>
                <Icon
                  name = 'thumbs-up'
                  color = {'#ccc'}
                  size = {15}
                />
                <Text style = {styles.likeCount}> 10</Text>
              </View>
              <View style = {styles.commentWrapper}>
                <Icon
                  name = 'comments'
                  size = {15}
                  color = {'#ccc'}
                />
                <Text style = {styles.commentCount}> 10</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }


}

class Discussion extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  _renderItem = ({item}) => (
    <DiscussionItem
      discussion = {item}
      navigation = {this.props.navigation}
      // showModal = {this.showModal.bind(this)}
      articleId = 'asdfasfasdfdasdfasddfasdf'
    />
  )

  render() {
    return(
      <View>
        <FlatList
          data = {[{a:1}, {b:1}, {c: 1}]}
          renderItem = {this._renderItem}
          style = {{backgroundColor: '#ffffff'}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  discussionItem: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 10,
    borderBottomColor: '#ecf2f5',
    paddingTop: 10
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
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'#e1e5e9',
    textAlign: 'center',
    fontSize: 12,
  },
  notFollow: {
    position: 'absolute',
    right: 5,
    borderColor: '#e1e5e9',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'#e1e5e9',
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

  bottom: {
    flexDirection: 'row',
    height: 30,
    borderColor: '#f5f5f5',
    borderTopWidth: 1,
  },
  likeWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f5f5f5',
    borderLeftWidth: 1,
  },
  likeCount: {
    fontSize: 12,
    marginLeft: 5
  },
  commentWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentCount: {
    fontSize: 12,
    marginLeft: 5
  }
})


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
    Discussion: {
      screen: Discussion,
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
        headerTitle: '关注',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    ArticleComment: {
      screen: ArticleComment,
      navigationOptions: {
        headerTitle: '关注',
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
    }
  },
  {
    initialRouteName: 'Discussion'
  }
)
