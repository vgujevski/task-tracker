import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { AreaChart, XAxis } from 'react-native-svg-charts'
import Icon from 'react-native-vector-icons/MaterialIcons'
import dateFns from 'date-fns'
import * as shape from 'd3-shape'

import { addTaskInterval, findTaskById, editTaskName, deleteTaskWithId } from '../storage/database'
import { today, thisWeek, thisMonth, thisYear, fullSet } from '../utils/test_dataset'
import { getTimeSpentToday, getTimeSpentWeek, getTimeSpentMonth, getTimeSpentTotal, testFunction } from '../utils/misc'
import { fonts } from '../utils/styles/font_styles'
import Timer from './TimerComponent'
import Goals from './GoalsComponent'
import ModalDialog from '../components/ModalDialog'

// XXh:XXm
_convertInterval = () => {
  return ""
}


class TaskStats extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text style={fonts.main_medium}>{navigation.getParam('taskTitle', 'TaskDetails')}</Text>
      ),
      headerRight: (
        <View style={{flexDirection: 'row'}}>

          <TouchableOpacity
            onPress={navigation.getParam('toggleRenameTaskDialog')} 
            style={styles.navBarButton}>
            <Icon name="edit" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigation.getParam('toggleDeleteTaskDialog')} 
            style={styles.navBarButton}>
            <Icon name="delete" size={30} color="black" />
          </TouchableOpacity>
        </View>   
      ),
    }
  }

  state = {
    timerStarted: false,
    data: null,
    modalDialogVisible: false,
    modalDialogMode: '',
  }

  componentWillMount(){
    this.setState({
      timerStarted: this.props.navigation.getParam('startTimer', false),
      data: this.props.navigation.getParam('data', null)
    })
  }

  componentDidMount(){
    this.props.navigation.setParams({toggleDeleteTaskDialog: this._toggleDeleteTaskDialog})
    this.props.navigation.setParams({toggleRenameTaskDialog: this._toggleRenameTaskDialog})
  }

  _toggleDeleteTaskDialog = () => {
    this.setState({modalDialogMode: 'confirm'})
    this._toggleDialog()
  }

  _toggleRenameTaskDialog = () => {
    this.setState({modalDialogMode: 'edit'})
    this._toggleDialog()
  }

  _toggleDialog = () => {
    if(this.state.modalDialogVisible){
      this.setState({
        modalDialogVisible: false
      })
    }else{
      this.setState({
        modalDialogVisible: true
      })
    }
  }

  _addTaskInterval = (interval) => {
    addTaskInterval(this.state.data.id, interval).then(response => {
      this._updateData()
    }).catch(e => {
      console.log(e); 
    })
  }

  _updateData = () => {
    findTaskById(this.state.data.id).then(response => {
      this.setState({
        data: response
      })
      this.props.navigation.setParams({taskTitle: response.name})
    }).catch(error => {
      console.log(error);
      //alert('error')
    })
  }

  _onDialogNegative = () => {
    // hide dialog
    this._toggleDialog()
  }

  _onDialogPositive = (newName) => {
    //this._toggleDialog()
    switch (this.state.modalDialogMode) {
      case 'confirm':
        deleteTaskWithId(this.state.data.id).then(response => {
          alert(response)
          this.props.navigation.navigate('Tasks', {newData: true})
        }).catch(error => {
          alert(error)        
        })        
        break;
      case 'edit':
        editTaskName(this.state.data.id, newName).then(response => {
          this._updateData()
          console.log(response);
        }).catch(error => {
          alert(error)  
        })
        break;
    }
    
  }

  //TODO stop timer on backPressed
    
    render() {
      const fill = 'rgb(175, 189, 217)' // #afbdd9

      return (
        <View style={styles.container}>

          <ModalDialog
            mode={this.state.modalDialogMode}
            show={this.state.modalDialogVisible}
            positive={this._onDialogPositive}
            negative={this._onDialogNegative}/>

          <View style={styles.chartContainer}>
            <AreaChart
              style={{ height: 150}}
              data={ fullSet } //this.state.data.intervals
              yAccessor={({item}) => item.interval}
              svg={{ fill }}
              curve = { shape.curveNatural }
              contentInset={{ top: 30, bottom: 0 }}
            >
                {/* <Grid/> */}
            </AreaChart>
          </View>

          <Timer 
            timerStarted={this.state.timerStarted}
            addInterval={this._addTaskInterval}
            />

          <View style={styles.statsContainer}>
            <View style={styles.statsColumnContainer}>
              <View style={styles.statsRowContainer}>
                <Text style={[styles.label, fonts.main_medium]}>today:</Text>
                <Text style={[styles.time, fonts.main_medium]}>{ getTimeSpentToday(this.state.data.intervals) }</Text>
              </View>
              <View style={styles.statsRowContainer}>
                <Text style={[styles.label, fonts.main_medium]}>week:</Text>
                <Text style={[styles.time, fonts.main_medium]}>{ getTimeSpentWeek(this.state.data.intervals) }</Text>
              </View>
              <View style={styles.statsRowContainer}>
                <Text style={[styles.label, fonts.main_medium]}>month:</Text>
                <Text style={[styles.time, fonts.main_medium]}>{ getTimeSpentMonth(this.state.data.intervals) }</Text>
              </View>
              <View style={styles.statsRowContainer}>
                <Text style={[styles.label, fonts.main_medium]}>total:</Text>
                <Text style={[styles.time, fonts.main_medium]}>{ getTimeSpentTotal(this.state.data.intervals)}</Text>
              </View>
            </View>

            <Goals/>
            {/* <Text>task statistics</Text>
            <Text>{dateFns.format(today[0].date * 1000, 'DD:MM:YYYY')}</Text>
            <Text>{dateFns.format(thisWeek[0].date * 1000, 'DD:MM:YYYY')}</Text>
            <Text>{dateFns.format(thisMonth[0].date * 1000, 'DD:MM:YYYY')}</Text>
            <Text>{dateFns.format(thisYear[0].date * 1000, 'DD:MM:YYYY')}</Text> */}
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
  },
  chartContainer: {
    height: 150, 
    paddingTop: 0,  
  },
  statsContainer: {
    marginTop:10,
    backgroundColor: '#E5E5E5',
    marginLeft: 0,
    marginRight: 0,
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
    textAlign: 'center',
  },
  navBarButton: {
    padding: 6,
    marginRight: 16,
  }, 
})

export default TaskStats
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