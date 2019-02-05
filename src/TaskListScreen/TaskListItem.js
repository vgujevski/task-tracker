import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions} from 'react-native';
import moment from 'moment';
const timer = require('react-native-timer')

import { addTaskInterval } from '../storage/database'




var width = Dimensions.get('window').width;

export default class TaskListItem extends Component{

    constructor(props){
        super(props);
    }

    state = {
        timerIsRunning: false,
        timerNow: 0,
        timerStart: 0,
    }

    getTotalTimeSpent = (intervals) => {
        // console.log('getTotalTimeSpent called');
        // console.log(`timerIsRunning:${this.state.timerIsRunning}, timerNow: ${this.state.timerNow}`);
        
        let intervalArray = []
        for(let i=0;i<intervals.length;i++){
            intervalArray.push(intervals[i].interval)
        }
        const sum = intervalArray.reduce(function(intervals, b) { return intervals + b; }, 0);
        const days = Math.floor(sum / (1000 * 60 * 60 * 24));
        const hours = Math.floor((sum - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
        const minutes = Math.floor((sum - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60))
        // console.log(`intervals array: ${intervalArray}`);
        
        // console.log(`sum: ${sum}`); 
        return `${days} day${days % 10 == 1 ? "" : "s"}, ${hours} hour${hours % 10 == 1 ? "" : "s"}, ${minutes} minute${minutes % 10 == 1 ? "" : "s"}`;
    }

    componentWillMount(){
        width = Dimensions.get('window').width;
    }

    handleTimerButtonClick = () => {
        this.startTimer();
        this.setState({
            timerIsRunning: this.state.timerIsRunning ? false : true
        })
        if(this.state.timerIsRunning){
            this.stopTimer();
        }
    }

    componentWillUnmount(){
        console.log('componentWillUnmount called');
        timer.clearInterval(this, 'timer')
    }

    startTimer = () => {
        console.log('startTimer called')
     
        const now = new Date().getTime()
        this.setState({
            timerStart: now,
            timerNow: now,
        })
        timer.setInterval(this, 'timer', () => {
            console.log('interval called');
            
            this.setState({timerNow: new Date().getTime()})
        }, 1000)
    }

    stopTimer = () => {
        console.log('stopTimer called')
        addTaskInterval(this.props.data.id, 
                        this.state.timerNow - this.state.timerStart).then(resolve => {
                            console.log(resolve);
                            timer.clearInterval(this, 'timer')
                            this.setState({
                                timerIsRunning: false,
                                timerNow: 0,
                                timerStart: 0, 
                            })    
                        }).catch(e => {
                            console.log(e);                        
                        })
    }

    timerButton = () => {
        if(!this.state.timerIsRunning){
            return(
                <TouchableHighlight onPress={this.handleTimerButtonClick} style={styles.button}>
                    <Text style={styles.buttonTitle}>Start</Text>
                </TouchableHighlight>
            )
        }else{
            return(
                <TouchableHighlight onPress={this.handleTimerButtonClick} style={styles.button}>
                    <Text style={styles.buttonTitle}>Stop</Text>
                </TouchableHighlight>
            )         
        }   
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
            <Text style={styles.time}>{this.getTotalTimeSpent(this.props.data.intervals)}</Text>
        )
    }

    render(){
        return(         
            <View style={styles.container}>
                <View style={styles.containerRow}>
                    <View style={styles.containerColumn}>
                        <Text style={styles.name}>{this.props.data.name}</Text>
                        {this.state.timerIsRunning ? this.timerView() : this.timeSpentView()}
                    </View>
                    {this.timerButton()}
                </View>    
            </View>                
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#BDBDBD',
        marginTop: 4,
        width: width - 6,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
    },
    containerColumn: {
        margin: 4,
        flex: 3,
        flexDirection: 'column',
        width:'80%',
        backgroundColor: '#CFD8DC',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#CFD8DC',
        width:'100%' - 5,
        justifyContent: 'center',
        alignItems: 'center',
        
        
    },
    name: {
        margin: 4,
        fontSize: 24,
        color: 'black',
    },
    time: {
        margin: 4,
        fontSize: 16,
        color: 'black',
    },
    button: {
        margin: 4,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'40%',
        height: '90%',
        backgroundColor: '#8BC34A',
        borderRadius: 8,
        borderWidth: 1,
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

