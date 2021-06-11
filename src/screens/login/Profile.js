import React, { useContext, useState, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import {SliderComponent, Text} from 'react-native'
import { UserContext, ProgressContext } from '../../contexts';
import {Button} from '../../components'
import ProfilePresenter from './profilePresneter'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;


const Profile = ({navigation}) => {
    const { dispatch } = useContext(UserContext);
    const theme = useContext(ThemeContext);
    const user = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);
    const [profile, setProfile] = useState([{user_Id : null, usr_Address : null, usr_Birth : null, usr_Day : null, usr_Email : null, usr_Id : null, usr_Name : null, usr_Nickname : null, usr_Pwd : null, usr_Rdate : null}]);
  
    const _handleLogoutButtonPress = async () => {
        try {
          spinner.start();
        } catch (e) {
          console.log('[Profile] logout: ', e.message);
        } finally {
          dispatch({usr_Id : null, usr_Name : null});
         spinner.stop();
        }
      };
  
    return(
      <KeyboardAwareScrollView extraScrollHeight={20} style={{marginBottom:30, width:'100%'}}>
        <Container>
            <Text style={{fontSize: 50, textAlign : 'center',marginBottom : 50}}> Profile </Text>
            <Text style={{fontSize: 20, textAlign : 'center',marginBottom : 50}}>{user.user.usr_Name}님 반갑습니다.</Text>
            <ProfilePresenter/>
            <Button title="Home" onPress={()=>navigation.navigate('Home')} containerStyle={{marginTop: 50, width : 270}}/>
            <Button
                title="logout"
                onPress={_handleLogoutButtonPress}
                containerStyle={{ marginTop: 30, backgroundColor: theme.buttonLogout, width : 270 }}
            />
            <Button title="좋아요게시물" onPress={()=>navigation.navigate('MyGoodBoard')} containerStyle={{marginTop: 50, backgroundColor:'green',width : 270}}/>
            <Button title="좋아요레시피" onPress={()=>navigation.navigate('MyGoodRecipe')} containerStyle={{ marginTop: 30, backgroundColor:'green', width : 270 }}/>
        </Container>
        </KeyboardAwareScrollView>
    )
}


export default Profile;