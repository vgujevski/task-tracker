import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class StatsScreen extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Statistics Label',
    tabBarIcon: ({focused, tintColor }) => (
      focused ? 
      <Icon name="insert-chart" size={26} color="black" />
      :
      <Icon name="insert-chart" size={26} color="black" />
    ),
  }
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Statistics!</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {

  },
  tabIcon:{

  }
})

export default StatsScreen