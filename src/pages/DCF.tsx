
import { DCFModel } from "@/components/DCFModel";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const DCF = () => {
  const { sendMessage } = useChat();

  const askAboutDCF = () => {
    sendMessage("Can you explain how to interpret the results of a DCF analysis?");
  };

  return (
    <div className="container mx-auto relative">
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={askAboutDCF}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Ask about DCF</span>
        </Button>
      </div>
      <DCFModel />
    </div>
  );
};

export default DCF;
