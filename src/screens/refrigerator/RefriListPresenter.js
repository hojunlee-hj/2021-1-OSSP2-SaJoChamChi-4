import React, { useContext, Component } from 'react';
import { Text, View, Button, Alert, TouchableOpacity} from 'react-native';
import { UserContext, ProgressContext } from '../../contexts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {CommonActions} from "@react-navigation/native";



class RefriListPresenter extends Component{

    static contextType = UserContext;

    constructor(props){
        super(props);
        this.state = {clicked:false, data: [], del:false, item:null, update:false  };
        console.log("GetParam", this.props.navigation.getParam)
        if(this.props.navigation.getParam!=undefined){
            this.state = {update :this.props.navigation.getParam.update }
        }
    }

    componentDidMount(){
        const user = this.context;
        console.log("didmount log",user.user);
        this.click(user.user.usr_Id);
        console.log("presenter user info : ", this.state.data);
    }
    componentDidUpdate(prevProps) {
        if (this.props.userID !== prevProps.userID) {
          this.fetchData(this.props.userID);
        }
      }
click =  (user)  => {
    fetch('http://34.64.235.196:3344/refri/getList',{
        method: "post",
        headers :{
            "content-Type" : "application/json",
        },
        body : JSON.stringify({
            usr_id : user, 
        }),
    }).then(response=>response.json()).then((response=>this.setState({data:response})));
};
  ToDate = text => {
    return String(text).substr(2,8);
  };
 getDDay = text=>{
    var Dday = new Date(text);  
    var now = new Date();                    
    var gap = now.getTime() - Dday.getTime();   
    var result = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1;
    return "D-"+String(result);
 }
 getdate = text=>{
    var Dday = new Date(text);  
    var now = new Date();                    
    var gap = now.getTime() - Dday.getTime();   
    var result = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1;
    return result;
 }

 delete =  (item, usr)  => {
    fetch('http://34.64.235.196:3344/refri/deleteRefriItem',{
        method: "post",
        headers :{
            "content-Type" : "application/json",
        },
        body : JSON.stringify({
            Pname : item,
            usr_Id : usr,
        }),
    });
    Alert.alert(item,"이 삭제되었습니다!");
    //this.forceUpdate()
   // this.props.navigation.navigate('MyRefri',{update:!this.state.update})
   this.props.navigation.dispatch(CommonActions.reset({index : 1, routes:[ {name : 'MyRefri'}]}));
};

    render(){
        var date = new Date();
        const user = this.context;

        return this.state.data.map((data, index)=> <View style={{flexDirection: 'row', width : '100%'}} >
        <TouchableOpacity key={index} onPress={()=>this.props.navigation.navigate('UpdateRefri', {
              data : data
          })} style={{width: '10%', backgroundColor:"white",borderRadius : 20}}>
            <Text style={{fontSize:10, color:'blue', width:'100%', textAlign:'center'}}>수정</Text>
        </TouchableOpacity>  
        <Text key={index} style={{fontSize: 14,width : '40%', textAlign: 'center'}}>{data.rf_Pname}</Text>
        <Text key={index} style={{fontSize: 14, width : '10%', textAlign: 'center'}}>{data.rf_Number}</Text>
        {this.getdate(data.rf_Epdate)<=5   ?      
        <Text key={index} style={{fontSize: 14, width : '20%', textAlign: 'center', color:'red', fontWeight:'bold'}}>{this.getDDay(data.rf_Epdate)}</Text>
        :  <Text key={index} style={{fontSize: 14, width : '20%', textAlign: 'center' }}>{this.getDDay(data.rf_Epdate)}</Text>}
        <Text key={index} style={{marginBottom : 30, fontSize : 14, width : '10%', textAlign: 'center'}}>{data.rf_Frozen==0 ? '냉장' : '냉동'}</Text>
        <TouchableOpacity key={index} onPress={this.delete.bind(this,data.rf_Pname, user.user.usr_Id)} style={{width: '10%', backgroundColor:"white",borderRadius : 20}}>
            <Text key={index} style={{fontSize:14, color:'blue', width:'100%', textAlign:'center'}}>삭제</Text>
        </TouchableOpacity>  
        </View>)
    }

    
}

export default RefriListPresenter;