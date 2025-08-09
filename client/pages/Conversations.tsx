import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Send, Phone, MessageSquare, Bell } from 'lucide-react';

export default function Conversations() {
  const [selectedNumber, setSelectedNumber] = useState('');
  const [message, setMessage] = useState('');
  
  // Mock data
  const userNumbers = [
    { id: '1', number: '+1 (555) 123-4567', label: 'Primary' },
    { id: '2', number: '+1 (555) 234-5678', label: 'Business' },
    { id: '3', number: '+1 (555) 345-6789', label: 'Support' }
  ];

  const conversations = [
    { id: '1', contact: '+1 (555) 987-6543', name: 'John Doe', lastMessage: 'Hey, how are you?', time: '2:30 PM', unread: 2 },
    { id: '2', contact: '+1 (555) 876-5432', name: 'Jane Smith', lastMessage: 'Thanks for the info!', time: '1:15 PM', unread: 0 },
    { id: '3', contact: '+1 (555) 765-4321', name: 'Mike Johnson', lastMessage: 'Let me know when you\'re free', time: '12:45 PM', unread: 1 },
  ];

  const messages = [
    { id: '1', text: 'Hello! How can I help you today?', sent: false, time: '2:25 PM' },
    { id: '2', text: 'Hi, I need some information about your services', sent: true, time: '2:26 PM' },
    { id: '3', text: 'Of course! What would you like to know?', sent: false, time: '2:28 PM' },
    { id: '4', text: 'What are your pricing plans?', sent: true, time: '2:30 PM' },
  ];

  return (
    <DashboardLayout title="Conversations">
      <div className="h-full flex bg-background">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversations
              </h2>
              <Button size="sm" variant="ghost">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
            <Select value={selectedNumber} onValueChange={setSelectedNumber}>
              <SelectTrigger>
                <SelectValue placeholder="Select sending number" />
              </SelectTrigger>
              <SelectContent>
                {userNumbers.map((num) => (
                  <SelectItem key={num.id} value={num.id}>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{num.number}</span>
                      <Badge variant="secondary" className="text-xs">{num.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversations.map((conv) => (
                <Card key={conv.id} className="p-3 mb-2 cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conv.name}</h3>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{conv.contact}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 987-6543</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
