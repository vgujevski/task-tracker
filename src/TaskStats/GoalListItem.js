import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native'

import { fonts } from '../utils/styles/font_styles'
import { colors } from '../utils/styles/colors'
import { formatProgressPercentage} from '../utils/misc'

export default class Goal extends Component{

    _handleLongPress = () => {
        this.props.onLongPress(this.props.data.id)
    }
    render(){
        return(
            <TouchableOpacity onLongPress={this._handleLongPress}>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <Text style={[styles.type,fonts.main_medium]}>{this.props.data.type}</Text>
                        <Text style={[styles.progress, fonts.main_medium]}>{formatProgressPercentage(this.props.data.progress, this.props.data.target)}</Text>
                    </View>
                </View>
            </TouchableOpacity>   
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 10,
        alignContent: 'flex-start',
        justifyContent: 'center',
        backgroundColor: colors.mainLight,
    },
    row: {
        flexDirection:'row'
    },
    type: {
        textAlign: 'center',
        flex:1,
    },
    progress: {
        textAlign: 'center',
        flex:1,
    },
})