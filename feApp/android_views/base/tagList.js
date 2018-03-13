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
  Image
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

const ip = require('../common/config').ip

class TagItem extends Component{
  constructor(props){
    super(props)
    this.state = {
      following: false,
      tag: this.props.tag
    }
  }

  render(){
    return(
      <View style={styles.tagWrapper}>
        <View
          style={styles.left}
        >
          <Image
            style={styles.tagImg}
          />
        </View>

        <TouchableOpacity
          style={styles.right}
        >
          <View style={{flex: 1, position: 'relative', justifyContent: 'center'}}>
            <Text style={styles.top}>GitHub</Text>
            <Text style={styles.bottom}>524人关注·3977篇文章</Text>
            {
              this.state.following ?
                <Text style = {styles.following}>
                  <Icon
                    name="check"
                    color="#4f91d0"
                    size={12}
                  />
                  已关注
                </Text>
                :
                <Text style = {styles.notFollow}>
                  <Icon
                    name="plus"
                    color="#4f91d0"
                    size={12}
                  />
                  关注
                </Text>
            }
          </View>
        </TouchableOpacity>

      </View>
    )
  }
}



class TagList extends Component{
  constructor(props){
    super(props)
  }

  _renderItem = ({item}) => (
    <TagItem
      tag = {item}
      navigation = {this.props.navigation}
    />
  );


  render(){
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <FlatList
          data={[{a:1},{b: 1}, {c: 1}]}
          renderItem = {this._renderItem}
          onEndReachedThreshold={0.1}
          // onEndReached={this._loadMoreData.bind(this)}
          // onRefresh={}
          refreshing={false}
        />
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
    lineHeight: 30,
    fontSize: 16,
    color: 'black'
  },
  bottom: {
    height: 30,
    lineHeight: 30
  }
})

export default TagList
