// Demo mode authentication (no database required)
import { mockUsers } from './data/mockData';

export interface DemoSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Simple in-memory session storage for demo
let currentDemoUser: DemoSession | null = null;

export function demoSignIn(email: string, password: string): DemoSession | null {
  // Demo credentials
  const validCredentials = [
    { email: 'admin@beanhavencafe.com', password: 'admin123', user: mockUsers[0] },
    { email: 'demo@beanhavencafe.com', password: 'demo123', user: mockUsers[1] },
  ];

  const match = validCredentials.find(
    cred => cred.email === email && cred.password === password
  );

  if (match) {
    currentDemoUser = {
      user: {
        id: match.user._id,
        name: match.user.name,
        email: match.user.email,
        role: match.user.role,
      }
    };
    return currentDemoUser;
  }

  return null;
}

export function demoSignOut() {
  currentDemoUser = null;
}

export function getDemoSession(): DemoSession | null {
  return currentDemoUser;
}

export function setDemoSession(session: DemoSession | null) {
  currentDemoUser = session;
}
