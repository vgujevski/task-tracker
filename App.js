import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';

import TaskListScreen from './src/TaskListScreen'
import StatsScreen from './src/StatsScreen'
import TaskStats from './src/TaskStats'

const TabNavigator = createMaterialTopTabNavigator({
  Tasks: TaskListScreen,
  Statistics: StatsScreen,
}, {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    labelStyle: {
      fontSize: 14,
    },
    style: {
      backgroundColor: '#757575',
    },
    showIcon: true,
    showLabel: false,
  },
});

const MainStack = createStackNavigator({
  TaskStats: {
    screen: TaskStats
  },
  Tab: {
    screen: TabNavigator,
  }
}
,{
  initialRouteName: "Tab",
});



export default createAppContainer(MainStack);

