import React, {Component} from 'react';
import { AppState, View, Text, StyleSheet, TouchableHighlight, Dimensions, TouchableWithoutFeedback} from 'react-native';
import moment from 'moment';
import PushNotification from 'react-native-push-notification'
const timer = require('react-native-timer')

import {fonts} from '../utils/styles/font_styles'
import PushController from './PushController'

export default class TimerComponent extends Component {

    state = {
        timerNow: 0,
        timerStart: 0,
        appState: AppState.currentState,
        shouldSaveInterval: false, 

    }

    componentDidMount(){
        if(this.props.timerStarted){
            this._startTimer()
        }

        //Notification
        AppState.addEventListener('change', this.handleAppStateChange)
    }

    componentWillReceiveProps(newProps){
        // if shouldSaveInterval == true and timerNow != 0, call this._stopTimer
        if(newProps.backPressed){
            console.log('Timer: new props, backPressed == true');
            if(!this.state.timerNow == 0){
                // stop timer
                this._stopTimer()
            }
        }
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this.handleAppStateChange)
    }

    handleAppStateChange = (appState) =>{
        if(appState === 'background'){
            console.log('app is in background');
            
            // if timer is running display notification
            if(this.state.timerNow !== 0){
                this._showNotification();
            }
            if(!this.state.timerNow == 0){
                console.log('timer is running');               
            }else{
                console.log('timer not running');
            }
            // remove notification if app brought to foreground  
        }else if(appState === 'active'){
            console.log('app is in foreground');
            PushNotification.cancelAllLocalNotifications()
        }
    }

    _showNotification = () => {
        PushNotification.localNotification({
            id: '1',
            message: `Task name: ${this.state.timerNow}`, // required
            ongoing: true, 
            //date: new Date(Date.now() + (1 * 1000)), // in 1 second
        })
    }

    _onClick = () => {
        if(this.state.timerNow == 0){
            this._startTimer()
        }else{
            this._stopTimer()
        }
    }

    _startTimer = () => {
        console.log('startTimer called');

        const now = new Date().getTime()
        this.setState({
            timerStart: now,
            timerNow: now,
        })
        timer.setInterval(this, 'timer', () => {
            console.log('interval called')

            this.setState({timerNow: new Date().getTime()})     
        }, 1000);
    }

    _stopTimer = () => {
        console.log('stopTimer called');
        this.props.addInterval(this.state.timerNow - this.state.timerStart)
        timer.clearInterval(this, 'timer')
        this.setState({
            timerStart: 0,
            timerNow: 0,
        })
    }

    _renderTimer = () => {
        if(this.state.timerNow == 0){
            return(
                // display start button
                    <Text style = {[styles.button, fonts.main_xlarge]}>Start</Text>
            )
        }else{
            return(
                // display timer
                    <View>
                        {this._timerView()}
                    </View>
            )         
        }
    }

    _timerView = () => {
        const timer = this.state.timerNow - this.state.timerStart
        const pad = (n) => n < 10 ? '0' + n : n
        const duration = moment.duration(timer)

        return(
            <View style={styles.timerContainer}>
                <Text style={fonts.main_xlarge}>{pad(duration.minutes())}:</Text>
                <Text style={fonts.main_xlarge}>{pad(duration.seconds())}</Text>
            </View>
        )
    }
    render(){
        return(
            <View style ={ styles.container }>
                <TouchableHighlight onPress={this._onClick}>
                    {this._renderTimer()}
                </TouchableHighlight>
                <PushController/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        backgroundColor: '#E5E5E5',
        height: '15%',
        //alignContent: 'center',
        //justifyContent: 'center',
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        textAlign: 'center',
    }
})