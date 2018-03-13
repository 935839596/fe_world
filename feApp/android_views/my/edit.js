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

const ip = require('../common/config').ip

class Edit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      flag: false
    }
    this._refresh()
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:Edit`, this._refresh.bind(this))
  }

  _refresh(){
    fetch(ip + '/my/me')
      .then(res=>res.json())
      .then(data => {
        if(data.ret === 0){
          this.setState({
            user: data.user,
            flag: true
          })
        }
      })
  }



    render()
    {
      return (
        <View style={{backgroundColor: 'white'}}>
          {this.state.flag?
            <View>
              <View style={styles.itemWrapper}>
                <Text style={styles.left}>
                  头像
                </Text>
                <Text style={styles.right}>
                  <Image
                    source={!this.state.user ?
                      {uri: this.state.user.avatarLarge}
                      :
                      require('../../resource/image/mying.png')
                    }
                    style={styles.userProtrait}
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
  }

})

export default Edit