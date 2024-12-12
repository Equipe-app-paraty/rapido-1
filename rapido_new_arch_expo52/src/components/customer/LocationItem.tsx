import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { FC } from 'react'
import { commonStyles } from '@/styles/commonStyles'
import { locationStyles } from '@/styles/locationStyles'
import CustomText from '@/components/shared/CustomText'
import { uiStyles } from '@/styles/uiStyles'
import { Ionicons } from '@expo/vector-icons'

const LocationItem: FC<{
    item: any,
    onPress: () => void
}> = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={[commonStyles.flexRowBetween, locationStyles.container]}
            onPress={onPress}
        >
            <View style={commonStyles.flexRow}>
                <Image source={require('@/assets/icons/map_pin2.png')} style={uiStyles.mapPinIcon} />
                <View style={{width:'83%'}}>
                    <CustomText fontFamily='Medium' numberOfLines={1} fontSize={12}>
                        {item?.title}
                    </CustomText>
                    <CustomText fontFamily='Regular' numberOfLines={1} style={{ opacity: 0.7, marginTop: 2 }} fontSize={10}>
                        {item?.description}
                    </CustomText>
                </View>
            </View>

            <Ionicons name="heart-outline" size={20} color="#ccc" />

        </TouchableOpacity>
    )
}

export default LocationItem