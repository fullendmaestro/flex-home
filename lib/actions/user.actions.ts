"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";

import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_CHAT_COLLECTION_ID: CHAT_COLLECTION_ID,
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

    const { database } = await createAdminClient();

    const newChat = await database.createDocument(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      ID.unique(),
      {
        title,
        isEscalated,
        createdAt: new Date().toISOString(),
        userId: loggedInUser.userId, // Set userId for ownership
      },
      // Define the permissions for the resource (only the owner can read and write)
      [
        `user:${loggedInUser.userId}`, // Set owner read/write permissions
      ]
    );

    return parseStringify(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
  }
};

export const fetchChatsList = async () => {
  try {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) throw new Error("Unauthorized access");

    const { database } = await createAdminClient();

    const response = await database.listDocuments(
      DATABASE_ID!,
      CHAT_COLLECTION_ID!,
      [Query.equal("userId", [loggedInUser.userId])] // Fetch only the user's chats
    );

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
