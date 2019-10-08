import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, TouchableWithoutFeedback} from 'react-native';
import moment from 'moment';
const timer = require('react-native-timer')

import { addTaskInterval } from '../storage/database'
import { getTimeSpentTotal } from '../utils/misc'
import { fonts } from '../utils/styles/font_styles'
import { colorts, colors } from '../utils/styles/colors'

var width = Dimensions.get('window').width;

export default class TaskListItem extends Component{

    state = {
        timerIsRunning: false,
        timerNow: 0,
        timerStart: 0,
    }

    componentWillMount(){
        width = Dimensions.get('window').width;
    }

    _onPress = () => {
        this.props.clickListener(this.props.data)
    }

    _onStartPress = () => {
        this.props.clickListener(this.props.data, true)
    }

    timerButton = () => {
        return(
            // onPress={this.handleTimerButtonClick}
            <TouchableHighlight onPress={this._onStartPress} style={styles.button}>
                <Text style={styles.buttonTitle}>Start</Text>
            </TouchableHighlight>
        ) 
    }

    timerView = () => {
        const timer = this.state.timerNow - this.state.timerStart
        const pad = (n) => n < 10 ? '0' + n : n
        const duration = moment.duration(timer)
        //const centiseconds = Math.floor(duration.milliseconds() / 10)

        return(
            <View style={styles.timerContainer}>
                <Text style={styles.time}>{pad(duration.minutes())}:</Text>
                <Text style={styles.time}>{pad(duration.seconds())}</Text>
                {/* <Text style={styles.time}>{pad(centiseconds)}</Text> */}
            </View>
        )
    }

    timeSpentView = () => {
        return(
            <Text style={[styles.time, fonts.main_medium]}>{getTimeSpentTotal(this.props.data.intervals)}</Text>
        )
    }

    render(){
        return(         
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this._onPress}>
                    <View style={styles.containerRow}>
                        <View style={styles.containerColumn}>
                            <Text style={[styles.name, fonts.main_large]}>{this.props.data.name}</Text>
                            {this.state.timerIsRunning ? this.timerView() : this.timeSpentView()}
                        </View>
                        {this.timerButton()}
                    </View> 
                </TouchableWithoutFeedback>
            </View>                
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondaryLight,
        marginTop: 4,
        width: width - 6,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    containerColumn: {
        margin: 4,
        paddingLeft: 20,
        flex: 3,
        flexDirection: 'column',
        width:'80%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        width:'100%' - 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        //margin: 4,
        paddingLeft: 10,
    },
    time: {
        //margin: 4,
    },
    button: {
        margin: 4,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'40%',
        height: '90%',
        backgroundColor: colors.secondaryDark,
        borderRadius: 3,
        overflow: 'hidden',
        
    },
    buttonTitle: {
        fontSize: 24,
        color: 'black',
    },
    timerContainer: {
        flexDirection: 'row',
    },
    timer: {
    }
})

