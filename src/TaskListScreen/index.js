import React from 'react';
import { Text, View, FlatList, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import TaskListItem from './TaskListItem.js';
import Icon from 'react-native-vector-icons/MaterialIcons'

import { getTaskList, addTask } from '../storage/database';

import ModalDialog from '../components/ModalDialog'

class TaskListScreen extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'Statistics Label',
        tabBarIcon: ({focused, tintColor }) => (
          focused ? 
          <Icon name="reorder" size={26} color="black" />
          :
          <Icon name="reorder" size={26} color="black" />
        ),
      }

    state = {
        data: [],
        modalVisible: false,
        modalDialogMode: '',
    }

    componentWillMount(){
       this.refreshData(); 
    }

    componentWillReceiveProps(){
        this.refreshData();
    }

    handleAddTaskClick = () => {
        this.toggleModal()
    }

    toggleModal = (newDataAdded) => {
        if(newDataAdded){
            this.setState({
                modalVisible: this.state.modalVisible ? false : true
            })
            this.refreshData()
        }else{
            this.setState({
                modalVisible: this.state.modalVisible ? false : true
            })
        }      
    }

    refreshData = () => {
        getTaskList().then( response => {
            this.setState({ data: response })
        }).catch(error => {
            console.log(error) 
        })
    }

    _renderItem = ({item}) => (
            <TaskListItem   
                data={item}
                clickListener={this._onPressItem}
            />     
    )

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (data, startTimer) => {
        this.props.navigation.navigate('TaskStats', {
           taskTitle: data.name,
           data: data,
           startTimer: startTimer, 
        })
    }

    _addTaskDialogPositive = (name) => {
        // check string length, display error msg if needed.

        addTask(name).then(response => {
            console.log(response);                     
            this.toggleModal(true)
        }).catch(error => {   
            console.log(error);
            this.toggleModal()       
        })     
    }

    _addTaskDialogNegative = () => {
        this.toggleModal()
    }



    render() {
      return (
        <View style={styles.container}>          
          <FlatList
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
          <TouchableHighlight
                onPress={this.handleAddTaskClick} 
                style={styles.buttonContainer}>
              <Icon name="add-box" size={40} color="black" />
          </TouchableHighlight>
          <ModalDialog 
            show={this.state.modalVisible} 
            toggle={this.toggleModal}
            mode={'add'}
            positive={this._addTaskDialogPositive}
            negative={this._addTaskDialogNegative}
            />
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#607D8B',
        backgroundColor: '#757575',
    },
    buttonContainer: {
        height: '10%',
        width: '100%',
        //backgroundColor: '#607D8B',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default TaskListScreen;