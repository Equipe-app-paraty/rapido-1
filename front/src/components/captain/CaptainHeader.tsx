import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useCaptainStore } from '@/store/captainStore'
import { useWS } from '@/service/WSProvider'
import { useIsFocused } from '@react-navigation/native'
import { captainStyles } from '@/styles/captainStyles'
import { commonStyles } from '@/styles/commonStyles'
import { MaterialIcons } from '@expo/vector-icons'
import { logout } from '@/service/authService'
import CustomText from '../shared/CustomText'
import * as Location from 'expo-location';

const CaptainHeader = () => {

    const { disconnect, emit } = useWS()
    const { setOnDuty, onDuty, setLocation } = useCaptainStore()
    const isFocused = useIsFocused()

    const toggleOnDuty = async () => {
        if (onDuty) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permission is required to go on duty.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude, heading } = location.coords
            setLocation({ latitude: latitude, longitude: longitude, address: 'Somewhere', heading: heading as number })
            emit('goOnDuty', {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
                heading: heading
            })
        } else {
            emit('goOffDuty')
        }
    }


    useEffect(() => {
        if (isFocused) {
            toggleOnDuty()
        }
    }, [isFocused, onDuty])

    return (
        <>
            <View style={captainStyles.headerContainer}>
                <SafeAreaView />

                <View style={commonStyles.flexRowBetween}>
                    <MaterialIcons name='menu' size={24} color="black" onPress={() => logout(disconnect)} />
                    <TouchableOpacity style={captainStyles.toggleContainer} onPress={() => setOnDuty(!onDuty)}>
                        <CustomText fontFamily='SemiBold' fontSize={12} style={{ color: '#888' }}>
                            {onDuty ? "ON-DUTY" : "OFF-DUTY"}
                        </CustomText>

                        <Image
                            source={onDuty ?
                                require('@/assets/icons/switch_on.png') :
                                require('@/assets/icons/switch_off.png')
                            }
                            style={captainStyles.icon}
                        />
                    </TouchableOpacity>

                    <MaterialIcons name="notifications" size={24} color="black" />
                </View>
            </View>

            <View style={captainStyles?.earningContainer}>
                <CustomText fontSize={13} style={{ color: '#fff' }} fontFamily='Medium'>
                    Today's Earnings
                </CustomText>

                <View style={commonStyles?.flexRowGap}>
                    <CustomText fontSize={14} style={{ color: '#fff' }} fontFamily='Medium'>₹ 231.22</CustomText>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
                </View>
            </View>

        </>
    )
}

export default CaptainHeader