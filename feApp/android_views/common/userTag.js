/**
 * Created by linGo on 2018/3/14.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity,
} from 'react-native';

import TagList from '../base/tagList'

const ip = require('../common/config').ip

class UserTag extends Component{
  constructor(props){
    super(props)

    this.state = {
      userId: this.props.navigation.state.params.userId,
      user: {},

      tagList: []
    }

    this._refresh()
  }

  componentDidMount() {
    this.props['screenProps'].navigationEvents.addListener(`onFocus:UserTag`, this._refresh.bind(this))
  }

  _refresh(){
    var url = ip + '/common/user_tags?id=' + this.state.userId;
    fetch(url)
      .then( res=>res.json())
      .then( data => {
        if(data.ret === 0) {
          console.log(data)
          this.setState({
            tagList: data.list
          })
        }
        else{
          this.setState({
            tagList: data.list
          })
        }
      })
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <TagList
          refresh = {this._refresh.bind(this)}
          tagList = {this.state.tagList}
          navigation = {this.props.navigation}
        />
      </View>
    )
  }
}

export default UserTag