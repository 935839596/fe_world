/**
 * Created by linGo on 2018/2/6.
 */
//评论列表
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

import Icon from 'react-native-vector-icons/FontAwesome';

import CommentModal from './commentModal'

const ip = require('../common/config').ip

class CommentItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: this.props.comment,
      secCommentList: [],

      like: this.props.comment.like,
      likeCount: this.props.comment.meta.likeCount,

      //modal
      modalVisible: false,
      content: '',
      placeholder: '评论@深度覅及阿斯蒂芬',
      //发送按钮
      sending: false,
      sendable: false,

    }


    this._getSecComment();

  }

  _getSecComment(){
    var artilceId = this.props.articleId;
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
        }else{

        }
      })
  }

  _showModal(username, userId) {
    this.props.showModal(username, userId, this.props.articleId, this.state.comment._id)
  }

  //刷新回复的列表
  componentWillReceiveProps(nextProps) {
    this.setState({
      like: nextProps.comment.like,
    })
    this._getSecComment();
  }

  _like(){
    var url;
    if(this.props.articleId){
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
          this.setState({
            like: !this.state.like,
            likeCount: this.state.likeCount + inc
          })
          var newComment = Object.assign(this.state.comment, {
            like: this.state.like,
            meta:{
              likeCount: this.state.likeCount
            }
          })
          this.setState({
            comment: newComment
          })
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登录', onPress: ()=>{
                this.props.navigation.navigate('Login');
              }}
            ],
            { cancelable: false }
          )
        }
      })
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

  render() {
    return(
      <View style = {styles.commentItem}>
        <View style = {styles.left}>
          <TouchableOpacity
            style={styles.PortraitWrapper}
            onPress= {() => {
              this.props.navigation.navigate('UserProfile',{user: this.state.comment.author})
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
                    this.props.navigation.navigate('UserProfile',{user: this.state.comment.author})
                  }}
            >{this.state.comment.author.username}</Text>
            <Text style = {styles.commentContent}>
              {this.state.comment.content}
            </Text>
            {
              this.state.secCommentList.length>0?
                <Text style = {[styles.more]}
                      onPress={()=>this.props.navigation.navigate('SecondCommentList', {articleId: this.props.articleId, discussionId: this.props.discussionId ,comment: this.state.comment})}
                >
                  查看更多回复>>
                </Text>
                :
                <Text></Text>
            }



          </View>
          <View style = {styles. bottom}>
            <View>
              <Text style = {styles.time}>{this._formateTime()}</Text>
            </View>
            <View style = {styles.operation}>
              <Text style = {styles.iconWrapper}>
                <Icon
                  name="comments-o"
                  color="#388bec"
                  size={15}
                  style={ styles.icon }
                  onPress = {this._showModal.bind(this,this.state.comment.author.username, this.state.comment.author._id )}
                />
              </Text>
              <Text style = {styles.iconWrapper}>
                <Icon
                  size={15}
                  name={this.state.like?'thumbs-up':'thumbs-o-up'}
                  color='#388bec'
                  onPress={this._like.bind(this)}
                  style={ styles.icon }
                /> {this.state.likeCount}
              </Text>

            </View>
          </View>
        </View>
      </View>
    )
  }
}

class CommentList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentList: this.props.commentList,
      modalVisible: false,
      placeholder: '',
      sendInfo: {},
      allCommentCount: 0,
    }
    this._getAllCommentCount()
  }

  showModal(username, userId, articleId, commentId) {
    var url = articleId?
                ip + '/article/write_comment'
              :
                ip + '/discussion/write_comment'
    var sendInfo = {
      username: username,
      userId: userId,
      type: 1,
      articleId: articleId,
      discussionId: this.props.discussionId,
      toCommentId: commentId,
      url: url,
    }
    console.log(sendInfo)
    this.setState({
      modalVisible: true,
      placeholder: '回复@'+username,
      sendInfo: sendInfo
    })
  }

  _setModalVisible(visible) {
    console.log('click')
    this.setState({
      modalVisible: visible
    })
  }

  closeModal() {
    console.log('close')
    this._setModalVisible(false)
    this.setState({
      commentList: this.props.commentList,
    })
  }

  _getAllCommentCount(){
    var articleId = this.props.articleId,
        discussionId = this.props.discussionId
    ;
    if(articleId){
      var url = ip + '/article/all_comment_count?id=' + articleId
    }else{
      var url = ip + '/discussion/all_comment_count?id=' + discussionId
    }
    fetch(url)
      .then(res => res.json())
      .then( data => {
        if(data.ret == 0){
          this.setState({
            allCommentCount: parseInt(data.data)
          })
        }
      })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      commentList: nextProps.commentList
    })
    console.log('in commentList', this.state.commentList)
    this._getAllCommentCount()
  }

  _renderItem = ({item}) => (
    <CommentItem
      comment = {item}
      navigation = {this.props.navigation}
      showModal = {this.showModal.bind(this)}
      articleId = {this.props.articleId}
      discussionId = {this.props.discussionId}
      closeModal = {this.closeModal.bind(this)}
    />
  )

  _keyExtractor = (item, index) => item._id;

  render() {
    return (
      <View style={{flex: 1, marginBottom: 5}}>
        <View style={styles.commentNumber}>
          <Text style={{color: 'black'}}>评论 {this.state.allCommentCount}</Text>
        </View>
        {
          this.state.commentList.length !== 0 ?
            <FlatList
              data = {this.state.commentList}
              renderItem = {this._renderItem}
              style = {{backgroundColor: '#ffffff'}}
              keyExtractor={this._keyExtractor}
            />
          :
            <Text
              style = {{backgroundColor: '#ffffff',flex: 1, textAlign: 'center', marginTop: 15}}
            >
             ------ 暂无评论 ------
            </Text>
        }
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

var Dimensions = require('Dimensions');
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  commentItem: {
    paddingTop: 10,
    paddingLeft: 5,
    flexDirection: 'row'
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

  },
  username: {
    fontSize: 12
  },
  commentContent: {
    fontSize: 12,
    color: 'black'
  },
  more: {
    backgroundColor: '#eee',
    color: 'blue',
    fontSize: 10,
    padding: 4
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

  commentNumber: {
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    paddingLeft: 20,
    height: 25,
    justifyContent: 'flex-end',
    color: 'black'
  },

  hide: {
    height: 0
  }

})

export default CommentList