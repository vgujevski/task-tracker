import React, { Component } from 'react'
import { View, StyleSheet, Text, } from 'react-native'

import { fonts } from '../utils/styles/font_styles'

const testGoals = [
    {
        id: 1,
        taskId: 11,
        name: 'name',
        current: 424144,
        target: 2332177,
        type: 'week', // day/week/month
        reminder: false, // notifications
    }
]

export default class Goal extends Component{

    render(){
        return(
            <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>goals</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    }
})