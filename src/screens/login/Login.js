import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProgressContext, UserContext } from '../../contexts';
import styled from 'styled-components/native';
import { Input, Button } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace } from '../../utils/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useCardAnimation } from '@react-navigation/stack';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;
const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Login = ({ navigation }) => {
  const { dispatch } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState({})
  const [ID, setID] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!(ID && password));
  }, [ID, password]);

  const _handleIDChange = ID => {
    const changedID = removeWhitespace(ID);
    setID(changedID);
  };
  const _handlePasswordChange = password => {
    setPassword(removeWhitespace(password));
  };
  const _handleLoginButtonPress = () => {
    try {
      spinner.start();
      login(ID, password);
      dispatch(user[0]);
    } catch (e) {
      Alert.alert('Login Error', e.message);
    } finally {
      spinner.stop();
    }
  };
  
  var login =  (Id, password)  => {
     fetch('http://localhost:3344/login/Login',{
        method: "post",
        headers :{
            "content-Type" : "application/json",
        },
        body : JSON.stringify({
            id : Id,
            pwd : password,
        })
   }).then(response=>response.json()).then((response) => setUser(response));
   console.log(user);
};
  

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
    >
      <Container insets={insets}>
        <Input
          label="ID"
          value={ID}
          onChangeText={_handleIDChange}
          onSubmitEditing={() => passwordRef.current.focus()}
          placeholder="ID"
          returnKeyType="next"
        />
        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={_handlePasswordChange}
          onSubmitEditing={_handleLoginButtonPress}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <ErrorText>{errorMessage}</ErrorText>
        <Button
          title="Login"
          onPress={_handleLoginButtonPress}
          disabled={disabled}
        />
        <Button
          title="Sign up with email"
          onPress={() => navigation.navigate('Signup')}
          isFilled={false}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Login;