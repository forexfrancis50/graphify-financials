
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
      // Using the text-generation API endpoint instead of the inference API
      const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: createPrompt(content, messages),
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to get response from the model");
      }

      const data = await response.json();
      console.log("API response:", data);
      
      let assistantResponse = data[0]?.generated_text || "I couldn't generate a response. Please try again.";

      // Clean up the response by extracting just the assistant's reply
      assistantResponse = extractAssistantReply(assistantResponse, content);

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

  // Create a simple prompt for the model
  const createPrompt = (userMessage: string, chatHistory: Message[]): string => {
    // Build context from chat history (last few messages)
    const recentMessages = chatHistory.slice(-4); // Take last 4 messages for context
    
    let prompt = "<s>[INST] ";
    
    // Add context from recent messages if any
    if (recentMessages.length > 0) {
      prompt += "Here's our conversation so far:\n\n";
      recentMessages.forEach(msg => {
        const role = msg.role === "user" ? "Human" : "Assistant";
        prompt += `${role}: ${msg.content}\n\n`;
      });
      prompt += "Now answer this: ";
    }
    
    prompt += `${userMessage} [/INST]`;
    
    return prompt;
  };

  // Extract just the assistant's reply from the generated text
  const extractAssistantReply = (fullText: string, userQuery: string): string => {
    // The model sometimes repeats the prompt in its output, so we'll try to extract just the response
    
    // First, try to find where the actual response starts after any instruction markers
    const instructEndIndex = fullText.lastIndexOf('[/INST]');
    if (instructEndIndex !== -1) {
      return fullText.substring(instructEndIndex + 7).trim();
    }
    
    // If no instruction markers found, try to find the response after the user's message
    const userMessageIndex = fullText.indexOf(userQuery);
    if (userMessageIndex !== -1) {
      return fullText.substring(userMessageIndex + userQuery.length).trim();
    }
    
    // If all else fails, just return the whole text
    return fullText.trim();
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
