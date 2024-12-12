import { View, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomText from '@/components/shared/CustomText';
import PhoneInput from '@/components/shared/PhoneInput';
import CustomButton from '@/components/shared/CustomButton';
import { signin } from '@/service/authService';
import { useWS } from '@/service/WSProvider';


const Auth = () => {
  const { updateAccessToken } = useWS()

  const [phone, setPhone] = useState('')


  const handleNext = async () => {
    if (!phone && phone.length !== 10) {
      Alert.alert("Bro enter your phone number")
      return
    }
    signin({ role: 'captain', phone }, updateAccessToken)
  }

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>

        <View style={commonStyles.flexRowBetween}>
          <Image source={require('@/assets/images/captain_logo.png')} style={authStyles.logo} />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color='grey' />
            <CustomText fontFamily='Medium' variant='h7'>Help</CustomText>
          </TouchableOpacity>
        </View>


        <CustomText fontFamily='Medium' variant='h6'>
          Good to see you, Captain!
        </CustomText>

        <CustomText variant='h7' fontFamily='Regular' style={commonStyles.lightText}>
          Enter your phone number to proceed
        </CustomText>

        <PhoneInput
          onChangeText={setPhone}
          value={phone}
        />

      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomText variant='h8' fontFamily='Regular' style={[commonStyles.lightText, { textAlign: 'center', marginHorizontal: 20 }]}>
          By continuing, you agree to the terms and privacy policy of Rapido
        </CustomText>
        <CustomButton
          title="Next"
          onPress={handleNext}
          loading={false}
          disabled={false}
        />
      </View>

    </SafeAreaView>
  )
}

export default Auth