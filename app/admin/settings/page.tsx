'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Database, Lock, Bell, Save } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    projectName: 'FitrahPro',
    location: 'Jakarta, Indonesia',
    companyName: 'FitrahPro',
    email: 'fitrahramdhan31@gmail.com',
    phone: '+62-21-XXXX-XXXX',
    budgetAlertThreshold: 85,
    delayAlertDays: 5,
    notificationsEnabled: true,
    emailNotifications: true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vibedesk_settings');
      if (stored) {
        try {
          setSettings(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      
      // Only allow SUPER_ADMIN and ADMIN roles
      if (!['SUPER_ADMIN', 'ADMIN'].includes(parsedUser.role)) {
        router.push('/dashboard');
        return;
      }

      setUser(parsedUser);
    };

    checkAuth();
  }, [router]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value,
    });
    setChanged(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibedesk_settings', JSON.stringify(settings));
    }
    setChanged(false);
    toast.success('Pengaturan sistem berhasil disimpan secara permanen!');
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
              <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
            </div>

            {/* Project Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Project Information
                </CardTitle>
                <CardDescription>Basic project details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <Input
                      value={settings.projectName}
                      onChange={(e) => handleSettingChange('projectName', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <Input
                      value={settings.location}
                      onChange={(e) => handleSettingChange('location', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <Input
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange('companyName', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input
                      value={settings.phone}
                      onChange={(e) => handleSettingChange('phone', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Thresholds */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Alert Thresholds
                </CardTitle>
                <CardDescription>Configure when alerts should be triggered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Alert Threshold (%)
                    </label>
                    <Input
                      type="number"
                      value={settings.budgetAlertThreshold}
                      onChange={(e) => handleSettingChange('budgetAlertThreshold', parseInt(e.target.value))}
                      className="w-full"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when budget utilization exceeds this percentage</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delay Alert Days
                    </label>
                    <Input
                      type="number"
                      value={settings.delayAlertDays}
                      onChange={(e) => handleSettingChange('delayAlertDays', parseInt(e.target.value))}
                      className="w-full"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when schedule delay exceeds this many days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationsEnabled}
                      onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable All Notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Database Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Information
                </CardTitle>
                <CardDescription>System database statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Database Type</p>
                    <p className="text-lg font-semibold text-gray-900">PostgreSQL</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="text-lg font-semibold text-green-600">Connected</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Version</p>
                    <p className="text-lg font-semibold text-gray-900">14.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage security and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Two-Factor Authentication</p>
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Session Timeout</p>
                  <p className="text-sm text-gray-600">Sessions expire after 24 hours of inactivity</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Password Policy</p>
                  <p className="text-sm text-gray-600">Minimum 8 characters, with uppercase, lowercase, and numbers</p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4 sticky bottom-0 bg-white p-4 rounded-lg shadow">
              <Button variant="outline" onClick={() => {
                setChanged(false);
                window.location.reload();
              }}>
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
                disabled={!changed}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
