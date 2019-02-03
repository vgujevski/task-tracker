import React from 'react';
import { Text, View, FlatList, StyleSheet, TouchableHighlight } from 'react-native';
import TaskListItem from './TaskListItem.js';
import Icon from 'react-native-vector-icons/MaterialIcons'

import { getTaskList } from '../storage/database';

import ModalDialog from '../components/ModalDialog'

const testData = [
    {
        id: '001',
        name: 'gym',
        intervals: [555666888, 111333777, 777111222, 444222000],
    },
    {
        id: '002',
        name: 'reading',
        intervals: [777666999, 111333777, 777111222, 444222000],
    },
    {
        id: '003',
        name: 'cooking',
        intervals: [555111888, 111333111, 777111222, 111222000],
    }
]

class TaskListScreen extends React.Component {

    state = {
        data: [],
        modalVisible: false
    }

    componentWillMount(){
       this.refreshData(); 
    }

    handleTaskListClick = (id) => {
        alert('task clicked')
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

    render() {
      return (
        <View style={styles.container}>
            
          <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => 
            <TaskListItem onClick={this.handleTaskListClick}  data={item}/>}
          />
          <TouchableHighlight
                onPress={this.handleAddTaskClick} 
                style={styles.buttonContainer}>
              <Icon name="add-box" size={40} color="black" />
          </TouchableHighlight>
          <ModalDialog show={this.state.modalVisible} toggle={this.toggleModal}/>
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