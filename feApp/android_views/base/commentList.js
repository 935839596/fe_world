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
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import CommentModal from './commentModal'

class CommentItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: this.props.comment,

      //modal
      modalVisible: false,
      content: '',
      placeholder: '评论@深度覅及阿斯蒂芬',
      //发送按钮
      sending: false,
      sendable: false
    }
  }

  _showModal(username, userId) {
    this.props.showModal(username, userId, this.props.articleId, this.state.comment._id)
  }


  _like(){

  }

  _goToSecondComment() {
    console.log(this.props)
    this.props.navigation.navigate('SecondCommentList')
  }

  render() {
    return(
      <View>
        <TouchableHighlight
          onPress = {() => {this.props.navigation.navigate('SecondCommentList')}}
          activeOpacity={0.7}
          underlayColor='grey'
        >
          <View style = {styles.commentItem}>
            <View style = {styles.left}>
              <Image
                source= {require('../../resource/image/mying.png')}
                style = {styles.userProtrait}
              />
            </View>
            <View style = {styles.right}>
              <View style = {styles.top}>
                <Text style = {styles.username}>清心寡欲的圈圈</Text>
                <Text style = {styles.commentContent}>
                  hhhhhh你好逗啊
                </Text>
                <Text style = {styles.more}>
                  查看更多回复>>
                </Text>
              </View>
              <View style = {styles. bottom}>
                <View>
                  <Text style = {styles.time}>2-23 13:31</Text>
                </View>
                <View style = {styles.operation}>
                  <Text style = {styles.iconWrapper}>
                    <Icon
                      name="comments"
                      size={15}
                      style={ styles.icon }
                      onPress = {this._showModal.bind(this,'alin', '1524582')}
                    />
                  </Text>
                  <Text style = {styles.iconWrapper}>
                    <Icon
                      name="heart"
                      size={15}
                      color={this.state.like?'{color:"red"}':'{color: "#cccccc"}'}
                      onPress={this._like.bind(this)}
                      style={ styles.icon }
                    /> 0
                  </Text>

                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
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
      sendInfo: {}
    }
  }

  showModal(username, userId, articleId, commentId) {
    console.log('传过来的username', username)
    var sendInfo = {
      username: username,
      userId: userId,
      type: 1,
      toArticleId: articleId,
      toCommentId: commentId
    }
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
    this._setModalVisible(false)
  }

  _renderItem = ({item}) => (
    <CommentItem
      comment = {item}
      navigation = {this.props.navigation}
      showModal = {this.showModal.bind(this)}
      articleId = 'asdfasfasdfdasdfasddfasdf'
    />
  )


  render() {
    return (
      <View style={{flex: 1, marginBottom: 5}}>
        <View style={styles.commentNumber}>
          <Text style={{color: 'black'}}>评论 100</Text>
        </View>
        <FlatList
          data = {[{a:1}, {b: 1}, {c: 1},{a:1},{b: 1},{b: 1}]}
          renderItem = {this._renderItem}
          style = {{backgroundColor: '#ffffff'}}
        />
        <CommentModal
          modalVisible= {this.state.modalVisible}
          placeholder = {this.state.placeholder}
          sendInfo = {this.state.sendInfo}
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
  }


})

export default CommentList