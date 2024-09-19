'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from 'framer-motion';
import React from "react";

type MessageProps = {
  message: Message;
  handleOptionSelect: (nextStep: number | 'resolve' | 'escalate') => void;
};

const Message = React.forwardRef<HTMLDivElement, MessageProps>(({ message, handleOptionSelect }, ref) => (
  <motion.div ref={ref} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback>{message.sender.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <motion.div className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
        {message.text}
        {message.options && (
          <RadioGroup className="mt-2 space-y-1">
            {message.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem id={`option-${message.id}-${index}`} value={option.text} onClick={() => handleOptionSelect(option.nextStep)} />
                <Label htmlFor={`option-${message.id}-${index}`}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </motion.div>
    </div>
  </motion.div>
));

export default Message;