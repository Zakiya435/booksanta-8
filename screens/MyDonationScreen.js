import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView} from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config'


    export default class MyDonationScreen extends Component{
        constructor(){
            super();
            this.state={
                userId:firebase.auth().currentUser.email,
                allDonations:[]
            }
            this.requestRef=null
        }

        getAllDonations =()=>{
            this.requestRef = db.collection("allDonations").where("doner_Id",'==',this.state.userId)
            .onSnapshot((snapshot)=>{
              var allDonations = snapshot.docs.map(document => document.data());
              this.setState({
                allDonations : allDonations
              });
            })
          }

          keyExtractor = (item, index) => index.toString()

          componentDidMount(){
            this.getAllDonations()
          }
        
          componentWillUnmount(){
            this.requestRef();
          }
          sendNotification=(bookDetails,request_status)=>{
            var requestId = bookDetails.requestId
            var donorId = bookDetails.donorId
            db.collection("all_notifications")
            .where("request_id","==",requestId)
            .where("donor_id","==",donorId)
            .get()
            .then(snapShot=>{
                var message = ""
            })
            if(request_status === "bookSent")
            {
                message = this.state.donorName + "sent you a book"
            }
            else{
                message = this.state.donorName + "has shown interest in donating the book"
            }
            db.collection("all_notifications").doc(doc.id).update({
                "message":message,
                "notification_status":'unread',
                "date":firebase.firestore.FieldValue.serverTimestamp()
            })
        }

        sendBook=(bookDetails)=>{
            if(bookDetails.request_status === "bookSent"){
                var request_status = "donor interested"
                db.collection("all_notifications").doc(bookDetails.doc_id).update({
                    "request_status" : "donor interested"                    
                })
                this.sendNotification(bookDetails,request_status)
            }
            else{
                var request_status = "book sent"
                db.collection("all_notifications").doc(bookDetails.doc_id).update({
                    "request_status" : "book sent"                    
                })
                this.sendNotification(bookDetails,request_status)
            }
        }


  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={"Requested By:" +item.requested_by +"\nStatus : " + item.request_status} 
        leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>} 
        titleStyle={{ color: 'black', fontWeight: 'bold' }} 
        rightElement={ 
        <TouchableOpacity style={styles.button}
        onPress={()=>{
          this.sendBook(item)
        }}
        > 
        <Text style={{color:'#ffff'}}>{item.request_status === "booksent"?"booksent":"sendBook"}</Text> 
        </TouchableOpacity> } 
        bottomDivider
         />
    )}
    render(){
         return( 
         <View style={{flex:1}}>
              <MyHeader navigation={this.props.navigation} 
              title="My Donations"/> <View style={{flex:1}}> 
              { this.state.allDonations.length === 0 ?
              ( <View style={styles.subtitle}> 
              <Text style={{ fontSize: 20}}>List of all book Donations</Text> 
              </View> ) 
              :( <FlatList keyExtractor={this.keyExtractor} 
                data={this.state.allDonations} 
                renderItem={this.renderItem} /> 
                ) }
                 </View> 
                 </View>
                )}
}