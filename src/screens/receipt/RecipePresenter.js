import React, { useContext, Component } from 'react';
import { Text, View} from 'react-native';
//import { withNavigation } from 'react-navigation';
import RecipeList from './ReceiptList'

class SimpleViewPresenter extends Component{

    //static contextType = UserContext;


    constructor(props){
        super(props);
        //this.state = {clicked:false, data: [], data2:[], clicked2:false, user:user};
        this.state = { data : null};
        fetch('http://192.168.0.145:3344/recipe/getRecipe',{
        method: "post",
        headers :{
            "content-Type" : "application/json",
        },
        body : JSON.stringify({
            id : 3 
        }),
    }).then(response=>response.json()).then((response=>this.setState({data:response[0]})));
        //console.log(user);
    }

    render(){
        console.log('recipe data:');
        console.log(this.state.data);
        return <View>
        <Text style={{fontSize: 20}} >{this.state.data.name}</Text>
        </View>
        
    }

    
}

export default SimpleViewPresenter;