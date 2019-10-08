import React, { Component } from 'react'
import { View, StyleSheet, Text, FlatList, TouchableHighlight} from 'react-native'

import Goal from './GoalListItem'

import { fonts } from '../utils/styles/font_styles'
import { colors } from '../utils/styles/colors'

const testGoals = [
    {
        id: 1111,
        taskId: 11,
        name: 'name',
        progress: 424144,
        target: 2332177,
        type: 'weekly', // day/week/month
        reminder: false, // notifications
    },
    {
        id: 2222,
        taskId: 8,
        name: 'name',
        progress: 800000,
        target: 2332177,
        type: 'daily', // day/week/month
        reminder: false, // notifications
    }
]
/**
 *  @TODO doc
 *  @FlatList
 *  shows 'set goal' button as top item in list
 *  "set goal" button is only rendered if there is less than 3 goals active
 *  shows list of current goals
 *  maximum of 3 goals can be active, 1 of each type
 *  @ListItem
 *  show goal info (name, amount(hh), progress)
 *  long press to open modal option menu (delete, rename)
 *  
 *  AddGoal bust MUST NOT be rendered if goal list already has all possible types (daily, weekly, monthly) 
 */
export default class GoalList extends Component{

    state = {
        data: [],
        showAddButtom: true,
    }

    componentWillMount(){      
        this.setState({data: this.props.data}, () => {
            this._addButton(this.props)
        })
    }

    componentWillReceiveProps(newProps){     
        this.setState({data: newProps.data}, () => {
            this._addButton(newProps)
        })
    }

    _addButton = (props) => {
        if(props.daily && props.weekly && props.monthly){

            this.setState({
                showAddButtom: false,
            })        
        }else{
            this.setState({
                showAddButtom: true,
            })
        }    
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => (
        <Goal
            data={item}
            onLongPress={this.props.toggleDeleteGoalDialog}
            clickListener={this._onPressItem}/>
    )

    _handleAddGoalClick = () => {
        this.props.onPress()
    }

    _renderAddGoalButton = () => {
        if(this.state.showAddButtom){
            return (
                <TouchableHighlight onPress={this._handleAddGoalClick}>
                    <View style={styles.newGoalButtonContainer}>
                        <Text style={[{textAlign: 'center'}, fonts.main_medium]}>Set new goal</Text>
                    </View>             
                </TouchableHighlight> 
        )
        }else{
            return null
        }
    }

    _onPressItem = () => {
        // alert('click')
    }

    render(){
        return(
            <View style={styles.container}>
                {this._renderAddGoalButton()}
                <FlatList
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: colors.buttonsDark,
    },
    newGoalButtonContainer: {
        margin: 10,
        padding: 10,
        alignContent: 'flex-start',
        justifyContent: 'center',
        backgroundColor: colors.mainLight,
    },
})