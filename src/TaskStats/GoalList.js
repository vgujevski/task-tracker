import React, { Component } from 'react'
import { View, StyleSheet, Text, FlatList, TouchableHighlight} from 'react-native'

import Goal from './GoalListItem'

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
    },
    // {
    //     id: 2,
    //     taskId: 8,
    //     name: 'name',
    //     current: 424144,
    //     target: 2332177,
    //     type: 'week', // day/week/month
    //     reminder: false, // notifications
    // }
]
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

    state = {
        data: []
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => (
        <Goal
            data={item}
            clickListener={this._onPressItem}/>
    )

    _handleAddGoalClick = () => {
        alert('add goal')
    }

    _renderAddGoalButton = () => (
            <TouchableHighlight onPress={this._handleAddGoalClick}>
                <View style={styles.newGoalButtonContainer}>
                    <Text style={[{textAlign: 'center'}, fonts.main_medium]}>Set new goal</Text>
                </View>             
            </TouchableHighlight> 
    )

    _onPressItem = () => {
        alert('click')
    }

    render(){
        return(
            <View style={styles.container}>
                {/* <FlatList
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                /> */}
                {this._renderAddGoalButton()}
                <Goal/>
                <Goal/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    newGoalButtonContainer: {
        margin: 10,
        flex: 1,
        alignContent: 'flex-start',
        justifyContent: 'center',
    },
})