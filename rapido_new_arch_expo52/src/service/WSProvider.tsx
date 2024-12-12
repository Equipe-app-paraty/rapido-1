import { tokenStorage } from "@/store/storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./config";
import { refresh_tokens } from "./apiInterceptors";

interface WSService {
    initializeSocket: () => void;
    emit: (event: string, data?: any) => void;
    on: (event: string, cb: (data: any) => void) => void;
    off: (event: string) => void;
    removeListener: (listenerName: string) => void;
    updateAccessToken: () => void;
    disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined)

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [socketAccessToken, setSocketAccessToken] = useState<string | null>(null)
    const socket = useRef<Socket>()

    useEffect(() => {
        const getToken = async () => {
            try {
                const token = await tokenStorage.getItem('access_token');
                setSocketAccessToken(token);
            } catch (error) {
                console.error('Error getting access token:', error);
            }
        };
        getToken();
    }, [])

    useEffect(() => {
        if (socketAccessToken) {
            if (socket.current) {
                socket.current.disconnect()
            }

            socket.current = io(SOCKET_URL, {
                transports: ['websocket'],
                withCredentials: true,
                extraHeaders: {
                    access_token: socketAccessToken || ""
                }
            })

            socket.current.on('connect_error', (error) => {
                if (error.message === 'Authentication error') {
                    console.log("Auth connection error: ", error.message)
                    refresh_tokens()
                }
            })
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect()
            }
        }
    }, [socketAccessToken])


    const emit = (event: string, data: any = {}) => {
        socket.current?.emit(event, data)
    }

    const on = (event: string, cb: (data: any) => void) => {
        socket.current?.on(event, cb)
    }

    const off = (event: string) => {
        socket.current?.off(event)
    }

    const removeListener = (listenerName: string) => {
        socket?.current?.removeListener(listenerName)
    }

    const disconnect = () => {
        if (socket.current) {
            socket.current.disconnect();
            socket.current = undefined
        }
    }

    const updateAccessToken = () => {
        const getToken = async () => {
            try {
                const token = await tokenStorage.getItem('access_token');
                setSocketAccessToken(token);
            } catch (error) {
                console.error('Error getting access token:', error);
            }
        };
        getToken();
    }

    const socketService: WSService = {
        initializeSocket: () => { },
        emit,
        off,
        on,
        disconnect,
        removeListener,
        updateAccessToken
    }



    return (
        <WSContext.Provider value={socketService}>{children}</WSContext.Provider>
    )
}


export const useWS = (): WSService => {
    const socketService = useContext(WSContext);
    if (!socketService) {
        throw new Error("useWS must be used within a WSProvider");
    }
    return socketService;
};
