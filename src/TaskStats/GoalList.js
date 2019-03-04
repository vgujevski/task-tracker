import React, { Component } from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'

import Goal from './Goal'
/**
 *  @TODO doc
 *  @FlatList
 *  shows 'set goal' button as top item in list
 *  shows list of current goals
 *  @ListItem
 *  show goal info (name, amount(hh), progress)
 *  long press to open modal option menu (delete, rename)
 */
export default class GoalList extends Component{

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