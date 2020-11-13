import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {SwipeListView} from 'react-native-swipe-list-view';
import { Notifications } from 'expo';

export default class SwipeableFlatlist extends Component{
    constructor(props){
        super(props)
        this.state={
            allNotifications:this.props.allNotifications
        }
    }

    updateMarkAsRead=(notification)=>{
        db.collection("all_notifications").doc(notification.doc_id).update({
            "notification_status":"read"
        })
    }

    closeRow=(item,key)=>{
        if(item[key]){
            item[key].closeRow()
        }
    };

    deleteRow=(item,key)=>{
        var allNotifications = this.state.allNotifications
        this.closeRow(item,key)
        const renewData = [...allNotifications]
        const previousIndex = allNotifications.findIndex(item=>item.key===key);
        this.updateMarkAsRead(allNotifications[previousIndex]);
        newData.splice(previousIndex,1)
        this.setState({allNotifications:newData})
    };
    onRowDidOpen = key=>{console.log("This Row Opened",key)}

    renderItem = data => (
        <TouchableHighlight>
            <ListItem leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>} 
            title={data.item.book_name} 
            titleStyle={{ color: 'black', fontWeight: 'bold' }} 
            subtitle={data.item.message} 
            bottomDivider /> 
        </TouchableHighlight> 
    );

    renderHiddenItem = (data,item)=>{
        <View style = {styles.rowBack}>
            <Text>Left</Text>
            <TouchableOpacity style = {[styles.backRideButton,styles.backRideButtonLeft]} onPress={()=>this.closeRow(item,data.item.key)}>
                <Text style = {styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {[styles.backRideButton,styles.backRideButtonRight]} onPress={()=>this.deleteRow(item,data.item.key)}>
                <Text style = {styles.backTextWhite}>Mark As Read</Text>
            </TouchableOpacity>
        </View>
    };

    render(){
        return(
            <View style={styles.container}>
                <SwipeListView data = {this.state.allNotifications} 
                renderItem = {this.renderItem} 
                renderHiddenItem={this.renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue = {-150}
                previewKey = {'0'}
                previewOpenValue = {-40}
                previewOpenDelay = {3000}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    rowBack:{
        alignItems:'center',
        backgroundColor:'#DDD',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:50
    },
    rowFront:{
        alignItems:'center',
        backgroundColor:'#CCC',
        borderBottomColor:'black',
        borderBottomWidth:1,
        justifyContent:'center',
        height:50
    },
    backRideButton:{
        alignItems:'center',
        bottom:0,
        justifyContent:'center',
        position:'absolute',
        top:0,
        width:75
    },
    backRideButtonLeft:{
        backgroundColor:'blue',
        right:75
    },
    backRideButtonRight:{
        backgroundColor:'red',
        right:0
    },
    backTextWhite:{
        color:'blue'
    }
})