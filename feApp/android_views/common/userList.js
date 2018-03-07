/**
 * Created by linGo on 2018/2/13.
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Alert
}from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('./config').ip;

class UserItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.user
    }
  }

  render() {
    return (
      <View style = {styles.userWrapper}>
        <View style={styles.left}>
          <Image
            source = {require('../../resource/image/mying.png')}
            style = { styles.userProtrait}
          />
        </View>
        <View style = {styles.right}>
          <View style = {styles.text}>
            <Text style= {styles.textItem1}>往下邀约熊</Text>
            <Text style= {styles.textItem2}>写代码的 @ ad sad </Text>
          </View>
          <View style = {styles.operation}>
            {this.state.user.following ?
              <Text style = {styles.following}>
                <Icon
                  name="check"
                  color="white"
                  size={12}
                />
                已关注
              </Text>
              :
              <Text style = {styles.notFollow}>
                <Icon
                  name="plus"
                  color="green"
                  size={12}
                />
                关注
              </Text>
            }
          </View>
        </View>
      </View>
    )
  }
}

class UserList extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      userList: this.props.userList
    }
  }

  _renderItem = ({item}) => (
    <UserItem
      user={item}
      navigation = {this.props.navigation}
    />
  )

  componentWillReceiveProps(nextProps) {
    this.setState({
      userList: nextProps.userList
    })
  }

  render() {
    return (
      <FlatList
        // data = {this.state.userList}
        data = { [{a: 1}, {b: 2}, {c: 3}] }
        renderItem = {this._renderItem}
        style = {{backgroundColor: '#ffffff'}}
      />
    )
  }

}

const styles = StyleSheet.create({
  userWrapper: {
    height: 40,
    flexDirection: 'row',
    marginTop: 10
  },

  left: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userProtrait: {
    width: 25,
    height: 25,
    overflow: 'hidden',
    borderWidth: 1,
    resizeMode:'cover',
    backgroundColor: 'transparent'
  },

  right: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#eeeeee',
    borderBottomWidth: 1,
    position: 'relative'
  },
  text: {
    height: 40,
    lineHeight: 20,
    textAlignVertical: 'bottom'
  },
  textItem1: {
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold',
  },
  textItem2: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 20
  },
  operation: {
    position: 'absolute',
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,

  },
  following: {
    borderColor: 'green',
    backgroundColor: 'green',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'white',
    textAlign: 'center',
    fontSize: 12
  },
  notFollow: {
    borderColor: 'green',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'green',
    textAlign: 'center',
    fontSize: 12
  }
})

export default UserList;