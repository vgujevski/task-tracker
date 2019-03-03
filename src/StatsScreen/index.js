import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-svg-charts'

import { allTasksTest } from '../utils/test_dataset'
import { getIntervalSum } from '../utils/misc'
const colors = [ 
  'rgb(255, 102, 102)',
  'rgb(255, 178, 102)',
  'rgb(255, 255, 102)',
  'rgb(102, 255, 255)',
  'rgb(102, 178, 255)',
  'rgb(102, 102, 255)']

/**
 *  @param list of task objects
 *  @returns list of modified task object {id, name, sumOfIntervals}
 */

const getChartTaskList = (taskList, size) => {
  let chartTaskList = []

  for(i=0;i<taskList.length;i++){
    chartTaskList.push({
      id: taskList[i].id,
      name: taskList[i].name,
      timeSpent: getIntervalSum(taskList[i])
    })
  }

  let sorted = chartTaskList.sort(function(a, b) {
    return b.timeSpent - a.timeSpent
  })

  let sized = []

  for(i=0;i<sorted.length;i++){
    sized.push(sorted[i])
    if(sized.length >= size){
      break;
    }
  }
  

  return sized
}

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

  state = {
    chart_size: 5, // top 3 or top 5,
    data: allTasksTest,
    //data: [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50],
  }
 
    render() {
      //const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)
      
      const pieData = getChartTaskList(this.state.data, this.state.chart_size)
            .map((value, index) => ({
              value: value.timeSpent,
              svg: {
                fill: colors[index],
                onPress: () => alert(`${value.name}, ${colors[index]}`)
              },
              key: `pie-${index}`,
            })) 
      return (
        <View style={styles.container}>
          <PieChart
            style={styles.chart_container}
            data={pieData}
            />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  chart_container: {
    marginTop: 10,
    height: 200,
  },
  tabIcon:{

  }
})

export default StatsScreen