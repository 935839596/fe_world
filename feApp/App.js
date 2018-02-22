/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Home from './android_views/home/home'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      tabBarHeight: 50
    };
  }

  //navigation路由变化监听函数
  handleNavigationStateChange(prevState, newState){
    // console.log(newState)
    if(newState && newState.routes.length === 1){
      this._handleTabBar(true)
    }else{
      this._handleTabBar(false)
    }
  }

  render() {
    return (
        <TabNavigator barTintColor="#fff"
                      tabBarStyle={{height: this.state.tabBarHeight, overflow: 'hidden'}}
                      sceneStyle={{paddingBottom: this.state.tabBarHeight}}
        >
          <TabNavigator.Item
              title="首页"
              selected={this.state.selectedTab === 'home'}
              renderIcon={() => <Image style={styles.tabImg} source={ require('./resource/image/home.png')} />}
              renderSelectedIcon={() => <Image style={styles.tabImg} source={ require('./resource/image/homeing.png')} />}
              onPress={() => {

                this.setState({
                  selectedTab: 'home'
                });
              }}>
            {this._renderView()}
          </TabNavigator.Item>
          <TabNavigator.Item
              title="讨论区"
              selected={this.state.selectedTab === 'discussion'}
              renderIcon={() => <Image style={styles.tabImg} source={require('./resource/image/discussion.png')} />}
              renderSelectedIcon={() => <Image style={styles.tabImg} source={require('./resource/image/discussioning.png')} />}
              onPress={() => {
                this.setState({
                  selectedTab: 'discussion'
                });
              }}>
            {<Text>saf</Text>}

          </TabNavigator.Item>
          <TabNavigator.Item
              title="我的"
              selected={this.state.selectedTab === 'my'}
              renderIcon={() => <Image style={styles.tabImg} source={require('./resource/image/my.png')} />}
              renderSelectedIcon={() => <Image style={styles.tabImg} source={require('./resource/image/mying.png')} />}
              onPress={() => {
                this.setState({
                  selectedTab: 'my'
                });
              }}>
            {<Text>saf</Text>}
          </TabNavigator.Item>
        </TabNavigator>
    );
  }

  _handleTabBar(state) {
    this.setState({
      tabBarHeight: state ? 49 : 0
    });
  }

  _renderView(){
    var view = null;
    switch (this.state.selectedTab){
      case 'home':
        view = <Home
          screenProps={{
            tabBar: {
              hide: () => this._handleTabBar(false),
              show: () => this._handleTabBar(true)
            }
          }}
          onNavigationStateChange={this.handleNavigationStateChange.bind(this)}
        />;
        break;
      case 'discussion':
        view = 讨论区;
        break;
      case 'my':
        view = <View>我的</View>
        break;
      default :
        view = <View>首页</View>;
        break;
    }
    return view;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabImg: {
    width: 25,
    height: 25
  }
});

