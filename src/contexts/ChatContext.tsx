
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

// The API key should ideally be stored in a secure environment variable or in Supabase
// For demonstration purposes, we'll use it directly, but this is not recommended for production
const API_KEY = "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";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: createChatPrompt(messages, content),
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from the model");
      }

      const data = await response.json();
      let assistantResponse = data[0]?.generated_text || "I couldn't generate a response. Please try again.";

      // Clean up the response to remove artifacts
      assistantResponse = cleanResponse(assistantResponse);

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Hugging Face API:", error);
      toast.error("Failed to get response from the chatbot. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format messages for the Mistral model
  const createChatPrompt = (existingMessages: Message[], newMessage: string): string => {
    let prompt = "<s>";
    
    // Add existing messages
    existingMessages.forEach((msg) => {
      if (msg.role === "user") {
        prompt += `[INST] ${msg.content} [/INST]`;
      } else {
        prompt += ` ${msg.content} </s><s>`;
      }
    });
    
    // Add the new message
    prompt += `[INST] ${newMessage} [/INST]`;
    
    return prompt;
  };

  // Clean up response text
  const cleanResponse = (text: string): string => {
    // Remove trailing conversation markers, instructions, etc.
    return text.replace(/\s*<\/s><s>.*$/s, "").trim();
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
