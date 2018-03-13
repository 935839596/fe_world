/**
 * Created by linGo on 2018/3/12.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native';

import ImageZoom from 'react-native-image-pan-zoom';
import Dimensions from 'Dimensions'

import Icon from 'react-native-vector-icons/FontAwesome';


const disWidth = Dimensions.get('window').width
const disHeight = Dimensions.get('window').height

console.log(disHeight)

class PicModal extends Component{
  constructor(props){
    super(props)
    this.state = {
      imageHeight: 0,
      imageWidth: 0,
      url: '',
      modalVisible: false
    }
  }



  componentWillReceiveProps(nextProps) {
    this.setState({
      modalVisible: nextProps.modalVisible,
      url: nextProps.url
    })
  }


  render(){
    return(
      <Modal
        visible={this.state.modalVisible}
        style={{backgroundColor: 'black'}}
        transparent={false}
      >

        <View
          style={{
            width: disWidth,
            // height: (disHeight>this.state.imageHeight?disHeight:this.state.imageHeight),
            height: disHeight,
            backgroundColor: 'black',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'scroll'
          }}
                   imageWidth={this.state.imageWidth}
                   imageHeight={this.state.imageHeight}
                   onClick={()=>{console.log('close')}}
        >
          <View style={{
            position: 'absolute',
            backgroundColor: 'black',
            borderRadius: 23,
            borderWidth: 1,
            top: 20,
            right: 15,
            zIndex: 1000
          }}>
            <Icon
              name="close"
              color="white"
              size={30}
              onPress={()=>{this.props.closePicModal()}}
            />
          </View>
          <Image style={[styles.contentImage, {width: this.state.imageWidth, height:this.state.imageHeight}]}
                 source={{uri: this.state.url}}
                 onLoadEnd={()=>{
                   Image.getSize(this.state.url, (width, height) => {
                     width = width>Dimensions.get('window').width ?
                       Dimensions.get('window').width
                       :
                       width
                     this.setState({
                       imageHeight: height,
                       imageWidth: width
                     })
                     console.log(this.state)
                   })
                 }}
          />
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  contentImage: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: 'black',
    resizeMode: 'contain',
    alignSelf: 'center'
  },
})

export default PicModal