import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProgressContext, UserContext } from '../../contexts';
import styled from 'styled-components/native';
import { Input, Button } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace } from '../../utils/common';
import { Alert, Text } from 'react-native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 40px 20px;
`;
const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const editProfile = ({navigation, route}) => {
  const { dispatch } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);
  const {user} = useContext(UserContext);
  const [id, setId] = useState(route.params.data.user_Id);
  const [name, setName] = useState(route.params.data.usr_Name);
  const [email, setEmail] = useState(route.params.data.usr_Email);
  const [password, setPassword] = useState(route.params.data.usr_Pwd);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState(route.params.data.usr_Nickname);
  const [birth, setBirth] = useState(route.params.data.usr_Birth);
  const [address, setAddress] = useState(route.params.data.usr_Address);
  const [day, setDay] = useState(route.params.data.usr_Day);

  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const dayRef = useRef();
  const addressRef = useRef();
  const birthRef = useRef();
  const nicknameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();

  const didMountRef = useRef();

  useEffect(() => {
    if (didMountRef.current) {
      let _errorMessage = '';
      if (!name) {
        _errorMessage = 'Please enter your name.';
      } else if (!validateEmail(email)) {
        _errorMessage = 'Please verify your email.';
      } else if (password.length < 6) {
        _errorMessage = 'The password must contain 6 characters at least.';
      } else if (password !== passwordConfirm) {
        _errorMessage = 'Passwords need to match.';
      } else {
        _errorMessage = '';
      }
      setErrorMessage(_errorMessage);
    } else {
      didMountRef.current = true;
    }
  }, [name, email, password, passwordConfirm]);

  useEffect(() => {
    setDisabled(
      !(name && email && password && passwordConfirm && !errorMessage)
    );
  }, [name, email, password, passwordConfirm, errorMessage]);

  const _handleSignupButtonPress = async () => {
    try {
      spinner.start();
      signUp(id, password, name, nickname, email, birth, address, day, user.usr_Id);
    } catch (e) {
      Alert.alert('Signup Error', e.message);
    } finally {
      spinner.stop();
      alert("Success!\nLogin with new account!!");
      navigation.navigate('Home');
    }
  };

  signUp =  (Id, password, name, nickname, email, birth, address, day, usr_Id)  => {
    fetch('http://34.64.235.196:3344/login/updateProfile',{
      method: "post",
      headers :{
          "content-Type" : "application/json",
      },
      body : JSON.stringify({
          id : Id,
          pwd : password,
          name : name,
          nickname : nickname,
          email : email,
          birth : birth,
          address : address,
          day : day,
          usr_Id : usr_Id,
      })
 }).then(response=>response.json()).then((response) => setUser(response));
};

  return (
    <KeyboardAwareScrollView extraScrollHeight={20}>
      <Container>
        <Text>{id}님 회원정보 수정화면</Text>
        <Input
          label="Name"
          value={name}
          onChangeText={text => setName(removeWhitespace(text))}
          onSubmitEditing={() => {
            setName(name.trim());
            emailRef.current.focus();
          }}
          onBlur={() => {if(name != undefined)setName(name.trim())}}
          placeholder="Name"
          returnKeyType="next"
        />
        <Input
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={text => setEmail(removeWhitespace(text))}
          onSubmitEditing={() => nicknameRef.current.focus()}
          placeholder="Email"
          returnKeyType="next"
        />
        <Input
          ref={nicknameRef}
          label="Nickname"
          value={nickname}
          onChangeText={text => setNickname(removeWhitespace(text))}
          onSubmitEditing={() => {
            setNickname(nickname.trim());
            birthRef.current.focus();
          }}
          onBlur={() => {if(nickname != undefined)setNickname(nickname.trim())}}
          placeholder="Nickname"
          returnKeyType="next"
        />
        <Input
          ref={birthRef}        
          label="Birth"
          value={birth}
          onChangeText={text => setBirth(removeWhitespace(text))}
          onSubmitEditing={() => {
            setBirth(birth.trim());
            addressRef.current.focus();
          }}
          onBlur={() => {if(birth != undefined)setBirth(birth.trim())}}
          placeholder="Birth"
          returnKeyType="next"
        />
        <Input
          ref={addressRef}
          label="Address"
          value={address}
          onChangeText={text => setAddress(removeWhitespace(text))}
          onSubmitEditing={() => {
            setAddress(address.trim());
            dayRef.current.focus();
          }}
          onBlur={() => {if(address != undefined)setAddress(address.trim())}}
          placeholder="Address"
          returnKeyType="next"
        />
        <Input
          ref={dayRef}
          label="Day"
          value={day}
          onChangeText={text => setDay(removeWhitespace(text))}
          onSubmitEditing={() => {
            setDay(day);
            passwordRef.current.focus();
          }}
          onBlur={() => {if(day != undefined)setDay(day.trim())}}
          placeholder="마트가는요일 : 1~7숫자입력 (월요일1)"
          returnKeyType="next"
        />
        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={text => setPassword(removeWhitespace(text))}
          onSubmitEditing={() => passwordConfirmRef.current.focus()}
          placeholder="7자리이상의 비밀번호"
          returnKeyType="done"
          isPassword
        />
        <Input
          ref={passwordConfirmRef}
          label="Password Confirm"
          value={passwordConfirm}
          onChangeText={text => setPasswordConfirm(removeWhitespace(text))}
          onSubmitEditing={_handleSignupButtonPress}
          placeholder="비밀번호 재확인"
          returnKeyType="done"
          isPassword
        />
        <ErrorText>{errorMessage}</ErrorText>
        <Button
          title="정보변경"
          onPress={_handleSignupButtonPress}
          disabled={disabled}
        />
        <Button title="GoBack" onPress={()=>navigation.navigate('Home')}/>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default editProfile;
