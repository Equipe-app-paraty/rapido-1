import { View, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { commonStyles } from '@/styles/commonStyles'
import { splashStyles } from '@/styles/splashStyles'
import CustomText from '@/components/shared/CustomText'
import { useFonts } from 'expo-font'
import { resetAndNavigate } from '@/utils/Helpers'
import { jwtDecode } from 'jwt-decode';
import { tokenStorage } from '@/store/storage'
import { refresh_tokens } from '@/service/apiInterceptors'
import { useUserStore } from '@/store/userStore'

interface DecodedToken {
  exp: number;
}

const Main = () => {
  const [loaded] = useFonts({
    Bold: require('../assets/fonts/NotoSans-Bold.ttf'),
    Regular: require('../assets/fonts/NotoSans-Regular.ttf'),
    Medium: require('../assets/fonts/NotoSans-Medium.ttf'),
    Light: require('../assets/fonts/NotoSans-Light.ttf'),
    SemiBold: require('../assets/fonts/NotoSans-SemiBold.ttf')
  })

  const { user } = useUserStore()

  const [hasNavigated, setHasNavigated] = useState(false)


  const tokenCheck = async () => {
    try {
      const access_token = await tokenStorage.getItem('access_token');
      const refresh_token = await tokenStorage.getItem('refresh_token');

      if (access_token) {
        const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
        const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token || '');

        const currentTime = Date.now() / 1000;

        if (decodedRefreshToken?.exp < currentTime) {
          resetAndNavigate('/role')
          Alert.alert('Session Expired, please login again')
          return;
        }

        if (decodedAccessToken?.exp < currentTime) {
          try {
            await refresh_tokens()
          } catch (err) {
            console.log(err);
            Alert.alert("Refresh Token Error")
            return;
          }
        }

        if (user) {
          resetAndNavigate('/customer/home')
        } else {
          resetAndNavigate('/captain/home')
        }

        return;
      }

      resetAndNavigate('/role');
    } catch (error) {
      console.error('Error checking tokens:', error);
      resetAndNavigate('/role');
    }
  }

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(async () => {
        await tokenCheck();
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated])



  return (
    <View style={commonStyles.container}>
      <Image
        source={require('@/assets/images/logo_t.png')}
        style={splashStyles.img}
      />
      <CustomText variant='h5' fontFamily='Medium' style={splashStyles.text}>
        Made in 🇮🇳
      </CustomText>
    </View>
  )
}

export default Main