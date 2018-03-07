/**
 * Created by linGo on 2018/2/26.
 */


import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} from 'react-native';

class Edit extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return(
      <View>
        <View style={styles.itemWrapper}>
          <Text style={styles.left}>
            头像
          </Text>
          <Text style={styles.right}>
            <Image
              source= {require('../../resource/image/mying.png')}
              style = {styles.userProtrait}
            />
          </Text>
        </View>


        <View style={styles.itemWrapper}>
          <Text style={styles.left}>
            姓名
          </Text>
          <Text style={styles.right}>
            935839596
          </Text>
        </View>

        <View style={styles.itemWrapper}>
          <Text style={styles.left}>
            公司
          </Text>
          <Text style={styles.right}>
            bat
          </Text>
        </View>

        <View style={styles.itemWrapper}>
          <Text style={styles.left}>
            职位
          </Text>
          <Text style={styles.right}>
            前端
          </Text>
        </View>
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
    height: 30,
    lineHeight: 30,
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
  }
})

export default Edit