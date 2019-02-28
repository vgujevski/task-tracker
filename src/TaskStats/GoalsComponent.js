import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class GoalsComponent extends Component{

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