import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  Book,
  Search,
  ExternalLink,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created: string;
  updated: string;
  messages: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'SMS delivery issues with international numbers',
    status: 'open',
    priority: 'high',
    category: 'Technical Issue',
    created: '2024-01-14 15:30',
    updated: '2024-01-14 16:45',
    messages: 3
  },
  {
    id: 'TKT-002',
    subject: 'Billing question about wallet charges',
    status: 'resolved',
    priority: 'medium',
    category: 'Billing',
    created: '2024-01-13 10:20',
    updated: '2024-01-14 09:15',
    messages: 5
  },
  {
    id: 'TKT-003',
    subject: 'API rate limit increase request',
    status: 'pending',
    priority: 'low',
    category: 'Account',
    created: '2024-01-12 14:30',
    updated: '2024-01-13 11:20',
    messages: 2
  }
];

const faqData: FAQ[] = [
  {
    id: '1',
    question: 'How much does it cost to send an SMS?',
    answer: 'SMS costs $0.01 per message. The exact cost may vary based on the destination country and carrier. You can view detailed pricing in your dashboard.',
    category: 'Billing',
    helpful: 45
  },
  {
    id: '2',
    question: 'How do I buy a new phone number?',
    answer: 'Go to the "Buy Numbers" page from your dashboard. Search for available numbers by country or area code, select your preferred number, and complete the purchase. Numbers are activated immediately.',
    category: 'Phone Numbers',
    helpful: 38
  },
  {
    id: '3',
    question: 'Can I schedule SMS messages for later?',
    answer: 'Yes! When composing an SMS, click on "Schedule" and select your desired date and time. You can view and manage scheduled messages from the Scheduled page.',
    category: 'SMS Features',
    helpful: 32
  },
  {
    id: '4',
    question: 'What is the SMS delivery rate?',
    answer: 'Our SMS delivery rate is typically 98%+ for domestic messages and 95%+ for international messages. Delivery rates can vary based on carrier and destination.',
    category: 'Delivery',
    helpful: 29
  },
  {
    id: '5',
    question: 'How do I create a sub-account?',
    answer: 'Navigate to Sub-Accounts in your dashboard and click "Create Sub-Account". Fill in the details and assign permissions. You can create up to 3 sub-accounts per main account.',
    category: 'Account Management',
    helpful: 25
  },
  {
    id: '6',
    question: 'How do I set up webhooks?',
    answer: 'Go to the Webhooks page and click "Add Webhook". Enter your endpoint URL, select the events you want to receive, and save. Test your webhook to ensure it\'s working correctly.',
    category: 'Integration',
    helpful: 22
  }
];

export default function Support() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const filteredFAQs = faqData.filter(faq => 
    (searchTerm === '' || faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '' || faq.category === selectedCategory)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const handleCreateTicket = () => {
    const newTicket: SupportTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: ticketForm.subject,
      status: 'open',
      priority: ticketForm.priority as 'low' | 'medium' | 'high' | 'urgent',
      category: ticketForm.category,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      messages: 1
    };
    
    setTickets(prev => [newTicket, ...prev]);
    setShowNewTicket(false);
    setTicketForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });
  };

  const faqCategories = [...new Set(faqData.map(faq => faq.category))];
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Support Center</h1>
            <p className="text-gray-600">Get help with your account and find answers to common questions</p>
          </div>
          <Button onClick={() => setShowNewTicket(true)}>
            <MessageCircle className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Open Tickets</p>
                  <p className="text-xl font-bold">{openTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold">{pendingTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HelpCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">FAQ Articles</p>
                  <p className="text-xl font-bold">{faqData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Book className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-xl font-bold">{tickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {faqCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span>{faq.question}</span>
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <p className="text-gray-700 mb-4">{faq.answer}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{faq.helpful} people found this helpful</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">👍</Button>
                          <Button variant="ghost" size="sm">👎</Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No FAQs found matching your search</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-gray-600">Get instant help</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-gray-600">support@connectlify.com</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Book className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Documentation</h3>
                    <p className="text-sm text-gray-600">API guides & tutorials</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>

            {showNewTicket && (
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={ticketForm.category} 
                        onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Account">Account</SelectItem>
                          <SelectItem value="API">API</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={ticketForm.priority} 
                        onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Provide detailed information about your issue"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateTicket}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <span className="font-mono text-sm">{ticket.id}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <p className="text-sm text-gray-600">{ticket.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </Badge>
                    <div className="text-right text-sm text-gray-600">
                      <p>Updated: {new Date(ticket.updated).toLocaleDateString()}</p>
                      <p>{ticket.messages} messages</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
              
              {tickets.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No support tickets yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
