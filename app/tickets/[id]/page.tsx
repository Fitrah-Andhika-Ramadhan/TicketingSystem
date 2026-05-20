'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Send, Clock, User, Calendar } from 'lucide-react';

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      setUser(JSON.parse(storedUser));
      fetchTicket(token);
    };

    checkAuth();
  }, [router]);

  const fetchTicket = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setTicket(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // Mock comment addition
      const newComment = {
        id: `c${Date.now()}`,
        content: comment,
        userId: user.id,
        userName: user.name,
        isInternal: false,
        createdAt: new Date(),
      };

      if (ticket) {
        setTicket({
          ...ticket,
          comments: [newComment, ...(ticket.comments || [])],
        });
      }

      setComment('');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading ticket...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Ticket not found</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{ticket.ticketNumber}</h1>
                <p className="text-gray-600 mt-1">{ticket.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Ticket Details */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Ticket Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-2">Description</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">Category</p>
                        <p className="text-gray-900">{ticket.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">Priority</p>
                        <p className={`font-semibold ${
                          ticket.priority === 'CRITICAL' ? 'text-red-600' :
                          ticket.priority === 'HIGH' ? 'text-orange-600' :
                          ticket.priority === 'MEDIUM' ? 'text-blue-600' :
                          'text-green-600'
                        }`}>
                          {ticket.priority}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comments & Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Comment */}
                    <div className="pb-6 border-b">
                      <textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <Button variant="outline" onClick={() => setComment('')}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddComment}
                          disabled={!comment.trim() || submitting}
                          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          {submitting ? 'Sending...' : 'Send Comment'}
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {ticket.comments && ticket.comments.length > 0 ? (
                        ticket.comments.map((comment: any) => (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-semibold text-gray-900">{comment.userName}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {comment.isInternal && (
                              <p className="text-xs text-red-600 font-semibold mb-2">INTERNAL NOTE</p>
                            )}
                            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No comments yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </CardContent>
                </Card>

                {/* Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Assigned To</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <p className="text-gray-900">{ticket.assignedName || 'Unassigned'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Created</p>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {ticket.dueDate && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Due Date</p>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Clock className="w-4 h-4" />
                          {new Date(ticket.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Creator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Created By</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <p className="text-gray-900">{ticket.createdByName}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
