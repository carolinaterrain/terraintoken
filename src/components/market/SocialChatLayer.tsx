import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface SocialChatLayerProps {
  walletAddress?: string;
}

export const SocialChatLayer = ({ walletAddress }: SocialChatLayerProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load initial messages
  useEffect(() => {
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("market-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "market_chat",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Track active users with Realtime Presence
  useEffect(() => {
    if (!walletAddress) return;

    const presenceChannel = supabase.channel("market-presence");

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        setActiveUsers(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            user: walletAddress,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [walletAddress]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("market_chat")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setMessages(data.reverse());
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !walletAddress) {
      if (!walletAddress) {
        toast({
          title: "Connect Wallet",
          description: "You need to connect your wallet to chat",
          variant: "destructive",
        });
      }
      return;
    }

    const username = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    const { error } = await supabase.from("market_chat").insert({
      user_wallet: walletAddress,
      username,
      message: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-green/60 h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-goblin-green" />
          <h3 className="text-lg font-bold">Market Chat</h3>
        </div>
        <div className="flex items-center gap-1 text-xs bg-goblin-green/20 px-2 py-1 rounded-full">
          <Users className="w-3 h-3 text-goblin-green" />
          <span className="text-goblin-green font-bold">{activeUsers}</span>
          <span className="text-muted-foreground">online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-goblin-gold/20">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            No messages yet. Start the conversation! 👋
          </p>
        ) : (
          messages.map((msg: any) => {
            const isOwnMessage = msg.user_wallet === walletAddress;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-goblin-green/20 border border-goblin-green/30"
                      : "bg-terrain-shadow"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-goblin-gold">
                      {msg.username || msg.user_wallet?.slice(0, 8) + "..."}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder={walletAddress ? "Type a message..." : "Connect wallet to chat"}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!walletAddress}
          className="bg-terrain-shadow border-border"
        />
        <Button
          onClick={sendMessage}
          disabled={!walletAddress || !newMessage.trim()}
          size="icon"
          className="bg-goblin-green text-black hover:bg-goblin-green/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {!walletAddress && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Connect your wallet above to join the conversation
        </p>
      )}
    </Card>
  );
};