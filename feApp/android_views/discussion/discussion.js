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
  FlatList,
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome';

import UserProfile from '../common/userProfile'
import LoveArticle from '../common/loveArticle'
import OriginalArticle from '../common/originalArticle'
import UserList from '../common/userList'
import DiscussionComment from '../discussion/discussionComment'
import Login from '../common/login'
import SecondCommentList from '../base/secondCommentList'
import Post from './post'
import TagSelect from '../common/tagSelect'
import UserTag from '../common/userTag'
import PicModal from '../base/picModal'


var ip = require('../common/config').ip


class DiscussionItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      discussion: this.props.discussion,

      like: this.props.discussion.like,
      following: this.props.discussion.following,

      allCommentCount: 0,
      likeCount: this.props.discussion.meta.likeCount,

      self: this.props.discussion.self,


    }
    this._getAllCommentCount()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      discussion: nextProps.discussion,
      like: nextProps.discussion.like,
      likeCount: nextProps.discussion.meta.likeCount,
      following: this.props.discussion.following,
      self: this.props.discussion.self
    })
    this._getAllCommentCount()
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



  _showPicModal(url){
    this.props.showPicModal(url)
  }
  _getMeta(){
    var company = this.state.discussion.author.company,
      intro = this.state.discussion.author.intro;
    var result = '';
    if(intro){
      result += intro;
      result = company?result+' @ '+company : result
    }else{
      result = company?company: ''
    }
    return result?result+' - ' : ''
  }

  _getAllCommentCount(){
    var discussionId = this.state.discussion._id;
    var url = ip + '/discussion/all_comment_count?id=' + discussionId


    fetch(url)
      .then(res => res.json())
      .then(data => {
        if(data.ret === 0){
          this.setState({
            allCommentCount:parseInt(data.data)
          })
        }else{
          Alert.alert(
            '警告',
            '获取评论数目失败，请重试',
            [
              {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ],
            { cancelable: false }
          )
        }

      })

  }

  _like(){
    var url = ip + (this.state.like? '/discussion/dislike' : '/discussion/like') + '?id=' + this.state.discussion._id,
      inc = this.state.like?-1:1

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
              {text: '马上登录', onPress: ()=>{this.props.navigation.navigate('Login')}}
            ],
            { cancelable: false }
          )
        }
      })

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

  render() {
    return(
          <View style = {styles.discussionItem}>
            <View style = {styles.top}>
              <View style = {styles.left}>
                <TouchableOpacity
                  style={styles.PortraitWrapper}
                  onPress= {() => {
                    this.props.navigation.navigate('UserProfile',{userId: this.state.discussion.author._id})
                  }}
                >
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
              </View>
              <View style = {styles.right}>
                <Text style = {styles.username}
                  onPress= {() => {
                    this.props.navigation.navigate('UserProfile',{userId: this.state.discussion.author._id})
                  }}
                >{this.state.discussion.author.username}</Text>
                <Text style = {styles.meta}>
                  {this._getMeta() + this._formateTime()}
                </Text>
              </View>
              {
                !this.state.self?
                  this.state.following ?
                    <Text style = {styles.following}
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
                    <Text style = {styles.notFollow}
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
                  <TouchableOpacity
                    onPress={this._showPicModal.bind(this, this.state.discussion.imageCache[0])}
                  >
                    <Image
                      source= {{uri: this.state.discussion.imageCache[0]}}
                      style = {styles.contentImage}
                      resizeMethod="scale"
                    />
                  </TouchableOpacity>
              }
            </View>
            <View style = {styles.bottom}>
              <View style = {styles.likeWrapper}>
                <Icon
                  name={this.state.like?'thumbs-up':'thumbs-o-up'}
                  color = {'#388bec'}
                  size = {15}
                  onPress={this._like.bind(this)}
                />
                <Text style = {styles.likeCount}>{this.state.likeCount}</Text>
              </View>
              <TouchableOpacity
                style = {styles.commentWrapper}
                onPress={()=>{this.props.navigation.navigate('DiscussionComment', {'discussionId': this.state.discussion._id})}}
              >
                <View
                  style={{flexDirection: 'row'}}
                >
                  <Icon
                    name = 'comments-o'
                    size = {15}
                    color = {'#388bec'}
                  />
                  <Text style = {styles.commentCount}>{this.state.allCommentCount}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
    )
  }


}

class Discussion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      discussionList: [],
      last_date: '',
      more: false,
      loading: false,
      url: ip + '/discussion/all_discussion',

      moreVisible: true,
      fadeAnim: new Animated.Value(1),          // 透明度初始值设为0

      picModalVisible: false,
      picModalUrl: ''
    }
    this.refresh()
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:Discussion`, this.refresh.bind(this))
  }

  closePicModal(){
    console.log('close')
    this.setState({
      picModalVisible: false
    })
  }

  showPicModal(url){
    this.setState({
      picModalVisible: true,
      picModalUrl: url
    })
  }

  refresh(){
    console.log('refresh in discussionList')
    var website = ip + '/discussion/all_discussion'
    fetch(website)
      .then(res => res.json())
      .then(data => {
        console.log('discussionList', data)
        if(data.ret === 0){
          this.setState({
            discussionList: data.data.list,
            last_date: data.data.last_date,
            more: data.data.more,
            loading: false
          })
        }else{

        }
      })
  }

  _loadMoreData(){
    console.log('loading more')
    if(this.state.loading){
      return;
    }

    var website = this.state.url + '?last_date=' + this.state.last_date
    if(!this.state.more){
      console.log('no more discussion!!')
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
        console.log('more data', data)
        this.setState({
          discussionList: this.state.discussionList.concat(data.data.list),
          last_date: data.data.last_date,
          more: data.data.more,
          loading: false
        })
      })
  }

  xixi(){
    this.setState({
      moreVisible: false
    })
    console.log('sdafkasdjflsjflsdjflksjflsjfdl')
  }

  _showPost(){
    var url = ip + '/my/me';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if(data.ret === 0){
          if(!data.user){
            Alert.alert(
              '警告',
              '请先登录',
              [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: '马上登录', onPress: ()=>{
                  this.props.navigation.navigate('Login');
                }}
              ],
              { cancelable: false }
            )
          }else{
            this.props.navigation.navigate('Post')
          }
        }else{
          this.props.navigation.navigate('Post')
        }
      })
  }

  _renderItem = ({item}) => (
    <DiscussionItem
      discussion = {item}
      navigation = {this.props.navigation}
      showPicModal = {this.showPicModal.bind(this)}
      closePicModal= {this.closePicModal.bind(this)}
    />
  )

  render() {
    return(
      <View style={{flex: 1}}>
        <View style={styles.topBar}>
          <Text style={styles.title}>讨论区</Text>
          <Icon
            name="edit"
            color="#388bec"
            size={18}
            style={styles.edit}
            onPress={this._showPost.bind(this)}
          />
        </View>
        <View
          style={{flex: 1, position: 'relative'}}
        >
          <FlatList
            data = {this.state.discussionList}
            renderItem = {this._renderItem}
            style = {{backgroundColor: '#ffffff'}}
            onEndReachedThreshold={0.1}
            onEndReached = {this._loadMoreData.bind(this)}
            onRefresh={this.refresh.bind(this)}
            refreshing={false}
          />
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
                opacity: this.state.fadeAnim
              },!this.state.moreVisible?{height: 30}:{height: 0}]}
            >
              <Text style={{color: 'white', fontSize: 15}}>暂无更多</Text>
            </Animated.View>
        </View>

        <PicModal
          modalVisible={this.state.picModalVisible}
          url = {this.state.picModalUrl}
          closePicModal={this.closePicModal.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topBar:{
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    flexDirection: 'row',
    height: 50,
    lineHeight: 50,
    backgroundColor:"#eee",
    justifyContent: 'center',
    alignItems:'center',
    position: 'relative'
  },
  title:{
    textAlign: 'center',
    fontSize: 18,
    color: '#388bec'
  },
  edit: {
    position: 'absolute',
    alignSelf: 'center',
    right: 5
  },

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
  PortraitWrapper:{
    width: 30,
    height: 30,
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
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        headerTitle: '个人资料',
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
    UserList: {
      screen: UserList,
      navigationOptions: {
        // headerTitle: `${this.props.navigation.state.params.title}`,
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    DiscussionComment: {
      screen: DiscussionComment,
      navigationOptions: {
        headerTitle: '评论列表',
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
    SecondCommentList: {
      screen: SecondCommentList,
      navigationOptions: {
        headerTitle: '回复评论',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    Post: {
      screen: Post,
      navigationOptions: {
        header: null,
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
    TagSelect: {
    screen: TagSelect,
    navigationOptions: {
      headerStyle: headerStyle,
      header: null,
      headerTitleStyle: headerTitleStyle
    }
  },
    UserTag: {
      screen: UserTag,
      navigationOptions: {
        headerTitle: '他关注的标签',
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle
      }
    },
  },
  {
    initialRouteName: 'Discussion'
  }
)
