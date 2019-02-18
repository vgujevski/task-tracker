import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { AreaChart, XAxis, Grid, BarChart } from 'react-native-svg-charts'
import dateFns from 'date-fns'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'

const dummyData = [{
  id: 1,
  date: 1549497363000,
  interval: 1767998
}, {
  id: 2,
  date: 1549356564000,
  interval: 1467605
}, {
  id: 3,
  date: 1549473887000,
  interval: 8480212
}, {
  id: 4,
  date: 1549398168000,
  interval: 2378873
}, 
{
  id: 5,
  date: 1549355718000,
  interval: 1690003
}, {
  id: 6,
  date: 1549490312000,
  interval: 5446984
}, {
  id: 7,
  date: 1549524910000,
  interval: 9097419
}, {
  id: 8,
  date: 1549434399000,
  interval: 7961428
}, {
  id: 9,
  date: 1549483238000,
  interval: 3720048
},
{
  id: 10,
  date: 1549373096000,
  interval: 1105087
}, 
//{
//   id: 11,
//   date: "1549434955",
//   interval: 9255946
// }, {
//   id: 12,
//   date: "1549466942",
//   interval: 5888552
// }, {
//   id: 13,
//   date: "1549423302",
//   interval: 5083379
// }, {
//   id: 14,
//   date: "1549332316",
//   interval: 1041010
// }, {
//   id: 15,
//   date: "1549245813",
//   interval: 1691599
// }, {
//   id: 16,
//   date: "1549250513",
//   interval: 6257362
// }, {
//   id: 17,
//   date: "1549315377",
//   interval: 2730338
// }, {
//   id: 18,
//   date: "1549277588",
//   interval: 4728636
// }, {
//   id: 19,
//   date: "1549489410",
//   interval: 1146567
// }, {
//   id: 20,
//   date: "1549489631",
//   interval: 2063690
// }
]

// XXh:XXm
_convertInterval = () => {
  return ""
}
class TaskStats extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('taskTitle', 'TaskDetails'),
    }
  }
    
    render() {

      const fill = 'rgb(134, 65, 244)'
      const data = [15, 35, 2, 7, 21]

      return (
        <View style={styles.container}>
          <View style={styles.chartContainer}>
            <BarChart
              style={{ height: 200}}
              data={ dummyData }
              yAccessor={({item}) => item.interval}
              svg={{ fill }}
              contentInset={{ top: 30, bottom: 30 }}
            >
                <Grid/>
            </BarChart>
            {/* <AreaChart
              style={{flex: 1}}
              data={dummyData}
              yAccessor={ ({item}) => item.interval}
              xAccessor={ ({item}) => item.date}
              xScale= { scale.scaleTime }
              contentInset={{ top: 10, bottom: 10 }}
              svg={{ fill: 'rgba(134, 65, 244, 0.5)' }}
              curve={ shape.curveLinear }
            >
              <Grid/>
            </AreaChart> */}
            {/* <XAxis
              data={ dummyData }
              svg={{
                fill: 'black',
                fontSize: 8,
                fontWeight: 'bold',
                rotation: 20,
                originY: 30,
                y: 5,
              }}
              xAccessor={ ({ item }) => item.date}
              xScale= { scale.scaleTime }
              numberOfTicks={6}
              style={{ marginHorizontal: -15, height: 20 }}
              contentInset={{ left: 10, right: 25 }}
              formatLabel={ (value) => dateFns.format(value, 'HH:mm') }
            /> */}
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statsColumnContainer}>
              <View style={styles.statsRowContainer}>
                <Text style={styles.label}>Today:</Text>
                <Text>Time spent</Text>
              </View>
              <View style={styles.statsRowContainer}>
                <Text style={styles.label}>Week:</Text>
                <Text>Time spent</Text>
              </View>
              <View style={styles.statsRowContainer}>
                <Text style={styles.label}>Month:</Text>
                <Text>Time spent</Text>
              </View>
              <View style={styles.statsRowContainer}>
                <Text style={styles.label}>Total:</Text>
                <Text>Time spent</Text>
              </View>
            </View>
            {/* <Text>task statistics</Text>
            <Text>{dateFns.format(dummyData[1].date, 'DD:MM:YYYY')}</Text>
            <Text>{dateFns.format(1541769852 * 1000, 'DD:MM:YYYY')}</Text> */}
          </View>
        </View>
        
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    flexDirection: 'column',
    //justifyContent: 'center',
  },
  chartContainer: {
    height: 200, 
    padding: 20,
    
  },
  statsContainer: {
    marginTop:30,
    backgroundColor: '#E5E5E5',
    marginLeft: 30,
    marginRight: 30,
    
  },
  statsColumnContainer: {
    flexDirection:'column',
  },
  statsRowContainer: {
    flexDirection:'row',
  },
  label: {
    width:'20%',
    textAlign: 'right',
  },
  time: {
    width:'70%',
  }, 
})

export default TaskStats