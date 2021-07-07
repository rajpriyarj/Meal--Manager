import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
function BackgroundWaterMark({children}) {
  return (
    <View style={styles.container}>
      <ImageBackground
        width={50}
        imageStyle={styles.image}
        height={50}
        resizeMethod="resize"
        resizeMode="center"
        source={require('./../assets/meal.png')}
        style={styles.background}>
        {children}
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    opacity: 0.5,
  },
  background: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default BackgroundWaterMark;
