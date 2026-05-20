import fs from 'fs';
import path from 'path';

// Define the file path for the JSON database inside the workspace
const DB_FILE = path.join(process.cwd(), 'db-mock.json');

export interface TicketComment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketHistory {
  id: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdBy: string;
  createdByName: string;
  createdByEmail: string;
  assignedTo: string | null;
  assignedName: string | null;
  createdAt: string;
  updatedAt: string;
  resolutionTime: number | null;
  dueDate?: string;
  comments: TicketComment[];
  attachments: any[];
  history: TicketHistory[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description?: string;
  status: string;
  progress: number;
  budgetAmount: number;
  spentAmount: number;
  startDate: string;
  estimatedCompletion?: string;
  endDate?: string;
  phases: ProjectPhase[];
}

export interface MockDatabase {
  tickets: Ticket[];
  projects: Project[];
}

// Default initial data to populate the app on first run
const initialData: MockDatabase = {
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
      createdByEmail: 'admin@natagroup.com',
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
      createdByEmail: 'admin@natagroup.com',
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

// Reads db from JSON file
export function readDB(): MockDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(initialData);
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read database file, returning initial data', error);
    return initialData;
  }
}

// Writes db to JSON file
export function writeDB(data: MockDatabase): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write database file', error);
  }
}
