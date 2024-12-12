import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    setItem: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },
    getItem: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    },
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing data:', error);
        }
    }
};

// For token storage, we'll use the same implementation
export const tokenStorage = storage;
