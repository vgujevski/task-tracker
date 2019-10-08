import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { AreaChart, XAxis } from 'react-native-svg-charts'
import Icon from 'react-native-vector-icons/MaterialIcons'
import dateFns from 'date-fns'
import * as shape from 'd3-shape'
import { HeaderBackButton } from 'react-navigation'

import { addTaskInterval, findTaskById, editTaskName, deleteTaskWithId, addGoal, getTaskGoals, deleteGoal, addProgressToGoal } from '../storage/database'
import { today, thisWeek, thisMonth, thisYear, fullSet } from '../utils/test_dataset'
import { hoursToMills } from '../utils/misc'
import { getTimeSpentToday, getTimeSpentWeek, getTimeSpentMonth, getTimeSpentTotal, testFunction } from '../utils/misc'
import { fonts } from '../utils/styles/font_styles'
import { colors } from '../utils/styles/colors'
import Timer from './TimerComponent'
import Goals from './GoalList'
import ModalDialog from '../components/ModalDialog'
import { ToolbarAndroid } from 'react-native-gesture-handler';

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
      headerLeft: (
        <HeaderBackButton onPress={
          // addTaskInterval if timer is running
          // navigate to previous screen
          navigation.getParam('handleBackButton') 
        }/>
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
    //hasNewData: false, // set to true if task name was edited
    timerStarted: false,
    data: null,
    goalsData: [],
    modalDialogVisible: false,
    modalDialogMode: '',
    backPressed: false, // passed to Timer as prop
    goalPressed: '', // id of last goal that was pressed on
    dailyGoalActive: false, // passed to ModalDialog, only one can be active at a time
    weeklyGoalActive: false, // passed to ModalDialog, only one can be active at a time
    monthlyGoalActive: false, // passed to ModalDialog, only one can be active at a time
  }

  componentWillMount(){
    console.log('TaskStats componentWillMount called');
    
    this.setState({
      timerStarted: this.props.navigation.getParam('startTimer', false),
      data: this.props.navigation.getParam('data', null)
    }, () => {

    })
    
  }

  componentDidMount(){
    console.log('TaskStats componentDidMount called');
    this._updateGoalsData()
    console.log(`TaskState goalsData state: ${this.state.goalsData}`);
    this.props.navigation.setParams({toggleDeleteTaskDialog: this._toggleDeleteTaskDialog})
    this.props.navigation.setParams({toggleRenameTaskDialog: this._toggleRenameTaskDialog})
    this.props.navigation.setParams({handleBackButton: this._handleBackButton})
  }

  _toggleDeleteTaskDialog = () => {
    this.setState({
      modalDialogMode: 'confirmDeleteTask',
     })
    this._toggleDialog()
  }

  _toggleRenameTaskDialog = () => {
    this.setState({modalDialogMode: 'edit'})
    this._toggleDialog()
  }

  _toggleNewGoalDialog = () => {
    this.setState({modalDialogMode: 'addGoal'})
    console.log(`toggleNewGoalDialog called: daily ${this.state.dailyGoalActive}, weekly ${this.state.weeklyGoalActive}, montly ${this.state.monthlyGoalActive}`);
    
    this._toggleDialog()
  }

  _toggleDeleteGoalDialog = () => {
    this.setState({
      modalDialogMode: 'confirmDeleteGoal',
    })
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
    console.log('TaskStats index: addTaskInterval called: ' + interval);
    addTaskInterval(this.state.data.id, interval).then(response => {
      // if task has active goal/s, update then with last interval
      if(this.state.goalsData){
        this._addGoalProgress(interval)
      }else{
        console.log('no goals to update'); 
        this._updateData()
      }  
    }).catch(e => {
      console.log(e); 
    })
  }

  _addGoalProgress = (interval) => {
    console.log('TaskStats index: addGoalPogress called');
    // update all goals from this.state.goalsData
    
    // TODO
    this._updateData()
  }

  _handleBackButton = () => {
    // pass new props to Timer component
    
    this.setState({
      backPressed: true
    }, () => {
      // navigate back to previous screen
      this.props.navigation.navigate('Tab')
    })
  }

  _handleGoalLongPress = (id) => {
    this.setState({goalPressed: id})
    this._toggleDeleteGoalDialog()
  }

  _updateData = () => {
    console.log('TaskStats: updateData called.');
    
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

  _updateGoalsData = () => {
    console.log('TaskStats: updateGoalsData called.');
    
    getTaskGoals(this.state.data.id).then(response => {
      //console.log('updateGoalData response: ' + JSON.stringify(response));

      // get goals data
      // check if its new day/week/month
      // reset progress if needed
      // update state
       

      this.setState({
        goalsData: response
      }, () => {
        // Checking which goals are already active
        var daily = false
        var weekly = false
        var monthly = false

        response.forEach(goal => {
          if(goal.type == 'daily'){
            daily = true
          }else if(goal.type == 'weekly'){
            weekly = true
          }else if(goal.type == 'monthly'){
            monthly = true
          }
        });

        this.setState({
          dailyGoalActive: daily,
          weeklyGoalActive: weekly,
          monthlyGoalActive: monthly,
        }, () => {
        })
      })
    }).catch(error => {
      console.log(error);
    })
  }

  _onDialogNegative = () => {
    this._toggleDialog()
  }

  _onDialogPositive = (data) => {
    console.log(`TaskStats: _onDialogPositive mode: ${this.state.modalDialogMode} data: ${data}`);
    
    //this._toggleDialog()
    switch (this.state.modalDialogMode) {
      case 'confirmDeleteTask':
        deleteTaskWithId(this.state.data.id).then(response => {
          console.log(response); 
          this.props.navigation.navigate('Tasks', {newData: true})
        }).catch(error => {
          console.log(error);         
        })        
        break;
      case 'confirmDeleteGoal':
        // delete goal from database
        deleteGoal(this.state.goalPressed).then(response => {
        // updating goal data
        console.log('TaskStats: goal deleted');
        
        this._updateGoalsData()
        }).catch(error => {
          console.log(error);  
        })
        this._toggleDialog()
        break;
      case 'edit':
        editTaskName(this.state.data.id, data.newName).then(response => {
          this._updateData()
          this._toggleDialog()
          console.log(response);
        }).catch(error => {
          alert(error)  
        })
        break;
      case 'addGoal':
        // Validate data.type, 
        // Add new goal to database

        var newGoal = {
          taskId: this.state.data.id,
          type: data.type,
          target: hoursToMills(data.target),
          reminder: false,
        }

        addGoal(newGoal).then(response => {
            console.log(`new goal added: ${response}`);
            
            this._updateGoalsData()
        }).catch(error => {
            console.log(error);    
        })
         
        this._toggleDialog()
        //alert('addGoal ' + JSON.stringify(data))
        //alert(JSON.stringify(newGoal))
        break;
    }
    
  }

  //TODO stop timer on backPressed
    
    render() {
      const fill = 'rgb(175, 189, 217)' // #afbdd9
      const radioButtons = {
              daily: this.state.dailyGoalActive,
              weekly: this.state.weeklyGoalActive,
              monthly: this.state.monthlyGoalActive,
      }

      return (
        <View style={styles.container}>

          <ModalDialog
            mode={this.state.modalDialogMode}
            show={this.state.modalDialogVisible}
            positive={this._onDialogPositive}
            negative={this._onDialogNegative}
            
            daily={this.state.dailyGoalActive}
            weekly={this.state.weeklyGoalActive}
            monthly={this.state.monthlyGoalActive}
            />

          <View style={styles.chartContainer}>
            <AreaChart
              style={{ height: 100}}
              data={ fullSet } //this.state.data.intervals
              yAccessor={({item}) => item.interval}
              svg={{ fill }}
              curve = { shape.curveNatural }
              contentInset={{ top: 10, bottom: 0 }}
            >
                {/* <Grid/> */}
            </AreaChart>
          </View>

          <Timer
            timerStarted={this.state.timerStarted}
            addInterval={this._addTaskInterval}
            backPressed={this.state.backPressed}
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

            <Goals 
              onPress={this._toggleNewGoalDialog}
              toggleDeleteGoalDialog={this._handleGoalLongPress}
              data={this.state.goalsData}
              daily={this.state.dailyGoalActive}
              weekly={this.state.weeklyGoalActive}
              monthly={this.state.monthlyGoalActive}
            />
          </View>
        </View>
        
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: colors.mainLight,
    paddingLeft: 20,
    paddingRight: 20,
  },
  chartContainer: {
    height: 100, 
    paddingTop: 0,
    marginBottom: 10,  
  },
  statsContainer: {
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
