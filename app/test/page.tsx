'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@fitrahpro.com',
          password: 'FitrahPro@2026',
        }),
      });
      const data = await response.json();
      setResult({
        status: response.status,
        success: data.success,
        data: data,
      });
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testProjects = async () => {
    setLoading(true);
    try {
      // First get a token
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@fitrahpro.com',
          password: 'FitrahPro@2026',
        }),
      });
      const loginData = await loginResponse.json();

      if (!loginData.success) {
        setResult({ error: 'Login failed' });
        return;
      }

      // Then get projects
      const response = await fetch('/api/projects', {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });
      const data = await response.json();
      setResult({
        status: response.status,
        success: data.success,
        projectCount: data.data?.length || 0,
        data: data,
      });
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>API Test Console</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={testLogin} disabled={loading} className="w-full">
              Test Login API
            </Button>
            <Button onClick={testProjects} disabled={loading} className="w-full">
              Test Projects API
            </Button>
          </div>

          {result && (
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
