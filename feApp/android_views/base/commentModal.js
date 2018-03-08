/**
 * Created by linGo on 2018/2/24.
 */

//评论modal
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class ModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {

      //modal
      modalVisible: this.props.modalVisible,
      content: '',
      placeholder: this.props.placeholder,

      //发送按钮
      sending: false,
      sendable: false,

      //发送需要的信息
      sendInfo: this.props.sendInfo

    }
  }

  _setModalVisible(visible) {
    console.log('click')
    this.setState({
      modalVisible: visible
    })
  }

  _closeModal() {
    this.props.closeModal()
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
      placeholder: nextProps.placeholder,
      sendInfo: nextProps.sendInfo
    })
  }

  _send() {
    if(this.state.sending || !this.state.sendable) return;

    //发送
    this.setState({
      sending: true
    })


    console.log(this.state.sendInfo)

    fetch(this.state.sendInfo.url,{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: this.state.sendInfo.type,
        content: this.state.content,
        articleId: this.state.sendInfo.articleId,
        discussionId: this.state.sendInfo.discussionId,
        toCommentId: this.state.sendInfo.toCommentId,
        toSecCommentId: this.state.sendInfo.toSecCommentId,
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.ret === 0){
          this.setState({
            sending: false,
            sendable: false,
            content: ''
          })
          this._closeModal();
        }else{
          this.setState({
            sending: false,
            sendable: true,
          })
        }
      })

    //TODO:发送完毕还原状态，并隐藏modal
  }

  render() {
    return(
      <Modal
        style = {styles.commentModal}
        animationType = {'fade'}
        visible = {this.state.modalVisible}
        onRequestClose = {()=>{this._setModalVisible(false)}}
      >
        <View style = {styles.modalContainer}>
          <Icon
            onPress = {this._closeModal.bind(this)}
            name = 'close'
            style = {styles.closeIcon}
          />
          <View style = {styles.commentBox}>
            <View style = {styles.commentView}>
              <TextInput
                placeholder = {this.state.placeholder}
                style = {styles.textInput}
                multiline = {true}
                defaultValue = {this.state.content}
                underlineColorAndroid= 'transparent'
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
                style = {[styles.sendBtn, {color: (this.state.sendable && !this.state.sending)?'white' : 'grey'}]}
                onPress = {this._send.bind(this)}
              >
                {this.state.sending? '发送中...':'发送'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

}


var Dimensions = require('Dimensions');
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  //modal
  commentModal: {
    height: 150,
    backgroundColor: 'transparent',
    marginTop: 50,
  },
  modalContainer: {
    paddingTop: 45,
    backgroundColor: 'transparent',
  },
  closeIcon: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#ccc'
  },
  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentView: {
    paddingLeft: 2,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgb(18, 150, 219)',
    borderRadius: 4,
    fontSize: 14,
    height: 80,
    width: width-20,
    position: 'relative',
    flexDirection: 'row'
  },
  sendBtn: {
    width: 70,
    height: 78,
    lineHeight: 80,
    textAlign: 'center',
    position: 'absolute',
    right: 0,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'rgb(18, 150, 219)',
    backgroundColor: 'rgb(18, 150, 219)'
  },
  textInput: {
    width: width,
    paddingRight: 80,
    // height: 80
  }
})

export default ModalComponent