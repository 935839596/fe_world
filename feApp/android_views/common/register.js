import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('../common/config').ip;



class Register extends Component{
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password1: '',
      password2: '',
      loginable: false,
      logining: false,

      pwd1: false,
      pwd2: false
    }
  }

  _register() {
    if(!this.state.loginable || this.state.logining){
      return;
    }

    if(this.state.password1 != this.state.password2){
      Alert.alert(
        '警告',
        '两次输入的密码不一致',
        [
          {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
      )
      return;
    }


    this.setState({
      logining: true
    })
    var url = ip +'/register'
    fetch(url,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password1,
      })
    })
      .then(res => res.json())
      .then(data => {
        if(data.ret === 0){
          this.props.navigation.navigate('TagSelect')
        }else{
          Alert.alert(
            '提示',
            data.message,
            [
              {text: 'OK', onPress: () => this.setState({logining: false})},
            ],
            { cancelable: false }
          )
          this.setState({
            username: '',
            loginable: true
          })
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
              defaultValue = {this.state.username}
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
              placeholder= '请输入密码'
              multiline={false}
              underlineColorAndroid= 'transparent'
              style={styles.input}
              secureTextEntry={this.state.pwd1?false:true}
              onChangeText={ (text) => {
                this.setState({
                  password1: text
                })
                if(this.state.username && this.state.password1.length>3 && this.state.password2.length>3){
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
            <Icon
              color="#388bec"
              name={this.state.pwd1?'eye':'eye-slash'}
              style={styles.eye}
              size={15}
              onPress={ ()=>{
                this.setState({
                  pwd1: !this.state.pwd1
                })
              }}
            />
          </View>
          <View style={styles.password}>
            <Text style={styles.label}>确认密码</Text>
            <TextInput
              placeholder= '请再次输入密码'
              multiline={false}
              underlineColorAndroid= 'transparent'
              style={styles.input}
              secureTextEntry={this.state.pwd2?false:true}
              onChangeText={ (text) => {
                this.setState({
                  password2: text
                })
                if(this.state.username && this.state.password1 && this.state.password2){
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
            <Icon
              color="#388bec"
              name={this.state.pwd2?'eye':'eye-slash'}
              style={styles.eye}
              size={15}
              onPress={ ()=>{
                this.setState({
                  pwd2: !this.state.pwd2
                })
              }}
            />
          </View>
        </View>
        <Text
          style={[styles.loginBtn, (this.state.loginable && !this.state.logining)?styles.loginable: styles.loginableNot]}
          onPress={this._register.bind(this)}
        >
          {this.state.logining?'注册中...':'立即注册'}
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
    alignItems: 'center',
    position: 'relative'
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
  },

  eye: {
    position:'absolute',
    right: 5,
    alignSelf: 'center'
  }
})

export default Register