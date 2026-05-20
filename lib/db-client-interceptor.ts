'use client';

// Client-side Database Interceptor for VibeDesk
// Optimized: uses in-memory cache to avoid repeated localStorage parsing

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
        { id: 'c1', content: 'Started investigating the issue', userId: '1', userName: 'Admin User', isInternal: false, createdAt: '2026-04-09T00:00:00.000Z' },
        { id: 'c2', content: 'Found bug in mobile responsive CSS', userId: '1', userName: 'Admin User', isInternal: true, createdAt: '2026-04-09T00:00:00.000Z' },
      ],
      attachments: [],
      history: [
        { id: 'h1', action: 'created', oldValue: null, newValue: 'TICKET-001 created', changedAt: '2026-04-08T00:00:00.000Z' },
        { id: 'h2', action: 'status_changed', oldValue: 'OPEN', newValue: 'IN_PROGRESS', changedAt: '2026-04-09T00:00:00.000Z' },
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
        { id: 'h1', action: 'created', oldValue: null, newValue: 'TICKET-002 created', changedAt: '2026-04-09T00:00:00.000Z' },
      ],
    },
    {
      id: '3',
      ticketNumber: 'TICKET-003',
      title: 'Dashboard chart not rendering',
      description: 'Pie chart on analytics dashboard shows blank when data is empty.',
      category: 'BUG',
      priority: 'LOW',
      status: 'OPEN',
      createdBy: '1',
      createdByName: 'Admin User',
      createdByEmail: 'admin@fitrahpro.com',
      assignedTo: null,
      assignedName: null,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-01T00:00:00.000Z',
      resolutionTime: null,
      comments: [],
      attachments: [],
      history: [
        { id: 'h1', action: 'created', oldValue: null, newValue: 'TICKET-003 created', changedAt: '2026-05-01T00:00:00.000Z' },
      ],
    },
    {
      id: '4',
      ticketNumber: 'TICKET-004',
      title: 'SLA timer auto-pause on weekend',
      description: 'SLA countdown should pause during non-working hours and weekends automatically.',
      category: 'FEATURE_REQUEST',
      priority: 'HIGH',
      status: 'RESOLVED',
      createdBy: '1',
      createdByName: 'Admin User',
      createdByEmail: 'admin@fitrahpro.com',
      assignedTo: '1',
      assignedName: 'Admin User',
      createdAt: '2026-05-10T00:00:00.000Z',
      updatedAt: '2026-05-15T00:00:00.000Z',
      resolutionTime: '2026-05-15T00:00:00.000Z',
      comments: [],
      attachments: [],
      history: [
        { id: 'h1', action: 'created', oldValue: null, newValue: 'TICKET-004 created', changedAt: '2026-05-10T00:00:00.000Z' },
        { id: 'h2', action: 'status_changed', oldValue: 'OPEN', newValue: 'RESOLVED', changedAt: '2026-05-15T00:00:00.000Z' },
      ],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'VibeDesk SLA Monitoring',
      location: 'Jakarta, Indonesia',
      description: 'Pembangunan platform VibeDesk SLA Monitoring untuk manajemen tiket dan pemantauan SLA secara real-time.',
      status: 'In Progress',
      progress: 65,
      budgetAmount: 500000000,
      spentAmount: 325000000,
      startDate: '2023-01-15T00:00:00.000Z',
      estimatedCompletion: '2025-12-31T00:00:00.000Z',
      phases: [
        { id: 'p1', name: 'Foundation & Architecture', progress: 100 },
        { id: 'p2', name: 'Core Ticketing System', progress: 85 },
        { id: 'p3', name: 'SLA Dashboard & Analytics', progress: 40 },
        { id: 'p4', name: 'Testing & Go-Live', progress: 0 },
      ],
    },
  ],
};

// ── In-Memory Cache (avoids repeated JSON.parse on every fetch) ──
let _memCache: any = null;

function getLocalDB() {
  // Return cache if already loaded
  if (_memCache) return _memCache;

  if (typeof window === 'undefined') {
    _memCache = INITIAL_DB;
    return _memCache;
  }

  const raw = localStorage.getItem('vibedesk_db');
  if (!raw) {
    _memCache = JSON.parse(JSON.stringify(INITIAL_DB)); // deep clone
    localStorage.setItem('vibedesk_db', JSON.stringify(_memCache));
  } else {
    _memCache = JSON.parse(raw);
  }
  return _memCache;
}

function saveLocalDB(db: any) {
  _memCache = db; // update cache immediately
  if (typeof window !== 'undefined') {
    // Debounced write to localStorage to avoid blocking the UI
    clearTimeout((window as any).__vibedesk_save_timer);
    (window as any).__vibedesk_save_timer = setTimeout(() => {
      localStorage.setItem('vibedesk_db', JSON.stringify(db));
    }, 100);
  }
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function initClientInterceptor() {
  if (typeof window === 'undefined' || (window as any).__vibedesk_intercepted) return;

  (window as any).__vibedesk_intercepted = true;

  // Pre-load DB into memory on init (no delay on first fetch)
  getLocalDB();

  const originalFetch = window.fetch;

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;

    let urlPath = urlStr;
    if (urlStr.startsWith('http')) {
      try { urlPath = new URL(urlStr).pathname + new URL(urlStr).search; } catch {}
    }

    // ── Tickets API ──
    if (urlPath.startsWith('/api/tickets')) {
      const db = getLocalDB();
      const method = (init?.method ?? 'GET').toUpperCase();
      const cleanPath = urlPath.split('?')[0];
      const segs = cleanPath.split('/').filter(Boolean);

      // GET /api/tickets
      if (method === 'GET' && segs.length === 2) {
        const sp = new URLSearchParams(urlPath.split('?')[1] || '');
        let tickets = db.tickets;
        const st = sp.get('status'), pr = sp.get('priority');
        if (st) tickets = tickets.filter((t: any) => t.status === st);
        if (pr) tickets = tickets.filter((t: any) => t.priority === pr);
        return Promise.resolve(jsonResponse({ success: true, data: tickets }));
      }

      // GET /api/tickets/[id]
      if (method === 'GET' && segs.length === 3) {
        const ticket = db.tickets.find((t: any) => t.id === segs[2]);
        return Promise.resolve(ticket
          ? jsonResponse({ success: true, data: ticket })
          : jsonResponse({ error: 'Ticket not found' }, 404));
      }

      // POST /api/tickets
      if (method === 'POST' && segs.length === 2) {
        try {
          const body = JSON.parse(init?.body as string);
          const newId = String(db.tickets.length > 0 ? Math.max(...db.tickets.map((t: any) => Number(t.id))) + 1 : 1);
          const newTicket = {
            id: newId,
            ticketNumber: `TICKET-${newId.padStart(3, '0')}`,
            title: body.title, description: body.description,
            category: body.category, priority: body.priority || 'MEDIUM',
            status: 'OPEN', createdBy: '1',
            createdByName: 'Admin User', createdByEmail: 'admin@fitrahpro.com',
            assignedTo: null, assignedName: null,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
            resolutionTime: null,
            dueDate: body.dueDate ? new Date(body.dueDate).toISOString() : undefined,
            comments: [], attachments: [],
            history: [{ id: 'h-' + Date.now(), action: 'created', oldValue: null, newValue: `TICKET-${newId.padStart(3, '0')} created`, changedAt: new Date().toISOString() }],
          };
          db.tickets.push(newTicket);
          saveLocalDB(db);
          return Promise.resolve(jsonResponse({ success: true, data: newTicket }, 201));
        } catch { return Promise.resolve(jsonResponse({ error: 'Bad request' }, 400)); }
      }

      // PATCH /api/tickets/[id]
      if (method === 'PATCH' && segs.length === 3) {
        const idx = db.tickets.findIndex((t: any) => t.id === segs[2]);
        if (idx === -1) return Promise.resolve(jsonResponse({ error: 'Ticket not found' }, 404));
        try {
          const body = JSON.parse(init?.body as string);
          const ticket = db.tickets[idx];
          const history = ticket.history || [];

          if (body.comment) {
            ticket.comments = [{ id: 'c-' + Date.now(), content: body.comment.content, userId: '1', userName: 'Admin User', isInternal: body.comment.isInternal || false, createdAt: new Date().toISOString() }, ...(ticket.comments || [])];
            history.push({ id: 'h-' + Date.now(), action: 'comment_added', oldValue: null, newValue: `Comment: "${body.comment.content.substring(0, 30)}..."`, changedAt: new Date().toISOString() });
          }
          if (body.status && body.status !== ticket.status) {
            history.push({ id: 'h-' + Date.now() + '-s', action: 'status_changed', oldValue: ticket.status, newValue: body.status, changedAt: new Date().toISOString() });
            ticket.status = body.status;
          }
          if (body.priority && body.priority !== ticket.priority) {
            history.push({ id: 'h-' + Date.now() + '-p', action: 'priority_changed', oldValue: ticket.priority, newValue: body.priority, changedAt: new Date().toISOString() });
            ticket.priority = body.priority;
          }
          if (body.assignedTo !== undefined && body.assignedTo !== ticket.assignedTo) {
            const name = body.assignedTo === '1' ? 'Admin User' : 'Support Agent';
            history.push({ id: 'h-' + Date.now() + '-a', action: 'assigned_to_changed', oldValue: ticket.assignedName, newValue: name, changedAt: new Date().toISOString() });
            ticket.assignedTo = body.assignedTo;
            ticket.assignedName = name;
          }
          if (body.title) ticket.title = body.title;
          if (body.description) ticket.description = body.description;
          ticket.updatedAt = new Date().toISOString();
          ticket.history = history;
          db.tickets[idx] = ticket;
          saveLocalDB(db);
          return Promise.resolve(jsonResponse({ success: true, data: ticket }));
        } catch { return Promise.resolve(jsonResponse({ error: 'Bad Request' }, 400)); }
      }

      // DELETE /api/tickets/[id]
      if (method === 'DELETE' && segs.length === 3) {
        const idx = db.tickets.findIndex((t: any) => t.id === segs[2]);
        if (idx === -1) return Promise.resolve(jsonResponse({ error: 'Ticket not found' }, 404));
        db.tickets.splice(idx, 1);
        saveLocalDB(db);
        return Promise.resolve(jsonResponse({ success: true, message: 'Ticket deleted successfully' }));
      }
    }

    // ── Projects API ──
    if (urlPath.startsWith('/api/projects')) {
      const db = getLocalDB();
      const method = (init?.method ?? 'GET').toUpperCase();
      const segs = urlPath.split('?')[0].split('/').filter(Boolean);

      // GET /api/projects
      if (method === 'GET' && segs.length === 2)
        return Promise.resolve(jsonResponse({ success: true, data: db.projects }));

      // GET /api/projects/[id]
      if (method === 'GET' && segs.length === 3) {
        const project = db.projects.find((p: any) => p.id === segs[2]);
        if (!project) return Promise.resolve(jsonResponse({ error: 'Project not found' }, 404));
        return Promise.resolve(jsonResponse({ success: true, data: {
          ...project,
          documents: [
            { id: 'd1', title: 'Master Plan', docType: 'BLUEPRINT', uploadedAt: new Date().toISOString() },
            { id: 'd2', title: 'SPR Document', docType: 'SPR', uploadedAt: new Date().toISOString() },
          ],
          milestones: [{ id: 'm1', title: 'Structural Completion', dueDate: new Date().toISOString(), status: 'Completed', priority: 'High' }],
          analytics: [],
        }}));
      }

      // POST /api/projects
      if (method === 'POST' && segs.length === 2) {
        try {
          const body = JSON.parse(init?.body as string);
          const newId = String(db.projects.length > 0 ? Math.max(...db.projects.map((p: any) => Number(p.id))) + 1 : 1);
          const newProject = {
            id: newId, name: body.name, location: body.location,
            description: body.description || '',
            startDate: new Date(body.startDate).toISOString(),
            estimatedCompletion: body.endDate ? new Date(body.endDate).toISOString() : undefined,
            budgetAmount: Number(body.budgetAmount), spentAmount: 0,
            status: 'Planning', progress: 0,
            phases: [{ id: 'p1', name: 'Foundation', progress: 0 }, { id: 'p2', name: 'Structure', progress: 0 }, { id: 'p3', name: 'Finishing', progress: 0 }],
          };
          db.projects.push(newProject);
          saveLocalDB(db);
          return Promise.resolve(jsonResponse({ success: true, data: newProject }, 201));
        } catch { return Promise.resolve(jsonResponse({ error: 'Bad Request' }, 400)); }
      }

      // PATCH /api/projects/[id]
      if (method === 'PATCH' && segs.length === 3) {
        const idx = db.projects.findIndex((p: any) => p.id === segs[2]);
        if (idx === -1) return Promise.resolve(jsonResponse({ error: 'Project not found' }, 404));
        try {
          const body = JSON.parse(init?.body as string);
          const p = db.projects[idx];
          if (body.name) p.name = body.name;
          if (body.location) p.location = body.location;
          if (body.status) p.status = body.status;
          if (body.progress !== undefined) p.progress = Number(body.progress);
          if (body.budgetAmount !== undefined) p.budgetAmount = Number(body.budgetAmount);
          if (body.spentAmount !== undefined) p.spentAmount = Number(body.spentAmount);
          if (body.phases) p.phases = body.phases;
          db.projects[idx] = p;
          saveLocalDB(db);
          return Promise.resolve(jsonResponse({ success: true, data: p }));
        } catch { return Promise.resolve(jsonResponse({ error: 'Bad Request' }, 400)); }
      }

      // DELETE /api/projects/[id]
      if (method === 'DELETE' && segs.length === 3) {
        const idx = db.projects.findIndex((p: any) => p.id === segs[2]);
        if (idx === -1) return Promise.resolve(jsonResponse({ error: 'Project not found' }, 404));
        db.projects.splice(idx, 1);
        saveLocalDB(db);
        return Promise.resolve(jsonResponse({ success: true, message: 'Project deleted successfully' }));
      }
    }

    return originalFetch(input, init);
  };
}
