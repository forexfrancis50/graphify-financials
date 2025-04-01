
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { financialFAQ } from "@/data/financialFAQ";

// The API key should ideally be stored in a secure environment variable or in Supabase
// For demonstration purposes, we're using it directly, but this is not recommended for production
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

  // Function to check if the user query matches any FAQ
  const checkFAQs = (query: string): string | null => {
    const normalizedQuery = query.toLowerCase();
    
    for (const faq of financialFAQ) {
      // Check if the question contains keywords from the FAQ
      if (
        faq.question.toLowerCase().includes(normalizedQuery) ||
        normalizedQuery.includes(faq.question.toLowerCase().split(" ").slice(0, 3).join(" "))
      ) {
        return faq.answer;
      }
    }
    
    return null;
  };

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
      // First check if we have a matching FAQ
      const faqAnswer = checkFAQs(content);
      
      if (faqAnswer) {
        // Use the FAQ answer directly
        const assistantMessage: Message = {
          role: "assistant",
          content: faqAnswer,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }
      
      // Switching to a more reliable endpoint and model
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/opt-350m", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Financial Assistant: ${content}\nAnswer:`,
          parameters: {
            max_new_tokens: 256,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        
        // Fallback to a predefined response if the API fails
        const fallbackMessage: Message = {
          role: "assistant",
          content: "I'm currently having trouble connecting to my knowledge base. Let me provide some general guidance on financial modeling: Financial models help assess value, risk, and return of assets or investments. They require careful assumptions, sensitivity analysis, and clear documentation. Is there a specific financial concept you'd like me to explain?",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, fallbackMessage]);
        return;
      }

      const data = await response.json();
      console.log("API Success Response:", data);
      
      let assistantResponse = data[0]?.generated_text || "I couldn't generate a response. Please try again.";

      // Simplify response by removing the prompt
      assistantResponse = assistantResponse.replace(/Financial Assistant:.*?\nAnswer:/s, "").trim();
      
      // Remove any incomplete sentences at the end
      const lastPeriodIndex = assistantResponse.lastIndexOf('.');
      if (lastPeriodIndex > 0 && lastPeriodIndex < assistantResponse.length - 1) {
        assistantResponse = assistantResponse.substring(0, lastPeriodIndex + 1);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Hugging Face API:", error);
      
      // Add fallback assistant message
      const fallbackMessage: Message = {
        role: "assistant",
        content: "I'm currently having trouble connecting to my knowledge base. Please try again later or ask a different question about financial modeling.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
      toast.error("Failed to get response from the chatbot. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
