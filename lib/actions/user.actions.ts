"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";

import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";
import { sendMessageToGemini } from "./gemini.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_CHAT_COLLECTION_ID: CHAT_COLLECTION_ID,
  APPWRITE_MESSAGE_COLLECTION_ID: MESSAGE_COLLECTION_ID,
  APPWRITE_ESCALATED_COLLECTION_ID: ESCALATED_CHAT_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserName = async (userId: string) => {
  try {
    const { database } = await createAdminClient();
    const userDocument = await database.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId
    );
    return userDocument.name;
  } catch (error) {
    console.error("Error fetching user name:", error);
    throw error;
  }
};
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, fullName } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      fullName
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createChat = async ({ title, isEscalated }: createChatProps) => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    console.log("DATABASE_ID:", DATABASE_ID);
    console.log("CHAT_COLLECTION_ID:", CHAT_COLLECTION_ID);

    const { database } = await createAdminClient();

    // Ensure the userId is a valid reference to the user collection
    const userDocument = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [loggedInUser.userId])]
    );

    if (userDocument.total === 0) {
      throw new Error("User not found in the user collection");
    }

    const newChat = await database.createDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      ID.unique(),
      {
        title,
        isEscalated,
        createdAt: new Date().toISOString(),
        userId: loggedInUser.userId, // Set userId for ownership
      }
    );

    console.log("Chat created successfully:", newChat);
    return parseStringify(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const fetchChatsList = async () => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    console.log("Logged in user:", loggedInUser);

    const { database } = await createAdminClient();

    console.log("DATABASE_ID:", DATABASE_ID);
    console.log("CHAT_COLLECTION_ID:", CHAT_COLLECTION_ID);

    const response = await database.listDocuments(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      [Query.equal("userId", [loggedInUser.userId])] // Fetch only the user's chats
    );

    console.log("Fetched chats response:", response);

    return parseStringify(response.documents);
  } catch (error) {
    console.error("Error fetching chats list:", error);
  }
};
export const fetchChatById = async (chatId: string) => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    const { database } = await createAdminClient();

    const chat = await database.getDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      chatId
    );

    // Check if the user is authorized to access this chat
    if (chat.userId !== loggedInUser.userId) {
      throw new Error("Unauthorized access to this chat");
    }

    return parseStringify(chat);
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
  }
};

export const sendMessage = async (
  chatId: string,
  message: string,
  senderId: string
) => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    const { database } = await createAdminClient();

    // Fetch the current chat
    const chat = await database.getDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      chatId
    );

    // Check if the user is authorized to send a message to this chat
    if (chat.userId !== loggedInUser.userId) {
      throw new Error("Unauthorized to send message");
    }

    // Append new message
    const updatedMessages = [
      ...chat.messages,
      { message, senderId, timestamp: new Date().toISOString() },
    ];

    const updatedChat = await database.updateDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      chatId,
      { messages: updatedMessages }
    );

    return parseStringify(updatedChat);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const escalateChat = async (chatId: string) => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    const { database } = await createAdminClient();

    const chat = await database.getDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      chatId
    );

    // Only the chat owner can escalate the chat
    if (chat.userId !== loggedInUser.userId) {
      throw new Error("Unauthorized to escalate this chat");
    }

    const updatedChat = await database.updateDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      chatId,
      { isEscalated: true }
    );

    return parseStringify(updatedChat);
  } catch (error) {
    console.error("Error escalating chat:", error);
  }
};

export const handleSendMessage = async ({
  chatId,
  message,
}: {
  chatId: string;
  message: string;
}) => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    const senderId = loggedInUser.userId;

    const { database } = await createAdminClient();

    // Fetch the current chat
    const chat = await database.getDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      chatId
    );

    // Check if the user is authorized to send a message to this chat
    if (chat.userId !== loggedInUser.userId) {
      throw new Error("Unauthorized to send message");
    }

    // Store the user message in the Messages collection
    const userMessage = await database.createDocument(
      DATABASE_ID!,
      MESSAGE_COLLECTION_ID!,
      ID.unique(),
      {
        chatId,
        message,
        senderId,
        timestamp: new Date().toISOString(),
      }
    );

    // Send the message to Gemini and get the response
    const geminiResponse = await sendMessageToGemini(chatId, message, senderId);

    // Store the Gemini response in the AI Responses collection
    const aiResponse = await database.createDocument(
      DATABASE_ID!,
      MESSAGE_COLLECTION_ID!,
      ID.unique(),
      {
        messageId: userMessage.$id,
        response: geminiResponse,
        timestamp: new Date().toISOString(),
      }
    );

    // Append new messages to the chat
    const updatedMessages = [
      ...chat.messages,
      { message, senderId, timestamp: new Date().toISOString() },
      {
        message: geminiResponse,
        senderId: "gemini",
        timestamp: new Date().toISOString(),
      },
    ];

    // Update the chat with the new messages
    const updatedChat = await database.updateDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      chatId,
      { messages: updatedMessages }
    );

    return parseStringify(updatedChat);
  } catch (error) {
    console.error("Error handling send message:", error);
    throw error;
  }
};
