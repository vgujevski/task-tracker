import React, {Component} from 'react';
import {
        Modal, View, Text, StyleSheet, 
        TextInput, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class ModalDialog extends Component{
    
    state = {
        modalVisible: false,
        nameInput: '',
        mode: '', // edit, add, confirm, addGoal
    }

    handleNameInput = (nameInput) => {
        this.setState({nameInput})
    }

    componentWillReceiveProps(nextProps){
        this.setState({modalVisible: nextProps.show, mode: nextProps.mode});
    }

    componentDidMount(){
        this.setState({mode: this.props.mode, nameInput: this.props.name})
    }

    dismissDialog = (hasNewData) => {
        this.setState({modalVisible: this.state.modalVisible ? false : true, nameInput: ''})
        this.props.toggle(hasNewData)
    }

    _renderMode = () => {
        switch (this.props.mode) {
            case 'add':
                return(
                    <TextInput
                        style={styles.taskNameInput}
                        onChangeText={this.handleNameInput}
                        value={this.state.nameInput}
                        keyboardType='default'
                        placeholder='enter name'
                    />
                )
                break;
            case 'edit':
                return(
                    <TextInput
                        style={styles.taskNameInput}
                        onChangeText={this.handleNameInput}
                        value={this.state.nameInput}
                        keyboardType='default'
                    />
                )   
                break;
            case 'confirm':
                return(
                    <View>
                        <Text>This task will be deleted.</Text>
                        <Text>Are you sure?</Text>
                    </View>
                )
                break;
            case 'addGoal':
                return(
                    <View>
                        <Text>adding new goal</Text>
                    </View>
                )
            default:
                return(
                    <Text>default</Text>
                )
                break;
        }
    }

    _positiveResponse = () => {
        switch (this.props.mode) {
            case 'add':
                this.props.positive(this.state.nameInput)
                break;
            case 'confirm':
                this.props.positive()
                break;
            case 'edit':
                this.props.positive(this.state.nameInput)
                break;
        }
    }

    _negativeResponse = () => {
        this.props.negative()
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
                        {this._renderMode()}
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                style={styles.button}
                                onPress={this._negativeResponse}>
                                <Icon name="clear" size={40} color="black" />
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.button}
                                onPress={this._positiveResponse}>
                                <Icon name="done" size={40} color="black" />
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
        justifyContent: 'center',
        alignItems: 'center',
    },


})