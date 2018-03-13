/**
 * Created by linGo on 2018/3/11.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import TagList from '../base/tagList'

const ip = require('../common/config').ip

class MyTag extends Component{
  constructor(props){
    super(props)
    this.state={
      tagList: [],
      active: 'my'
    }
  }

  _refresh(){

  }

  _showMy(){
    this.setState({active: 'my'})

  }

  _showAll(){
    this.setState({active: 'all'})
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={styles.top}>
          <View style={styles.tabWrapper}>
            <Text style={[styles.tab, this.state.active==='all'?styles.select:{} ]}
                  onPress={this._showAll.bind(this)}
            >全部标签</Text>
            <Text style={[styles.tab, this.state.active==='my'?styles.select:{} ]}
                  onPress={this._showMy.bind(this)}
            >已关注标签</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <TagList
            tagList={this.state.tagList}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  top: {
    height: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  tabWrapper: {
    margin:10,
    borderColor: '#388bec',
    borderWidth: 2,
    flexDirection: 'row',
    borderRadius: 5
  },
  tab: {
    color: '#388bec',
    textAlign: 'center',
    flex: 1,
    height: 25,
    lineHeight: 25,
    backgroundColor: 'white'
  },
  select: {
    backgroundColor: '#388bec',
    color: 'white'
  }

})

export default MyTag