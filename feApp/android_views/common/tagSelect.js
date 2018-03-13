/**
 * Created by linGo on 2018/3/11.
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

class Tag extends Component{
  constructor(props){
    super(props)
    this.state = {
      choose: false,
      tag: this.props.tag
    }
  }

  _choose(){
    if(!this.state.choose){
      this.props.chooseTag(this.state.tag)
    }else{
      this.props.cancelTag(this.state.tag)
    }
    this.setState({
      choose: !this.state.choose
    })
  }

  render(){
    return(
      <View style={[styles.tagWrapper, this.state.choose?{borderColor:'blue'}:{}]}>
        <Text style={[styles.tagText, this.state.choose?{color:'blue'}:{color: 'grey'}]}
              onPress={this._choose.bind(this)}
        >{this.state.tag}</Text>
      </View>
    )
  }
}
const tagList = ['vue', 'react', 'vuex', 'vue-router', 'react-native', 'webpack', 'jquery', 'babel', 'http', 'https']

class TagSelect extends Component{
  constructor(props){
    super(props)
    this.state = {
      list: []
    }
  }

  chooseTag(tag){
    this.state.list.push(tag)
    console.log('after choose', this.state.list)
  }

  cancelTag(tag){
    var index = this.state.list.indexOf(tag)
    this.state.list.splice(index, 1)
    console.log('after cancel', this.state.list)
  }

  save(){
    var url = ip + '/my/add_interest'
    console.log(url)
    fetch(url,{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tag: this.state.list
      })
    }).then( res=> res.json())
      .then(data => {
        console.log(data)
        if(data.ret === 0){
          this.props.navigation.popToTop();
        }else if(data.ret===-1){
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
        }else{
          Alert.alert(
            '警告',
            data.message,
            [
              {text: 'ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        }

      })
  }

  render(){
    let list = [];
    tagList.forEach((tag) => {
      list.push(
        <Tag
          tag = {(tag)}
          chooseTag={this.chooseTag.bind(this)}
          cancelTag={this.cancelTag.bind(this)}
        />
      );
    });
    return(
      <View style={{flex: 1,backgroundColor: 'white',alignItems: 'center', paddingLeft:10, paddingRight: 10}}>
        <View style={styles.header}>
          <Text
            style={styles.cancel}
            onPress={()=>{this.props.navigation.popToTop()}}
          >
            跳过
          </Text>
          <Text
            style={styles.title}
          >

          </Text>
          <Text
            style={styles.done}
            onPress={this.save.bind(this)}
          >
            保存
          </Text>
        </View>

        <View style={styles.top}>
          <Text style={{fontSize: 15}}>请选择感兴趣的标签</Text>
        </View>
        <View style={styles.tagList}>
          {list}
        </View>
      </View>
    );
  }
}

const height = 30;
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
  done: {
    width: 50,
    textAlign: 'center',
    color: '#388bec'
  },

  top: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20
  },

  tagList:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },

  tagWrapper: {
    marginRight: 10,
    marginBottom: 8,
    marginTop: 10,
    height: height,
    lineHeight: height,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    minWidth: 45
  },
  tagText: {
    height: height,
    lineHeight: height,
    textAlign: 'center',
    fontSize: 18,
    color: 'grey'
  }
})

export default TagSelect