/**
 * Created by linGo on 2018/3/11.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableOpacity,
  Image
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
      active: 'my',
      myUserId: this.props.navigation.state.params.userId,
      loading: false
    }

    this._refresh()
  }

  _refresh(){
    this._showMy()
  }

  _showMy(){
    if(this.state.loading) return
    this.setState({
      loading: true
    })
    var url = ip + '/common/user_tags?id=' + this.state.myUserId;
    fetch(url)
      .then( res=>res.json())
      .then( data => {
        if(data.ret === 0) {
          console.log('my', data)
          this.setState({
            tagList: data.list,
            loading: false
          })
        }
        else{
          this.setState({
            tagList: data.list,
            loading: false
          })
        }
      })

    this.setState({active: 'my'})
  }

  _showAll(){
    if(this.state.loading) return
    this.setState({
      loading: true
    })
    var url = ip + '/common/all_tags';
    fetch(url)
      .then( res=>res.json())
      .then( data => {
        if(data.ret === 0) {
          console.log('showAll',data)
          this.setState({
            tagList: data.list,
            loading: false
          })
        }
        else{
          this.setState({
            tagList: data.list,
            loading: false
          })
        }
      })
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
            refresh={this.state.active=='all'?this._showAll.bind(this):this._showMy.bind(this)}
          />
        </View>
        {
          this.state.loading?
            <View style={{
              flex: 1,
              // backgroundColor: 'rgba(0,0,0, .5)',
              justifyContent:'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0, bottom: 0, right: 0, left: 0,
              zIndex: 100
            }}>
              {/*<Text style={{color:'white',fontSize: 20}}>加载中...</Text>*/}
              <Image
                source={require('../../resource/image/loading.gif')}
                style={{width: 50, height: 50}}
              />
            </View>
            :
            <Text></Text>
        }
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