import React, { Component } from 'react'
import { View, StyleSheet, Text, } from 'react-native'

import { fonts } from '../utils/styles/font_styles'



export default class Goal extends Component{

    render(){
        return(
            <View style={styles.container}>
                <Text style={[{textAlign: 'center'}, fonts.main_medium]}>current goal</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        justifyContent: 'center',
        //flex: 1,
        //alignContent: 'flex-start',
    }
})