import React from 'react';
import styled from 'styled-components/native'
import {Text, Button } from 'react-native'

const Container = styled.View`
    flex : 1;
    background-color: ${({theme}) => theme.background};
`;

const BoardList = ({navigation}) => {
    return(
        <Container>
            <Text style={{fontSize: 24, textAlign : 'center'}}> BoardList </Text>
            <Button title="Home" onPress={()=>navigation.navigate('Home')}/>
        </Container>
    )
}

export default BoardList;