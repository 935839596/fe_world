/**
 * Created by linGo on 2018/2/6.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('../common/config').ip

class TagItem extends Component{
  constructor(props){
    super(props)
    this.state = {
      following: this.props.tag.following,
      tag: this.props.tag
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      following: nextProps.tag.following,
      tag: nextProps.tag
    })
  }

  _follow(){
    var url = !this.state.following?
      ip + '/my/add_interest'
      :
      ip + '/my/remove_interest'
    fetch(url,{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tag: this.state.tag.tagName
      })
    }).then( res => res.json())
      .then( data => {
        console.log(data)
        if(data.ret === 0){
          this.setState({
            following: !this.state.following
          })
        }else if (data.ret === -1){
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '马上登录', onPress: ()=>{
                this.props.navigation.navigate('Login');
              }}
            ],
            { cancelable: false }
          )
        }else {
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        }
      })
  }

  render(){
    return(
      <View style={styles.tagWrapper}>
        {/*<View
          style={styles.left}
        >
          <Image
            style={styles.tagImg}
          />
        </View>*/}

        <View
          style={styles.right}
        >
          <View style={{flex: 1, position: 'relative', justifyContent: 'center'}}>
            <Text style={styles.top}>{this.state.tag.tagName}</Text>
            <Text style={styles.bottom}>{this.state.tag.fans.length}人关注·{this.state.tag.articles.length}篇文章</Text>
            {
              this.state.following ?
                <Text style = {styles.following}
                      onPress={this._follow.bind(this)}
                >
                  <Icon
                    name="check"
                    color="#4f91d0"
                    size={12}
                  />
                  已关注
                </Text>
                :
                <Text style = {styles.notFollow}
                      onPress={this._follow.bind(this)}
                >
                  <Icon
                    name="plus"
                    color="#4f91d0"
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



class TagList extends Component{
  constructor(props){
    super(props)
    this.state = {
      tagList: this.props.tagList
    }
  }

  _renderItem = ({item}) => (
    <TagItem
      tag = {item}
      navigation = {this.props.navigation}
    />
  );

  componentWillReceiveProps(nextProps) {
    this.setState({
      tagList: nextProps.tagList
    })
    console.log(this.state.tagList)
  }

  render(){
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {
          this.state.tagList?
            <FlatList
              data={this.state.tagList}
              renderItem = {this._renderItem}
              onRefresh={()=>{this.props.refresh()}}
              refreshing={false}
            />
            :
            <Text style={{flex: 1,alignSelf: 'center'}}>暂无标签</Text>
        }
      </View>
    )
  }
}

var leftWidth = 30
const styles = StyleSheet.create({
  following: {
    position: 'absolute',
    right: 5,
    borderColor: '#4f91d0',
    backgroundColor: 'white',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'#4f91d0',
    textAlign: 'center',
    fontSize: 12,
    alignSelf: 'center'
  },
  notFollow: {
    position: 'absolute',
    right: 5,
    borderColor: '#4f91d0',
    borderWidth: 1,
    width: 60,
    height: 23,
    lineHeight: 23,
    color:'#4f91d0',
    textAlign: 'center',
    fontSize: 12,
    alignSelf: 'center'
  },

  tagWrapper: {
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#11fffb',
    flex: 1,
    backgroundColor: 'white'
  },

  left: {
    width: leftWidth
  },
  tagImg: {
    width: leftWidth - 5,
    height: leftWidth - 5
  },

  right: {
    marginLeft: leftWidth,
    flex: 1,
  },
  top:{
    height: 21,
    lineHeight: 21,
    fontSize: 16,
    color: 'black'
  },
  bottom: {
    height: 30,
    lineHeight: 30
  }
})

export default TagList
