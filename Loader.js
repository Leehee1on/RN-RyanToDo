import React from 'react';
import {StyleSheet,Text,ImageBackground,View,StatusBar} from 'react-native'

export default Loader = () => {

  return(
    <View style={styles.container}>
      <ImageBackground style={{width:'100%',height:'100%'}} source={require("./assets/RYAN005.png")} resizeMode="cover" >
        <StatusBar barStyle="dark-content"/>
        <View style={styles.textContainer}>
          <Text style={styles.text}>RYAN To Do !</Text>
        </View>
        <View style={styles.textContainer}></View>
      </ImageBackground>
    </View>
  )
}

const styles= StyleSheet.create({
  container: {
    flex:1,
  },
  textContainer: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
  },
  text:{
    fontSize:30,
    fontWeight:'200'
  }
  
})