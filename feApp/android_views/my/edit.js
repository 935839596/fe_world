/**
 * Created by linGo on 2018/2/26.
 */


import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


var ImagePicker = require('react-native-image-picker');


const ip = require('../common/config').ip

class Edit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      flag: false,
      image: ''
    }
    this._refresh()
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:Edit`, this._refresh.bind(this))
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
      },
      quality: 0.4
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

        console.log(response)

        this.setState({
          image: source
        });

        this._modifyAva()
      }
    });
  }

  _refresh(){
    fetch(ip + '/my/me')
      .then(res=>res.json())
      .then(data => {
        if(data.ret === 0){
          this.setState({
            user: data.user,
            flag: true,
            image: data.user.avatarLarge
          })
        }
      })
  }

  _modifyAva(){
    fetch(ip + '/my/modify_avatarLarge',{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatarLarge: this.state.image,
      })
    }).then()
  }

    render()
    {
      return (
        <View style={{backgroundColor: 'white'}}>
          {this.state.flag?
            <View>
              <View style={[styles.itemWrapper, {height: 150,lineHeight: 150}]}>
                <Text style={styles.left}>
                  头像
                </Text>
                <Text style={styles.right}
                      onPress={this._selectImg.bind(this)}
                >
                  <Image
                    source={this.state.image ?
                      {uri: this.state.image}
                      :
                      require('../../resource/image/mying.png')
                    }
                    style={[styles.userProtrait]}
                  />
                </Text>
              </View>


              <View style={styles.itemWrapper}>
                <Text style={styles.left}>
                  姓名
                </Text>
                <Text style={styles.right}>
                  {this.state.user.username}
                </Text>
              </View>

              <View style={styles.itemWrapper}>
                <Text style={styles.left}>
                  公司
                </Text>
                <Text style={styles.right}
                      onPress={() => {
                        this.props.navigation.navigate('InputScreen',{
                          title: '公司',
                          url: ip + '/my/modify_description',
                          value: this.state.user.company,
                          type: 2
                        })
                      }}
                >
                  {this.state.user.company}
                  <Icon
                    name="angle-right"
                    size={18}
                    style={ styles.arrow }
                  />

                </Text>
              </View>

              <View style={styles.itemWrapper}>
                <Text style={styles.left}
                >
                  职位
                </Text>
                <Text style={styles.right}
                      onPress={() => {
                        this.props.navigation.navigate('InputScreen', {
                          title: '职位',
                          url: ip + '/my/modify_description',
                          value: this.state.user.intro,
                          type: 1
                        })
                      }}
                >
                  {this.state.user.intro}
                  <Icon
                    name="angle-right"
                    size={18}
                    style={ styles.arrow }
                  />
                </Text>
              </View>
            </View>
            :
            <Text style={{height: 50,lineHeight: 50, alignSelf: 'center', textAlign: 'center'}}>loading..</Text>
          }
        </View>
      )
    }
}


const styles = StyleSheet.create({
  itemWrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 40,
    lineHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f7f7f7'
  },
  left: {
    color: 'black',
    width: 50
  },
  right: {
    color: '#848484',
    textAlign: 'right',
    flex: 1
  },

  arrow:{
    marginLeft: 5
  },

  userProtrait: {
    height: 150,
    width: 150,
    resizeMode: 'cover'
  }

})

export default Edit