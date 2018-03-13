/**
 * Created by linGo on 2018/3/12.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator } from 'react-navigation';

const ip = require('../common/config').ip

var ImagePicker = require('react-native-image-picker');

class Post extends Component{
  constructor(props){
    super(props)
    this.state ={
      content: '',
      sending: false,

      image: ''
    }
  }

  _send(){
    if(this.state.sending) return;

    this.setState({
      sending: true
    })

    var imgCache = [];
    imgCache.push(this.state.image)
    fetch(ip + '/discussion/write_discussion',{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: this.state.content,
        image: imgCache
      })
    }).then(res=>res.json())
      .then(data => {
        console.log(data)
        if(data.ret === 0){
          this.props.navigation.goBack();
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

  _selectImg(){
    var options = {
      title: '',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // let source = { uri: response.uri };

        // You can also display the image using data:
         let source ='data:image/jpeg;base64,' + response.data;

        console.log('image:',source)

        this.setState({
          image: source
        });
      }
    });
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
            发表言论
          </Text>
          <Text
            style={styles.send}
            onPress={this._send.bind(this)}
          >
            完成
          </Text>
        </View>
        <View style={{flex: 1,backgroundColor: '#fff'}}>
          <TextInput
            placeholder = '说点什么...'
            multiline = {true}
            defaultValue = {this.state.content}
            underlineColorAndroid= 'transparent'
            style={styles.textInput}
            onChangeText = {(text) => {
              this.setState({
                content: text
              })
            }}
          />
          <View style={styles.imgList}>
            <View style={styles.imageWrapper}>
              {
                this.state.image?
                  <Icon
                    name='close'
                    size={20}
                    color="white"
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 35,
                      zIndex: 10,
                      backgroundColor: 'black',
                      borderRadius: 23
                    }}
                    onPress={()=>{this.setState({image: ''})}}
                  />
                  :
                  <Text></Text>
              }
              <TouchableOpacity
                onPress={this._selectImg.bind(this)}
              >
                <Image
                  style={styles.image}
                  // source={require('../../resource/image/home.png')}
                  source = {{uri: this.state.image}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{height: 60, justifyContent: 'center'}}>
          <Icon
            name="image"
            color='#388bec'
            size={25}
            onPress={this._selectImg.bind(this)}
            style={{marginLeft: 10}}
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
  send: {
    width: 50,
    textAlign: 'center',
    color: '#388bec',
    marginRight: 5
  },

  textInput: {
    fontSize: 15
  },

  imgList:{
    margin: 20
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain'
  },

  imageWrapper:{
    position: 'relative',
    width: 250,
    height: 250,
  }
})

export default Post