import React, { useState, useRef, useEffect, useContext } from "react";
import { ProgressContext, UserContext } from "../../contexts";
import styled from "styled-components/native";
import { Text, StyleSheet } from "react-native";
import { Input, Button } from "../../components";
import { validateEmail, removeWhitespace } from "../../utils/common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNPickerSelect from 'react-native-picker-select';
import {CommonActions, StackActions } from "@react-navigation/native";
import { validateDate } from "../../utils/common";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 40px 20px;
`;

const Label = styled.Text`
  align-items: flex-start;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  margin-bottom: 6px;
  color: ${({ theme, isFocused }) => (isFocused ? theme.text : theme.label)};
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      paddingTop: 20,
      paddingHorizontal: 10,
      paddingBottom: 20,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      backgroundColor: 'white',
      color: 'black',
      marginBottom: 10,
  },
  inputAndroid:{
    fontSize: 16,
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    marginBottom: 10,
   }
});
// input item -> fetch data + Barcode icon data to back with data with (barcode) + barcode matching with data

const InsertItem = ({ route, navigation }) => {

  function getToday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}

  const user = useContext(UserContext);

  const [id, setId] = useState(user.user.usr_Id);
  const [Pname, setPname] = useState("");
  const [Number, setNumber] = useState("");
  const [Epdate, setEpdate] = useState("");
  const [Indate, setIndate] = useState(getToday());
  const [Frozen, setFrozen] = useState("");
  const [Foodid, setFoodid] = useState("");
  const [Fkind, setFkind] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [checkOCR, setcheckOCR] = useState(false);
  const [checkBar, setcheckBar] = useState(false);

  const nicknameRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const didMountRef = useRef();

    useEffect(() =>{
      console.log('insertitem useeffect')
      if(route.params!==undefined){
      if(route.params.fkind !== undefined && !checkBar){
      //  console.log('insertitem useeffect : '+route.params.fkind);
        setPname(route.params.fname)
        setcheckBar(true);
      }
      if(route.params.OCRresponse !== undefined && !checkOCR){
        //  console.log('insertitem useeffect : '+route.params.fkind);
          setEpdate(route.params.OCRresponse)
          setcheckOCR(true);
        }
    }
    },);
 

    useEffect(() => {
        if (didMountRef.current) {
          let _errorMessage = '';
          if (!Pname) {
            _errorMessage = '상품명을 입력해주세요!';
          } else if (!Number) {
            _errorMessage = '수량을 입력해주세요!';
          } else if (!Epdate) {
            _errorMessage = '유통기한을 입력해주세요!';
          } else if (!Indate) {
            _errorMessage = '구매일자를 입력해주세요';
          }else if(!validateDate(Epdate)){
            _errorMessage='날짜는 YYYY-MM-DD형식으로 입력해주세요'
          }else if(!validateDate(Indate)){
            _errorMessage='날짜는 YYYY-MM-DD형식으로 입력해주세요'
          }else if (!Frozen) {
            _errorMessage = '냉동/냉장을 선택하세요';
          }else if (!Foodid) {
            _errorMessage = '음식분류를 입력하세요';
          }else if (!Fkind) {
            _errorMessage = '식품군을 입력하세요';
          } else {
            _errorMessage = '';
          }
          setErrorMessage(_errorMessage);
        } else {
          didMountRef.current = true;
        }
      }, [Pname, Number, Epdate, Indate,Frozen,Foodid,Fkind]);
    
      useEffect(() => {
        setDisabled(
          !(Pname && Number && Epdate && Indate && !errorMessage)
        );
      }, [Pname, Number, Epdate, Indate, errorMessage]);

      Insert =  (Pname, Number, Epdate, Indate, Frozen, Foodid, Fkind, id)  => {
        fetch('http://34.64.235.196:3344/refri/Insert',{
          method: "post",
          headers :{
              "content-Type" : "application/json",
          },
          body : JSON.stringify({
              rf_Pname : Pname,
              rf_Number : Number,
              rf_EPdate : Epdate,
              rf_Indate : Indate,
              rf_Frozen : Frozen,
              rf_Foodid : Foodid,
              rf_FKind : Fkind,
              rf_usr : id,    
          })
     })
    };



      const _handleSignupButtonPress = async () => {
        try {
          Insert(Pname, Number, Epdate, Indate, Frozen, Foodid, Fkind, id);
        } catch (e) {
          Alert.alert('Signup Error', e.message);
        } finally {
          alert("Success!\n추가되었습니다!");
          navigation.dispatch(CommonActions.reset({index : 0, routes:[ {name : 'MyRefri'}]}));
        }
      };
    

    return(
        <KeyboardAwareScrollView extraScrollHeight={20}>
        <Container>
            <Text style={{fontSize: 24, textAlign : 'center'}}> InsertItem </Text>
            <Input
          label="Pname"
          value={Pname}
          onChangeText={(text) => setPname(removeWhitespace(text))}
          onSubmitEditing={() => {
            setPname(Pname.trim());
            nameRef.current.focus();
          }}
          onBlur={() => setPname(Pname.trim())}
          placeholder="상품명"
          returnKeyType="next"
        />
        <Input
          ref={nameRef}
          label="Number"
          value={Number}
          onChangeText={(text) => setNumber(removeWhitespace(text))}
          onSubmitEditing={() => {
            setNumber(Number.trim());
            emailRef.current.focus();
          }}
          onBlur={() => setNumber(Number.trim())}
          placeholder="수량"
          returnKeyType="next"
        />
        <Input
          ref={emailRef}
          label="Epdate"
          value={Epdate}
          onChangeText={(text) => setEpdate(removeWhitespace(text))}
          onSubmitEditing={() => nicknameRef.current.focus()}
          placeholder="유통기한"
          returnKeyType="next"
        />
        <Input
          ref={nicknameRef}
          label="Indate"
          value={Indate}
          onChangeText={(text) => setIndate(removeWhitespace(text))}
          onSubmitEditing={() => {
            setIndate(Indate.trim());
          }}
          onBlur={() => setIndate(Indate.trim())}
          placeholder="구매일자"
          returnKeyType="next"
        />
        <Label style={{textAlign : 'left'}}>냉동/냉장여부</Label>
        <RNPickerSelect onValueChange={(value)=>setFrozen(value)}
        placeholder={{
          label: '냉동/냉장여부',
          value: null,}}
         style={{ ...pickerSelectStyles }}
         items={[{label : '냉장', value:'0'},{label : '냉동', value:'1'}]}/>

        <Label style={{textAlign : 'left'}}>음식분류</Label>
        <RNPickerSelect onValueChange={(value)=>setFkind(value)}
        placeholder={{
          label: '음식분류를 선택해주세요',
          value: null,}}
         style={{ ...pickerSelectStyles }}
         items={[{label : '육류', value:'1'},{label : '수산물', value:'2'},{label : '계란/유제품', value:'3'},
         {label : '채소', value:'4'},{label : '과일', value:'5'}, {label : '밀키트', value:'6'}, 
         {label : '냉동식품', value:'7'}, {label : '주류/음류', value:'8'}, {label : '건해산물', value:'9'}, {label : '기타', value:'10'}]}/>
        
        
        <Label style={{textAlign : 'left'}}>식품군</Label>
        <RNPickerSelect onValueChange={(value)=>setFoodid(value)}
        placeholder={{
          label: '식품군을 선택해주세요',
          value: null,}}
         style={{ ...pickerSelectStyles }}
         
         items={[{label : '한우등심', value:'1'},{label : '삼겹살', value:'2'},{label : '닭갈비', value:'3'},
         {label : '햄', value:'4'},{label : '연어', value:'5'}, {label : '새우', value:'6'}, 
         {label : '문어', value:'7'}, {label : '게', value:'8'}, {label : '낙지', value:'9'}, {label : '오징어', value:'10'},
         {label : '새우', value:'11'}, {label : '생선', value:'12'}, {label : '우유', value:'13'}, {label : '두부', value:'14'},
         {label : '치즈', value:'15'}, {label : '달걀', value:'16'}, {label : '맛살', value:'17'}, {label : '어묵', value:'18'},
         {label : '냉동만두', value:'19'}, {label : '토마토', value:'20'}, {label : '베이컨', value:'21'}, {label : '불고기', value:'22'},
         {label : '블루베리', value:'23'}, {label : '오이', value:'24'}, {label : '양파', value:'25'}, {label : '가지', value:'26'},
         {label : '호박', value:'27'}, {label : '부추', value:'28'}, {label : '당근', value:'29'}, {label : '파', value:'30'},
         {label : '소시지', value:'31'}, {label : '크림', value:'32'}, {label : '무', value:'33'}, {label : '삼겹살', value:'34'},
         {label : '목살', value:'35'}, {label : '기타', value:'36'}, {label : '등심', value:'37'}, {label : '돈까스', value:'38'},
         {label : '닭가슴살', value:'39'}, {label : '닭다리', value:'40'}, {label : '닭', value:'41'}, {label : '소고기', value:'42'},
         {label : '오리고기', value:'43'}, {label : '돼지', value:'44'}]}/>
        <ErrorText>{errorMessage}</ErrorText>    
        <Button title="바코드 인식" onPress={()=>navigation.navigate('Barcode')} containerStyle={{width:300,  marginBottom: 10}}/>
        <Button title="OCR" onPress={()=>navigation.navigate('OCR')} containerStyle={{width:300,  marginBottom: 10}}/>
        <Button
          title="추가"
          onPress={_handleSignupButtonPress}
          disabled={disabled}
          containerStyle={{ width: 300, marginBottom: 10 }}
        />
        <Button
          title="MyRefri"
          onPress={() => navigation.navigate("MyRefri")}
          containerStyle={{ width: 300,  marginBottom: 10 }}
        />
        </Container>
        </KeyboardAwareScrollView>
    )
}

export default InsertItem;
