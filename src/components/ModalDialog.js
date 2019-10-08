import React, {Component} from 'react';
import {
        Modal, View, Text, StyleSheet, 
        TextInput, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import { colors } from '../utils/styles/colors';

const radio_props = [
    {label: 'Daily', value: 'daily'},
    {label: 'Weekly', value: 'weekly'},
    {label: 'Monthly', value: 'monthly'},
]

export default class ModalDialog extends Component{
    
    state = {
        modalVisible: false,
        nameInput: '',
        mode: '', // edit, add, confirm, addGoal, confirmDeleteGoal
        message: '',
        newGoalType: '', //this.radioButtons[0].value,
        radioButtons: [],
        newGoalTarget: 0,
    }

    handleNameInput = (nameInput) => {
        this.setState({nameInput})
    }

    handleGoalInput = (goalInput) => {
        this.setState({newGoalTarget: goalInput})
    }

    componentWillReceiveProps(nextProps){

        this.setState(
            {modalVisible: nextProps.show, 
            mode: nextProps.mode, 
            radioButtons: this._createRadioButtonList(),
        }, () => {
            if(this.state.radioButtons[0]){
                if(this.state.radioButtons[0].value){
                    this.setState({newGoalType: this.state.radioButtons[0].value})
                } 
            }     
        });
    }

    componentDidMount(){
        //console.log(`ModalDialog componentDidMount called`);
        
        this.setState({
            mode: this.props.mode, 
            nameInput: this.props.name,
            radioButtons: this._createRadioButtonList(),
        })
    }

    dismissDialog = (hasNewData) => {
        this.setState({modalVisible: this.state.modalVisible ? false : true, nameInput: ''})
        this.props.toggle(hasNewData)
    }

    _createRadioButtonList = () => {
        //console.log('createRadioButtonList called');
        
        var radioButtons = []
        if(!this.props.daily){
            radioButtons.push({label: 'Daily', value: 'daily'})
        }
        if(!this.props.weekly){
            radioButtons.push({label: 'Weekly', value: 'weekly'})
        }
        if(!this.props.monthly){
            radioButtons.push({label: 'Monthly', value: 'monthly'})
        }      

        return radioButtons
    }

    _renderMode = () => {
        switch (this.props.mode) {
            case 'add':
                return(
                    <TextInput
                        style={styles.textInput}
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
                        style={styles.textInput}
                        onChangeText={this.handleNameInput}
                        value={this.state.nameInput}
                        keyboardType='default'
                    />
                )   
                break;
            case 'confirmDeleteTask':
                return(
                    <View>
                        <Text>This task will be deleted.</Text>
                        <Text>Are you sure?</Text>
                    </View>
                )
                break;
            case 'confirmDeleteGoal':
                return(
                    <View>
                        <Text>This goal will be deleted.</Text>
                        <Text>Are you sure?</Text>
                    </View>
                )
            case 'addGoal':
                return(
                    <View>
                        <RadioForm
                            radio_props={this.state.radioButtons}
                            initial={0}
                            animation={false}
                            onPress={(value) => {this.setState({newGoalType: value})}}
                            buttonColor={colors.buttonsDark}
                        />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={this.handleGoalInput}
                            value={this.newGoalTarget}
                            keyboardType='number-pad'
                            placeholder='hours'
                        />
                    </View>
                )
            default:
                return(
                    <Text>default</Text>
                )
                //break;
        }
    }

    _positiveResponse = () => {
        switch (this.props.mode) {
            case 'add':
                this.props.positive({
                    name: this.state.nameInput
                })
                break;
            case 'confirmDeleteTask':
                this.props.positive()
                break;
            case 'edit':
                this.props.positive({
                    newName: this.state.nameInput
                })
                break;
            case 'addGoal':
                this.props.positive({
                    type: this.state.newGoalType,
                    target: this.state.newGoalTarget,
                })
                break;
            case 'confirmDeleteGoal':
                this.props.positive()
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
    textInput: {
        width: '80%',
        fontSize: 16,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fragment: {
        width: '60%',
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 10,
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