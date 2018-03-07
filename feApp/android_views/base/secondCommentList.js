/**
 * Created by linGo on 2018/2/25.
 */

//评论回复列表
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

import CommentModal from './commentModal'
import Icon from 'react-native-vector-icons/FontAwesome';

class SecondCommentItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      secComment: this.props.secComment
    }
  }

  _showModal(username, userId) {
    this.props.showModal(username, userId, this.props.articleId, this.state.secComment._id)
  }

  _like(){

  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress = {this._showModal.bind(this, 'alin', '1524582')}
        >
          <View style = {[styles.commentItem, styles.secondCommentItem]}>
            <View style = {styles.left}>
              <Image
                source= {require('../../resource/image/mying.png')}
                style = {styles.userProtrait}
              />
            </View>
            <View style = {styles.right}>
              <View style = {styles.top}>
                <Text style = {styles.username}>圈圈圆圆圈圈</Text>
                <View style = {styles.operation}>
                  <Text style = {styles.iconWrapper}>
                    <Icon
                      name="comments"
                      size={15}
                      style={ styles.icon }
                      onPress = {this._showModal.bind(this, 'alin', '1524582')}
                    />
                  </Text>
                  <Text style = {styles.iconWrapper}>
                    <Icon
                      name={this.state.like?'thumbs-o-up':'thumbs-o-up'}
                      size={15}
                      color='orange'
                      onPress={this._like.bind(this)}
                      style={ styles.icon }
                    /> 0
                  </Text>

                </View>
                <View>
                  <Text style = {[styles.time, {color: '#999', fontSize: 10}]}>2-23 13:31</Text>
                </View>
                <Text style = {styles.commentContent}>哈哈哈哈这个真的好好笑啊啊啊
                </Text>
              </View>

            </View>
          </View>
        </TouchableOpacity>
      </View>

    )
  }
}

class SecondCommentList extends Component {
  constructor(props){
    super(props)
    this.state = {
      comment: {},


      //评论
      content: '',
      sendable: false,
      sending: false,

      //评论的modal
      modalVisible: false,
      placeholder: '',
      sendInfo: {}
    }
  }


  _send(){

  }

  _renderItem = ({item}) => (
    <SecondCommentItem
      secComment = {item}
      navigation = {this.props.navigation}
      showModal = {this.showModal.bind(this)}
      articleId = 'asdfasfasdfdasdfasddfasdf'
    />
  )

  showModal(username, userId, articleId, SecCommentId) {
    var sendInfo = {
      username: username,
      userId: userId,
      type: 2,
      toArticleId: articleId,
      toCommentId: this.state.comment._id,
      toSecCommentId: SecCommentId
    }
    this.setState({
      modalVisible: true,
      placeholder: '回复@'+username,
      sendInfo: sendInfo
    })
  }

  _like(){

  }

  closeModal(){
    this.setState({
      modalVisible: false
    })
  }

  render() {
    return (
      <View
         style = {{paddingBottom: 40, flex: 1}}
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
              <Text style = {styles.commentContent}>hhhhhh你好逗啊
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
                    onPress = {this.showModal.bind(this, 'alin', '1524582')}
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

        <FlatList
          data = { [{a:1}, {b:1}, {c: 1},{a:1}, {b:1}, {c: 1},{a:1}, {b:1}, {c: 1}]}
          renderItem = {this._renderItem}
          style = {{flex: 1, marginBottom: 5}}
        />

        <View style={styles.commentView}>
          <TextInput
            placeholder = '回复...'
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

const styles = StyleSheet.create({
  commentItem: {
    paddingTop: 10,
    paddingLeft: 5,
    flexDirection: 'row',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 10,
    backgroundColor: '#ffffff'
  },
  secondCommentItem: {
    marginLeft: 10,
    borderBottomWidth: 1,
    backgroundColor: '#fce1e0',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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
    position: 'relative'
  },
  username: {
    fontSize: 12
  },
  commentContent: {
    fontSize: 12,
    color: 'black'
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


  //二级评论专用
  secondLike: {
    position: 'absolute',
    right: 10,
    top: 0,
    fontSize: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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

export default SecondCommentList