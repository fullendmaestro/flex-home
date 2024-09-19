import { TroubleshootingOption } from "@/types"
import { Chat } from "@prisma/client"

// Simulated API calls (replace these with actual API calls in a real implementation)
export const api = {
  fetchChats: async (): Promise<Chat[]> => {
    // Simulated API call to fetch chats
    let chats = await new Promise(resolve => setTimeout(resolve, 1000))
    return chats;  // Return empty array for now
  },
  sendMessage: async (chatId: number, message: string, selectedOption?: string): Promise<Message> => {
    // Simulated API call to send a message
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate different responses based on the message or selected option
    let responseText = "I understand you're having an issue. How can I assist you further?"
    let options: TroubleshootingOption[] | undefined

    if (message.toLowerCase().includes("wifi") || selectedOption === "wifi_issue") {
      responseText = "I see you're having Wi-Fi issues. Let's troubleshoot that."
      options = [
        { text: "My hub won't connect to Wi-Fi", value: "hub_wifi_connection" },
        { text: "My devices keep disconnecting from Wi-Fi", value: "device_wifi_disconnection" },
        { text: "My Wi-Fi signal is weak", value: "weak_wifi_signal" }
      ]
    } else if (message.toLowerCase().includes("device") || selectedOption === "device_issue") {
      responseText = "I understand you're having issues with your devices. Can you specify which problem you're experiencing?"
      options = [
        { text: "Device won't pair with the hub", value: "device_pairing" },
        { text: "Device is unresponsive", value: "unresponsive_device" },
        { text: "Device is behaving erratically", value: "erratic_device" }
      ]
    }

    return {
      id: Date.now(),
      text: responseText,
      sender: 'agent',
      options: options
    }
  },
  startNewChat: async (): Promise<Chat> => {
    // Simulated API call to start a new chat
    let newChat = await new Promise(resolve => setTimeout(resolve, 1000))
    return newChat;
  },
  escalateToHuman: async (chatId: number): Promise<void> => {
    // Simulated API call to escalate chat to human support
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}