/**
 * Created by linGo on 2018/3/10.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  Image,
  TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('../common/config').ip

class InputScreen extends Component{

  constructor(props){
    super(props)
    this.state = {
      content: this.props.navigation.state.params.value,
      sending: false
    }
  }

  done(){
    console.log('done')
    if(this.state.sending){
      console.log('sending')
      return
    }
    if(!this.state.content){
      console.log(this.state.centent)
      Alert.alert(
        '警告',
        '请输入资料',
        [
          {text: 'ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
      )
      return;
    }
    this.setState({
      sending: true
    })
    var url = this.props.navigation.state.params.url;
    console.log(url)
    fetch(url,{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: this.props.navigation.state.params.type,
        intro: this.state.content,
        company: this.state.content
      })
    }).then(res=>res.json())
      .then(data => {
        console.log(data)
        if(data.ret === 0){
          this.setState({
            sending: false
          })
          this.props.navigation.goBack()
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
          this.setState({
            sending: false
          })
        }
      })
  }

  render(){
    return(
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text
          style={styles.cancel}
          onPress={()=>{this.props.navigation.goBack()}}
        >
          取消
        </Text>
        <Text
          style={styles.title}
        >
          修改{this.props.navigation.state.params.title}
        </Text>
        <Text
          style={styles.done}
          onPress={this.done.bind(this)}
        >
          完成
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          underlineColorAndroid= 'transparent'
          multiline={false}
          defaultValue={this.state.content}
          onChangeText={ (text) => {
            this.setState({
              content: text
            })
          }}
        />
      </View>

    </View>
    )
  }

}

const styles = StyleSheet.create({
  header:{
    height: 50,
    lineHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  cancel: {
    marginLeft: 10,
    color: '#388bec'
  },
  title: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    color: 'black'
  },
  done: {
    width: 50,
    textAlign: 'center',
    color: '#388bec'
  },


  inputWrapper: {
    marginTop: 20,
    height: 45,
    lineHeight: 45,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'black'
  },
})

export default InputScreen