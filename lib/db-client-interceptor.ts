'use client';

// Client-side Database Interceptor for VibeDesk
// Intercepts window.fetch calls to mock APIs to provide 100% client persistence across refreshes & scale-downs

const INITIAL_DB = {
  tickets: [
    {
      id: '1',
      ticketNumber: 'TICKET-001',
      title: 'Login page not loading',
      description: 'Users unable to access login page on mobile devices. This is blocking new user registrations.',
      category: 'BUG',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdBy: '1',
      createdByName: 'Admin User',
      createdByEmail: 'admin@fitrahpro.com',
      assignedTo: '1',
      assignedName: 'Admin User',
      createdAt: '2026-04-08T00:00:00.000Z',
      updatedAt: '2026-04-09T00:00:00.000Z',
      resolutionTime: null,
      dueDate: '2026-04-10T00:00:00.000Z',
      comments: [
        {
          id: 'c1',
          content: 'Started investigating the issue',
          userId: '1',
          userName: 'Admin User',
          isInternal: false,
          createdAt: '2026-04-09T00:00:00.000Z',
        },
        {
          id: 'c2',
          content: 'Found bug in mobile responsive CSS',
          userId: '1',
          userName: 'Admin User',
          isInternal: true,
          createdAt: '2026-04-09T00:00:00.000Z',
        },
      ],
      attachments: [],
      history: [
        {
          id: 'h1',
          action: 'created',
          oldValue: null,
          newValue: 'TICKET-001 created',
          changedAt: '2026-04-08T00:00:00.000Z',
        },
        {
          id: 'h2',
          action: 'status_changed',
          oldValue: 'OPEN',
          newValue: 'IN_PROGRESS',
          changedAt: '2026-04-09T00:00:00.000Z',
        },
      ],
    },
    {
      id: '2',
      ticketNumber: 'TICKET-002',
      title: 'Add dark mode feature',
      description: 'Implement dark mode throughout the application',
      category: 'FEATURE_REQUEST',
      priority: 'MEDIUM',
      status: 'OPEN',
      createdBy: '1',
      createdByName: 'Admin User',
      createdByEmail: 'admin@fitrahpro.com',
      assignedTo: null,
      assignedName: null,
      createdAt: '2026-04-09T00:00:00.000Z',
      updatedAt: '2026-04-09T00:00:00.000Z',
      resolutionTime: null,
      comments: [],
      attachments: [],
      history: [
        {
          id: 'h1',
          action: 'created',
          oldValue: null,
          newValue: 'TICKET-002 created',
          changedAt: '2026-04-09T00:00:00.000Z',
        }
      ],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'FitrahPro',
      location: 'Jakarta, Indonesia',
      description: 'Pembangunan platform FitrahPro.',
      status: 'In Progress',
      progress: 65,
      budgetAmount: 500000000,
      spentAmount: 325000000,
      startDate: '2023-01-15T00:00:00.000Z',
      estimatedCompletion: '2025-12-31T00:00:00.000Z',
      phases: [
        { id: 'p1', name: 'Foundation & Basement', progress: 100 },
        { id: 'p2', name: 'Main Structure', progress: 85 },
        { id: 'p3', name: 'Finishing & Interior', progress: 40 },
        { id: 'p4', name: 'Testing & Handover', progress: 0 },
      ],
    },
  ]
};

function getLocalDB() {
  if (typeof window === 'undefined') return INITIAL_DB;
  const data = localStorage.getItem('vibedesk_db');
  if (!data) {
    localStorage.setItem('vibedesk_db', JSON.stringify(INITIAL_DB));
    return INITIAL_DB;
  }
  return JSON.parse(data);
}

function saveLocalDB(db: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('vibedesk_db', JSON.stringify(db));
}

export function initClientInterceptor() {
  if (typeof window === 'undefined' || (window as any).__vibedesk_intercepted) return;
  
  (window as any).__vibedesk_intercepted = true;
  console.log('[VibeDesk] Initializing Client Database Interceptor...');
  
  // Make sure DB exists in localStorage
  getLocalDB();

  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Parse URL relative path
    let urlPath = urlStr;
    if (urlStr.startsWith('http')) {
      try {
        const parsed = new URL(urlStr);
        urlPath = parsed.pathname + parsed.search;
      } catch (e) {}
    }

    // Intercept Tickets API
    if (urlPath.startsWith('/api/tickets')) {
      const db = getLocalDB();
      const method = init?.method?.toUpperCase() || 'GET';
      const cleanPath = urlPath.split('?')[0];
      const pathSegments = cleanPath.split('/').filter(Boolean);

      // GET /api/tickets
      if (method === 'GET' && pathSegments.length === 2) {
        const searchParams = new URLSearchParams(urlPath.split('?')[1] || '');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');

        let filteredTickets = [...db.tickets];
        if (status) filteredTickets = filteredTickets.filter(t => t.status === status);
        if (priority) filteredTickets = filteredTickets.filter(t => t.priority === priority);

        return new Response(JSON.stringify({ success: true, data: filteredTickets }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // GET /api/tickets/[id]
      if (method === 'GET' && pathSegments.length === 3) {
        const id = pathSegments[2];
        const ticket = db.tickets.find(t => t.id === id);
        if (!ticket) {
          return new Response(JSON.stringify({ error: 'Ticket not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ success: true, data: ticket }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // POST /api/tickets
      if (method === 'POST' && pathSegments.length === 2) {
        try {
          const body = JSON.parse(init?.body as string);
          const newId = String(db.tickets.length > 0 ? Math.max(...db.tickets.map(t => Number(t.id))) + 1 : 1);
          
          const newTicket = {
            id: newId,
            ticketNumber: `TICKET-${String(newId).padStart(3, '0')}`,
            title: body.title,
            description: body.description,
            category: body.category,
            priority: body.priority || 'MEDIUM',
            status: 'OPEN',
            createdBy: '1',
            createdByName: 'Admin User',
            createdByEmail: 'admin@fitrahpro.com',
            assignedTo: null,
            assignedName: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resolutionTime: null,
            dueDate: body.dueDate ? new Date(body.dueDate).toISOString() : undefined,
            comments: [],
            attachments: [],
            history: [
              {
                id: 'h-' + Date.now(),
                action: 'created',
                oldValue: null,
                newValue: `TICKET-${String(newId).padStart(3, '0')} created`,
                changedAt: new Date().toISOString(),
              }
            ],
          };

          db.tickets.push(newTicket);
          saveLocalDB(db);

          return new Response(JSON.stringify({ success: true, data: newTicket }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
        }
      }

      // PATCH /api/tickets/[id]
      if (method === 'PATCH' && pathSegments.length === 3) {
        const id = pathSegments[2];
        const ticketIndex = db.tickets.findIndex(t => t.id === id);
        if (ticketIndex === -1) {
          return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404 });
        }

        try {
          const body = JSON.parse(init?.body as string);
          const ticket = db.tickets[ticketIndex];
          const history = ticket.history || [];

          if (body.comment) {
            ticket.comments = [
              {
                id: 'c-' + Date.now(),
                content: body.comment.content,
                userId: '1',
                userName: 'Admin User',
                isInternal: body.comment.isInternal || false,
                createdAt: new Date().toISOString(),
              },
              ...(ticket.comments || [])
            ];
            history.push({
              id: 'h-' + Date.now(),
              action: 'comment_added',
              oldValue: null,
              newValue: `Comment added: "${body.comment.content.substring(0, 30)}..."`,
              changedAt: new Date().toISOString(),
            });
          }

          if (body.status && body.status !== ticket.status) {
            history.push({
              id: 'h-' + Date.now() + '-status',
              action: 'status_changed',
              oldValue: ticket.status,
              newValue: body.status,
              changedAt: new Date().toISOString(),
            });
            ticket.status = body.status;
          }

          if (body.priority && body.priority !== ticket.priority) {
            history.push({
              id: 'h-' + Date.now() + '-priority',
              action: 'priority_changed',
              oldValue: ticket.priority,
              newValue: body.priority,
              changedAt: new Date().toISOString(),
            });
            ticket.priority = body.priority;
          }

          if (body.assignedTo && body.assignedTo !== ticket.assignedTo) {
            const assignedName = body.assignedTo === '1' ? 'Admin User' : 'Support Agent';
            history.push({
              id: 'h-' + Date.now() + '-assignment',
              action: 'assigned_to_changed',
              oldValue: ticket.assignedName,
              newValue: assignedName,
              changedAt: new Date().toISOString(),
            });
            ticket.assignedTo = body.assignedTo;
            ticket.assignedName = assignedName;
          }

          if (body.title) ticket.title = body.title;
          if (body.description) ticket.description = body.description;
          ticket.updatedAt = new Date().toISOString();
          ticket.history = history;

          db.tickets[ticketIndex] = ticket;
          saveLocalDB(db);

          return new Response(JSON.stringify({ success: true, data: ticket }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400 });
        }
      }

      // DELETE /api/tickets/[id]
      if (method === 'DELETE' && pathSegments.length === 3) {
        const id = pathSegments[2];
        const index = db.tickets.findIndex(t => t.id === id);
        if (index === -1) {
          return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404 });
        }
        db.tickets.splice(index, 1);
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true, message: 'Ticket deleted successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Intercept Projects API
    if (urlPath.startsWith('/api/projects')) {
      const db = getLocalDB();
      const method = init?.method?.toUpperCase() || 'GET';
      const cleanPath = urlPath.split('?')[0];
      const pathSegments = cleanPath.split('/').filter(Boolean);

      // GET /api/projects
      if (method === 'GET' && pathSegments.length === 2) {
        return new Response(JSON.stringify({ success: true, data: db.projects }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // GET /api/projects/[id]
      if (method === 'GET' && pathSegments.length === 3) {
        const id = pathSegments[2];
        const project = db.projects.find(p => p.id === id);
        if (!project) {
          return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
        }
        const details = {
          ...project,
          documents: [
            { id: 'd1', title: 'Master Plan', docType: 'BLUEPRINT', uploadedAt: new Date().toISOString() },
            { id: 'd2', title: 'SPR Document', docType: 'SPR', uploadedAt: new Date().toISOString() },
          ],
          milestones: [
            { id: 'm1', title: 'Structural Completion', dueDate: new Date().toISOString(), status: 'Completed', priority: 'High' },
          ],
          analytics: [],
        };
        return new Response(JSON.stringify({ success: true, data: details }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // POST /api/projects
      if (method === 'POST' && pathSegments.length === 2) {
        try {
          const body = JSON.parse(init?.body as string);
          const newId = String(db.projects.length > 0 ? Math.max(...db.projects.map(p => Number(p.id))) + 1 : 1);
          
          const newProject = {
            id: newId,
            name: body.name,
            location: body.location,
            description: body.description,
            startDate: new Date(body.startDate).toISOString(),
            endDate: body.endDate ? new Date(body.endDate).toISOString() : undefined,
            estimatedCompletion: body.endDate ? new Date(body.endDate).toISOString() : undefined,
            budgetAmount: Number(body.budgetAmount),
            spentAmount: 0,
            status: 'Planning',
            progress: 0,
            phases: [
              { id: 'p1', name: 'Foundation', progress: 0 },
              { id: 'p2', name: 'Structure', progress: 0 },
              { id: 'p3', name: 'Finishing', progress: 0 },
            ],
          };

          db.projects.push(newProject);
          saveLocalDB(db);

          return new Response(JSON.stringify({ success: true, data: newProject }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400 });
        }
      }

      // PATCH /api/projects/[id]
      if (method === 'PATCH' && pathSegments.length === 3) {
        const id = pathSegments[2];
        const index = db.projects.findIndex(p => p.id === id);
        if (index === -1) {
          return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
        }

        try {
          const body = JSON.parse(init?.body as string);
          const project = db.projects[index];

          if (body.name) project.name = body.name;
          if (body.location) project.location = body.location;
          if (body.status) project.status = body.status;
          if (body.progress !== undefined) project.progress = Number(body.progress);
          if (body.budgetAmount !== undefined) project.budgetAmount = Number(body.budgetAmount);
          if (body.spentAmount !== undefined) project.spentAmount = Number(body.spentAmount);

          db.projects[index] = project;
          saveLocalDB(db);

          return new Response(JSON.stringify({ success: true, data: project }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400 });
        }
      }

      // DELETE /api/projects/[id]
      if (method === 'DELETE' && pathSegments.length === 3) {
        const id = pathSegments[2];
        const index = db.projects.findIndex(p => p.id === id);
        if (index === -1) {
          return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
        }
        db.projects.splice(index, 1);
        saveLocalDB(db);
        return new Response(JSON.stringify({ success: true, message: 'Project deleted successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return originalFetch(input, init);
  };
}
