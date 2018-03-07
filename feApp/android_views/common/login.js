/**
 * Created by linGo on 2018/3/6.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert
} from 'react-native'

const ip = require('../common/config').ip;

class Login extends Component{
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loginable: false,
      logining: false
    }
  }

  login() {
    if(!this.state.loginable || this.state.logining){
      return;
    }



    this.setState({
      logining: true
    })

    var url = ip +'/login'
    fetch(url,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.ret === 0){
          this.props.navigation.popToTop();
          console.log(this.props.navigation)
        }else{
          Alert.alert(
            '提示',
            data.message,
            [
              {text: 'OK', onPress: () => this.setState({logining: false})},
            ],
            { cancelable: false }
          )
        }

      })


  }

  render(){
    return(
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.textInputWrapper}>
          <View style={styles.username}>
            <Text style={styles.label}>昵称</Text>
            <TextInput
              placeholder= '请填写昵称'
              multiline={false}
              underlineColorAndroid= 'transparent'
              style={styles.input}
              onChangeText={ (text) => {
                this.setState({
                  username: text
                })
                if(this.state.username && this.state.password){
                  this.setState({
                    loginable: true
                  })
                }else{
                  this.setState({
                    loginable: false
                  })
                }
              }}
            />
          </View>
          <View style={styles.password}>
            <Text style={styles.label}>密码</Text>
            <TextInput
              placeholder= '请填写用户密码'
              multiline={false}
              underlineColorAndroid= 'transparent'
              style={styles.input}
              onChangeText={ (text) => {
                this.setState({
                  password: text
                })
                if(this.state.username && this.state.password){
                  this.setState({
                    loginable: true
                  })
                }else{
                  this.setState({
                    loginable: false
                  })
                }
              }}
            />
          </View>
        </View>
        <Text
          style={[styles.loginBtn, (this.state.loginable && !this.state.logining)?styles.loginable: styles.loginableNot]}
          onPress={this.login.bind(this)}
        >
          {this.state.logining?'登录中...':'登录'}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textInputWrapper: {
    marginTop: 30,
    width: 300,
    alignSelf: 'center'
  },

  username: {
    flexDirection: 'row',
    borderColor: '#e3e3e3',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  password: {
    flexDirection: 'row',
    borderColor: '#e3e3e3',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },


  label: {
    width: 100,
    color: 'black'
  },
  input: {
    flex: 1
  },

  loginBtn: {
    width: 300,
    height: 40,
    lineHeight: 40,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 5
  },

  loginable: {
    backgroundColor: '#1da012',
    color: 'white'
  },
  loginableNot: {
    backgroundColor: '#a4daa0',
    color: '#bfe8bd'
  }
})

export default Login
