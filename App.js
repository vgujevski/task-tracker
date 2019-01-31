import React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';

import TaskListScreen from './src/TaskListScreen';
import StatsScreen from './src/StatsScreen';

const TabNavigator = createMaterialTopTabNavigator({
  Tasks: TaskListScreen,
  Statistics: StatsScreen,
}, {
  // labelStyle: {
  //   fontSize: 12,
  // },
  // style: {
  //   backgroundColor: '#607D8B',
  // },
  tabBarOptions: {
    labelStyle: {
      fontSize: 14,
    },
    style: {
      //backgroundColor: '#607D8B',
      backgroundColor: '#757575',
    },
  }
});

export default createAppContainer(TabNavigator);

