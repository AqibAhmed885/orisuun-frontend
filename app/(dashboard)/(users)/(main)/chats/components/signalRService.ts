import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';
const apiEndpoint = process.env.NEXT_PUBLIC_APP_BASE_URL as string;

class SignalRService {
    public connection: signalR.HubConnection;
    private isStarting: boolean = false;
    private apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
    private groupMessageListener: ((message: any) => void) | null = null;
    private communityMessageListener: ((message: any) => void) | null = null;
    private likeToggledListener: ((data: any) => void) | null = null;
    private emojiAddedListener: ((data: any) => void) | null = null;
    private emojiRemovedListener: ((data: any) => void) | null = null;
    private notificationUpdateListener: ((payload: any) => void) | null = null;

    private unreadCountListeners = new Map<string, (count: number) => void>();
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiEndpoint}/chatHub`, {
                accessTokenFactory: () => {
                    const token = localStorage.getItem("accessToken");
                    if (!token) {
                        console.error("No access token found in localStorage");
                        throw new Error("No access token found");
                    }
                    return token;
                }

            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    if (retryContext.elapsedMilliseconds < 60000) {
                        return 2000;
                    }
                    return 5000;
                }
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }

    async startConnection(userId: string) {
        if (this.isStarting) return;

        this.isStarting = true;
        try {
            if (this.connection.state === signalR.HubConnectionState.Disconnected) {
                await this.connection.start();
                await this.connection.invoke("JoinChat", userId);
            }
        } catch (err) {
            console.error('Error while starting connection:', err);
        } finally {
            this.isStarting = false;
        }
    }

    async stopConnection(userId: string) {
        try {
            if (this.connection.state === signalR.HubConnectionState.Connected) {
                await this.connection.invoke("LeaveChat", userId);
                await this.connection.stop();
            }
        } catch (err) {
            console.error('Error while stopping connection:', err);
        }
    }


    // ... rest of your methods remain the same ...
    onReceivePrivateMessage(callback: (message: any) => void) {
        this.connection.on("ReceivePrivateMessage", (messageString) => {
            try {
                const message = JSON.parse(messageString);
                callback(message);
            } catch (err) {
                console.error("Failed to parse message:", err);
            }
        });
    }

    private messageListeners = new Map<string, (message: any) => void>();

    onReceiveGroupMessage(callback: (message: any) => void) {
        // Remove any existing listener to prevent duplicates
        if (this.groupMessageListener) {
            this.connection.off("ReceiveGroupMessage", this.groupMessageListener);
        }

        this.groupMessageListener = (messageString: string) => {
            try {
                const message = JSON.parse(messageString);
                callback(message);
            } catch (err) {
                console.error("Failed to parse group message:", err);
            }
        };
        this.connection.on("ReceiveGroupMessage", this.groupMessageListener);
    }

    // Add method to clean up group message listener
    offReceiveGroupMessage() {
        if (this.groupMessageListener) {
            this.connection.off("ReceiveGroupMessage", this.groupMessageListener);
            this.groupMessageListener = null;
        }
    }



    sendPrivateMessage = async (senderId: string, receiverId: string, message: string) => {
        try {
            await this.connection.invoke("SendPrivateMessage", senderId, receiverId, message);
            // Don't trigger local state update here - let the server broadcast handle it
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    async sendGroupMessage(groupId: string, senderId: string, message: string) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke("SendMessageToGroup", groupId, senderId, message);
        } else {
            console.warn("Cannot send message - connection not established");
        }
    }

    //group management methods
    async joinGroup(groupId: string) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke("JoinGroup", groupId);
        }
    }

    async leaveGroup(groupId: string) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke("LeaveGroup", groupId);
        }
    }
    onUnreadCountUpdate(callback: (data: { SenderId: string; UnreadCount: number }) => void) {
        this.connection.on("UpdateUnreadCount", callback);
    }

    onReceiveCommunityMessage(callback: (message: any) => void) {
    if (this.communityMessageListener) {
        this.connection.off("ReceiveCommunityMessage", this.communityMessageListener);
    }

    this.communityMessageListener = (data: any) => {
        try {
            // Handle both object and string
            const message = typeof data === "string" ? JSON.parse(data) : data;
            
            callback(data);
        } catch (err) {
            console.error("Failed to handle community message:", err, data);
        }
    };
    this.connection.on("ReceiveCommunityMessage", this.communityMessageListener);
}


    // Add method to clean up community message listener
    offReceiveCommunityMessage() {
        if (this.communityMessageListener) {
            this.connection.off("ReceiveCommunityMessage", this.communityMessageListener);
            this.communityMessageListener = null;
        }
    }

    // Add these methods
    onLikeToggled(callback: (data: any) => void) {
        
        if (this.likeToggledListener) {
            this.connection.off("LikeToggled", this.likeToggledListener);
            
        }
        
        this.likeToggledListener = callback;
        this.connection.on("LikeToggled", this.likeToggledListener);
        
    }

    onEmojiAdded(callback: (data: any) => void) {
        if (this.emojiAddedListener) {
            this.connection.off("EmojiAdded", this.emojiAddedListener);
        }
        this.emojiAddedListener = callback;
        this.connection.on("EmojiAdded", this.emojiAddedListener);
    }

    onEmojiRemoved(callback: (data: any) => void) {
        if (this.emojiRemovedListener) {
            this.connection.off("EmojiRemoved", this.emojiRemovedListener);
        }
        this.emojiRemovedListener = callback;
        this.connection.on("EmojiRemoved", this.emojiRemovedListener);
    }

    // Add cleanup methods
    offLikeToggled() {
        if (this.likeToggledListener) {
            this.connection.off("LikeToggled", this.likeToggledListener);
            this.likeToggledListener = null;
        }
    }

    offEmojiAdded() {
        if (this.emojiAddedListener) {
            this.connection.off("EmojiAdded", this.emojiAddedListener);
            this.emojiAddedListener = null;
        }
    }

    offEmojiRemoved() {
        if (this.emojiRemovedListener) {
            this.connection.off("EmojiRemoved", this.emojiRemovedListener);
            this.emojiRemovedListener = null;
        }
    }

    onNotificationUpdate(callback: (payload: { notificationType: string; data?: any }) => void) {
        if (this.notificationUpdateListener) {
            this.connection.off("ReceiveNotificationUpdate", this.notificationUpdateListener);
        }

        this.notificationUpdateListener = (payload: { notificationType: string; data?: any }) => {
            callback(payload);
        };
        this.connection.on("ReceiveNotificationUpdate", this.notificationUpdateListener);
    }

    offNotificationUpdate() {
        if (this.notificationUpdateListener) {
            this.connection.off("ReceiveNotificationUpdate", this.notificationUpdateListener);
            this.notificationUpdateListener = null;
        }
    }
}

export const signalRService = new SignalRService();