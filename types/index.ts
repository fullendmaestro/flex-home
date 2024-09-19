// export type Message = {
//     id: number
//     text: string
//     sender: 'user' | 'agent' | 'human'
//     options?: TroubleshootingOption[]
//   }

// export type TroubleshootingOption = {
//     text: string
//     nextStep: number | 'resolve' | 'escalate'
//   }

// export type Chat = {
//     id: number
//     title: string
//     messages: Message[]
//     isEscalated: boolean
//   }

declare type SignUpParams = {
  fullName: string;
  email: string;
  password: string;
};

declare type SignInParams = {
  email: string;
  password: string;
};

declare type createChatProps = {
  title: string;
  isEscalated: false;
};

type Message = {
  id: number;
  text: string;
  sender: "user" | "agent" | "human";
  options?: TroubleshootingOption[];
};

type TroubleshootingOption = {
  text: string;
  nextStep: number | "resolve" | "escalate";
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  isEscalated: boolean;
};
