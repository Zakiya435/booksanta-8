import React, { Component } from 'react';
import {View,Text,StyleSheet,FlatList} from 'react-native';
import {Icon,ListItem} from 'react-native-elements';
import db from '../config'
import MyHeader from '../components/MyHeader';
import firebase from 'firebase'

export default class NotificationScreen extends Component{
    constructor(props){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        };
        this.notificationRef = null

    }

    getNotification=()=>{
        this.requestRef = db.collection("all_notifications")
        .where("notification_status","==","unread")
        .where("targeted_user_id","==",this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotifications = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data()
                notification["doc_id"]=doc.id
                allNotifications.push(notification)
            });
            this.setState({allNotifications:allNotifications});
        });
    }

    componentDidMount(){
        this.getNotification()
    }
    componentWillUnmount(){
        this.notificationRef()
    }

    keyExtractor = (item, index) => index.toString()


    renderItem = ( {item, index} ) =>{
        return (
          <ListItem
            key={index}
            title={item.book_name}
            subtitle={item.message} 
            leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>} 
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            bottomDivider
             />
        )}


        render(){
             return(
                <View style={styles.container}> 
                <View style={{flex:0.1}}>
                <MyHeader title={"Notifications"}
                navigation={this.props.navigation}/> 
                </View> <View style={{flex:0.9}}> 
                { this.state.allNotifications.length === 0 ?
                ( <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                 <Text style={{fontSize:25}}>You have no notifications</Text>
                 </View> ) :( 
                 <FlatList keyExtractor={this.keyExtractor} 
                data={this.state.allNotifications} 
                renderItem={this.renderItem} /> ) } 
                </View> 
                </View>
             )
}
}
const styles = StyleSheet.create({ container : { flex : 1 } })