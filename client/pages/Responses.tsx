import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Reply,
  Search,
  Filter,
  Download,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResponseMessage {
  id: string;
  originalMessage: string;
  response: string;
  fromNumber: string;
  toNumber: string;
  timestamp: string;
  status: "unread" | "read" | "replied";
  sentiment: "positive" | "negative" | "neutral";
  category: "complaint" | "inquiry" | "compliment" | "opt-out" | "other";
}

const mockResponses: ResponseMessage[] = [
  {
    id: "1",
    originalMessage:
      "Flash Sale Alert! 50% off all products today only. Use code FLASH50 at checkout.",
    response: "Thank you! Just placed my order. When will it ship?",
    fromNumber: "+1987654321",
    toNumber: "+1234567890",
    timestamp: "2024-01-14 15:30",
    status: "unread",
    sentiment: "positive",
    category: "inquiry",
  },
  {
    id: "2",
    originalMessage:
      "Reminder: Your appointment is scheduled for tomorrow at 2 PM.",
    response: "I need to reschedule. Can we move it to Friday?",
    fromNumber: "+1987654322",
    toNumber: "+1234567891",
    timestamp: "2024-01-14 14:15",
    status: "replied",
    sentiment: "neutral",
    category: "inquiry",
  },
  {
    id: "3",
    originalMessage:
      "Thank you for your purchase! Your order has been processed.",
    response: "Great service! Very satisfied with my purchase.",
    fromNumber: "+1987654323",
    toNumber: "+1234567892",
    timestamp: "2024-01-14 13:45",
    status: "read",
    sentiment: "positive",
    category: "compliment",
  },
  {
    id: "4",
    originalMessage:
      "Weekly newsletter: This week in technology and innovation.",
    response: "STOP - Please remove me from this list",
    fromNumber: "+1987654324",
    toNumber: "+1234567893",
    timestamp: "2024-01-14 12:20",
    status: "unread",
    sentiment: "negative",
    category: "opt-out",
  },
  {
    id: "5",
    originalMessage: "Your payment is overdue. Please contact us immediately.",
    response: "This is harassment! I already paid this bill.",
    fromNumber: "+1987654325",
    toNumber: "+1234567894",
    timestamp: "2024-01-14 11:10",
    status: "unread",
    sentiment: "negative",
    category: "complaint",
  },
];

export default function Responses() {
  const [responses, setResponses] = useState<ResponseMessage[]>(mockResponses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.fromNumber.includes(searchTerm) ||
      response.originalMessage.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || response.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || response.category === categoryFilter;
    const matchesSentiment =
      sentimentFilter === "all" || response.sentiment === sentimentFilter;

    return (
      matchesSearch && matchesStatus && matchesCategory && matchesSentiment
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-gray-100 text-gray-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "complaint":
        return "bg-red-100 text-red-800";
      case "inquiry":
        return "bg-blue-100 text-blue-800";
      case "compliment":
        return "bg-green-100 text-green-800";
      case "opt-out":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setResponses((prev) =>
      prev.map((response) =>
        response.id === id
          ? { ...response, status: "read" as const }
          : response,
      ),
    );
  };

  const unreadCount = responses.filter((r) => r.status === "unread").length;
  const totalResponses = responses.length;
  const positiveCount = responses.filter(
    (r) => r.sentiment === "positive",
  ).length;
  const negativeCount = responses.filter(
    (r) => r.sentiment === "negative",
  ).length;

  return (
    <DashboardLayout title="Responses">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Message Responses</h1>
            <p className="text-gray-600">
              Monitor and manage incoming SMS responses
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Reply className="w-4 h-4 mr-2" />
              Quick Reply
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-xl font-bold">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Responses</p>
                  <p className="text-xl font-bold">{totalResponses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Positive</p>
                  <p className="text-xl font-bold">{positiveCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Negative</p>
                  <p className="text-xl font-bold">{negativeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>All Responses</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search responses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="inquiry">Inquiry</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="compliment">Compliment</SelectItem>
                    <SelectItem value="opt-out">Opt-out</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sentimentFilter}
                  onValueChange={setSentimentFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiment</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResponses.map((response) => (
                <div
                  key={response.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getStatusColor(response.status)}>
                          {response.status.charAt(0).toUpperCase() +
                            response.status.slice(1)}
                        </Badge>
                        <Badge
                          className={getSentimentColor(response.sentiment)}
                        >
                          {response.sentiment.charAt(0).toUpperCase() +
                            response.sentiment.slice(1)}
                        </Badge>
                        <Badge className={getCategoryColor(response.category)}>
                          {response.category.charAt(0).toUpperCase() +
                            response.category.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Original Message:
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {response.originalMessage}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Customer Response:
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {response.response}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>From: {response.fromNumber}</span>
                          <span>To: {response.toNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {response.status === "unread" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(response.id)}
                        >
                          Mark Read
                        </Button>
                      )}

                      <Button variant="outline" size="sm">
                        <Reply className="w-4 h-4" />
                      </Button>

                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredResponses.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No responses found matching your filters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
