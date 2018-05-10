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
  Alert,
  TouchableOpacity
}from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('./config').ip;

class UserItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.user,
      following: this.props.user.following
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      user: nextProps.user,
      following: nextProps.user.following
    })
    console.log('in item',this.state.user)
  }

  _follow(){
    console.log('follow')

    var url = ip + (this.state.following? '/common/move_follow_user' : '/common/add_follow_user') + '?id=' + this.state.user._id;

    fetch(url)
      .then( res => res.json())
      .then( data => {
        console.log(data)
        if(data.ret===0){
          this.setState({
            following: !this.state.following,
          })
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登录', onPress: ()=>{this.props.navigation.navigate('Login')}}
            ],
            { cancelable: false }
          )
        }
      })

  }

  _getMeta(){
    var company = this.state.user.company,
      intro = this.state.user.intro;
    var result = '' ;
    if(intro){
      result += intro;
      result = company?result+' @ '+company : result
    }else{
      result = company?company: ''
    }
    return result?result+' - ' : '简介：无'
  }

  render() {
    return (
      <View style = {styles.userWrapper}>
        <View style={styles.left}>
          <Image
            source = {
              this.state.user.avatarLarge?
                {uri: this.state.user.avatarLarge}
                :
                require('../../resource/image/mying.png')
            }
            style = { styles.userProtrait}
          />
        </View>
        <View style = {styles.right}>
          <View style = {styles.text}>
            <Text style= {styles.textItem1}>{this.state.user.username}</Text>
            <Text style= {styles.textItem2}>{this._getMeta()}</Text>
          </View>
          {
            !this.state.user.self?
              <TouchableOpacity
                style = {styles.operation}
                onPress={this._follow.bind(this)}
              >
                {this.state.following ?
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
              </TouchableOpacity>
              :
              <Text></Text>
          }
        </View>
      </View>
    )
  }
}

class UserList extends React.PureComponent {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title
  });


  constructor (props) {
    super(props);
    this.state = {
      userList: [],
      userId: this.props.navigation.state.params.userId,
      url: this.props.navigation.state.params.url
    }

    this. _refresh()
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:UserList`, this._refresh.bind(this))
  }

  _refresh(){
    console.log('in userList')

    var url = this.state.url + '?id=' + this.state.userId;
    fetch(url)
      .then(res=> res.json())
      .then(data => {
        console.log('in userList', data)
        this.setState({
          userList: data.list
        })

      })
  }

  _renderItem = ({item}) => (
    <UserItem
      user={item}
      navigation = {this.props.navigation}
    />
  )


  _follow(){
    var url = ip + (this.state.following? '/common/move_follow_user' : '/common/add_follow_user') + '?id=' + this.state.discussion.author._id;

    fetch(url)
      .then( res => res.json())
      .then( data => {
        console.log(data)
        if(data.ret===0){
          this.setState({
            following: !this.state.following,
          })
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登录', onPress: ()=>{this.props.navigation.navigate('Login')}}
            ],
            { cancelable: false }
          )
        }
      })

  }

  render() {
    return (
      <View>
        {
          this.state.userList.length>0?
            <FlatList
              data = {this.state.userList}
              renderItem = {this._renderItem}
              style = {{backgroundColor: '#ffffff'}}
            />
            :
            <View style={{
              height: 30,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text>暂无用户</Text>
            </View>
        }
      </View>


    )
  }

}

const styles = StyleSheet.create({
  userWrapper: {
    height: 50,
    flexDirection: 'row',
    marginTop: 10
  },

  left: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userProtrait: {
    width: 30,
    height: 30,
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
    height: 50,
    lineHeight: 25,
    textAlignVertical: 'bottom'
  },
  textItem1: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  textItem2: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 20
  },
  operation: {
    position: 'absolute',
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,

  },
  following: {
    borderColor: 'green',
    backgroundColor: 'green',
    borderWidth: 1,
    width: 60,
    height: 26,
    lineHeight: 26,
    color:'white',
    textAlign: 'center',
    fontSize: 12
  },
  notFollow: {
    borderColor: 'green',
    borderWidth: 1,
    width: 60,
    height: 26,
    lineHeight: 26,
    color:'green',
    textAlign: 'center',
    fontSize: 12
  }
})

export default UserList;