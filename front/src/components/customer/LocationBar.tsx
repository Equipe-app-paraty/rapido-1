import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useWS } from '@/service/WSProvider'
import { useUserStore } from '@/store/userStore'
import { uiStyles } from '@/styles/uiStyles'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/utils/Constants'
import { RFValue } from 'react-native-responsive-fontsize'
import { router } from 'expo-router'
import CustomText from '../shared/CustomText'
import { logout } from '@/service/authService'

const LocationBar = () => {
    const { location } = useUserStore()
    const { disconnect } = useWS()

    return (
        <View style={uiStyles.absoluteTop}>
            <SafeAreaView />
            <View style={uiStyles.container}>
                <TouchableOpacity style={uiStyles.btn} onPress={() => logout(disconnect)} >
                    <Ionicons name="menu-outline" size={RFValue(18)} color={Colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={uiStyles.locationBar}
                    onPress={() => router.navigate('/customer/selectlocations')}>
                    <View style={uiStyles.dot} />

                    <CustomText numberOfLines={1} style={uiStyles.locationText}>
                        {location?.address || "Getting address..."}
                    </CustomText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LocationBar