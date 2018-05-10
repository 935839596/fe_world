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
  Image,
  EventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Home from './android_views/home/home'
import Discussion from './android_views/discussion/discussion'
import My from './android_views/my/my'

import EM from 'EventEmitter'

const navigationEvents = new EM();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      tabBarHeight: 50
    };
  }

  //navigation路由变化监听函数
  handleNavigationStateChange(prevState, newState, action){

    var index = newState.routes.length-1;
    index = index<0?0:index;
    if(newState && newState.routes.length === 1){
      this._handleTabBar(true)
      navigationEvents.emit(`onFocus:Home`)
      navigationEvents.emit(`onFocus:Discussion`)
    }else{
      this._handleTabBar(false)
    }
    console.log('routeName:', newState.routes[index].routeName)
    console.log('actionType:', action['type'])
    if('Navigation/BACK' == action['type'])
      navigationEvents.emit(`onFocus:${newState.routes[index].routeName}`)
  }



  render() {



    return (
        <TabNavigator barTintColor="#fff"
                      tabBarStyle={{height: this.state.tabBarHeight, overflow: 'hidden'}}
                      sceneStyle={{paddingBottom: this.state.tabBarHeight}}
        >
          <TabNavigator.Item
              title="文章"
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
            {this._renderView()}
          </TabNavigator.Item>
          <TabNavigator.Item
              title="个人中心"
              selected={this.state.selectedTab === 'my'}
              renderIcon={() => <Image style={styles.tabImg} source={require('./resource/image/my.png')} />}
              renderSelectedIcon={() => <Image style={styles.tabImg} source={require('./resource/image/mying.png')} />}
              onPress={() => {
                this.setState({
                  selectedTab: 'my'
                });
              }}>
            {this._renderView()}
          </TabNavigator.Item>
        </TabNavigator>
    );
  }

  _forceUpdate(){
    console.log('update')
    this.forceUpdate()
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
            },
            refreshApp: () => {
              navigationEvents.emit(`onFocus:Home`)
              navigationEvents.emit(`onFocus:Discussion`)
              navigationEvents.emit(`onFocus:My`)
            },
            navigationEvents: navigationEvents
          }}
          onNavigationStateChange={this.handleNavigationStateChange.bind(this)}
        />;
        break;
      case 'discussion':
        view = <Discussion
          screenProps={{
            tabBar: {
              hide: () => this._handleTabBar(false),
              show: () => this._handleTabBar(true)
            },
            refreshApp: ()=>{
              navigationEvents.emit(`onFocus:Home`)
              navigationEvents.emit(`onFocus:Discussion`)
              navigationEvents.emit(`onFocus:My`)
            },
            navigationEvents: navigationEvents
          }}
          onNavigationStateChange={this.handleNavigationStateChange.bind(this)}
        />;
        break;
      case 'my':
        view = <My
          screenProps={{
            tabBar: {
              hide: () => this._handleTabBar(false),
              show: () => this._handleTabBar(true)
            },
            refreshApp: () => {
              navigationEvents.emit(`onFocus:Home`)
              navigationEvents.emit(`onFocus:Discussion`)
              navigationEvents.emit(`onFocus:My`)
            },
            navigationEvents: navigationEvents
          }}
          onNavigationStateChange={this.handleNavigationStateChange.bind(this)}
        />;
        break;
      default :
        view = <View>文章</View>;
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

