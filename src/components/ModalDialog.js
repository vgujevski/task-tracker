import React, {Component} from 'react';
import {
        Modal, View, Text, 
        Alert, StyleSheet, 
        Button, TextInput, TouchableHighlight } from 'react-native';

import { addTask } from '../storage/database'

export default class ModalDialog extends Component{
    
    state = {
        modalVisible: false,
        nameInput: '',
    }

    handleNameInput = (nameInput) => {
        this.setState({nameInput})
    }

    componentWillReceiveProps(nextProps){
        this.setState({modalVisible: nextProps.show});
    }

    dismissDialog = (hasNewData) => {
        this.setState({modalVisible: this.state.modalVisible ? false : true, nameInput: ''})
        this.props.toggle(hasNewData)
    }

    addTask = () => {
        // Add Task
        if(this.state.nameInput !== ''){
            addTask(this.state.nameInput).then(response => {
                console.log(`task added id: ${response}`);
                this.dismissDialog(true)       
            }).catch(error => {
                console.log(error);
                this.dismissDialog(false)
                alert('error')     
            })
        }else{
            alert('name too short')
            // display error msg 'name is too short'
        }       
    }

    render(){
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={()=>{

                }}
            >
                <View style={styles.container}>
                    <View style={styles.fragment}>
                        <TextInput
                            style={styles.taskNameInput}
                            onChangeText={this.handleNameInput}
                            value={this.state.nameInput}
                            keyboardType='default'
                            placeholder='enter name'
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                style={styles.button}
                                onPress={this.dismissDialog}>
                                <Text>Cancel</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.button}
                                onPress={this.addTask}>
                                <Text>Add</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    taskNameInput: {
        width: '50%',
        fontSize: 16,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fragment: {
        width: '70%',
        //backgroundColor: '#BDBDBD',
        backgroundColor: '#66bb6a',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderWidth: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        width:'30%',
        margin: 4,
    },


})