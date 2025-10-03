'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'checking';
  lastChecked: Date;
  error?: string;
  responseTime?: number;
}

interface MCPStatus {
  github: ServiceStatus;
  linear: ServiceStatus;
  notion: ServiceStatus;
  supabase: ServiceStatus;
}

export default function StatusPage() {
  const [status, setStatus] = useState<MCPStatus>({
    github: { name: 'GitHub', status: 'checking', lastChecked: new Date() },
    linear: { name: 'Linear', status: 'checking', lastChecked: new Date() },
    notion: { name: 'Notion', status: 'checking', lastChecked: new Date() },
    supabase: { name: 'Supabase', status: 'checking', lastChecked: new Date() },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkService = async (serviceName: keyof MCPStatus) => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`/api/status/${serviceName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      setStatus(prev => ({
        ...prev,
        [serviceName]: {
          name: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
          status: response.ok ? 'connected' : 'error',
          lastChecked: new Date(),
          error: response.ok ? undefined : data.error,
          responseTime,
        },
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        [serviceName]: {
          name: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
          status: 'error',
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
        },
      }));
    }
  };

  const checkAllServices = useCallback(async () => {
    setIsRefreshing(true);
    
    await Promise.all([
      checkService('github'),
      checkService('linear'),
      checkService('notion'),
      checkService('supabase'),
    ]);
    
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    checkAllServices();
    
    // Check every 30 seconds
    const interval = setInterval(checkAllServices, 30000);
    
    return () => clearInterval(interval);
  }, [checkAllServices]);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'checking':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'checking':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getOverallStatus = () => {
    const services = Object.values(status);
    const connectedCount = services.filter(s => s.status === 'connected').length;
    const totalCount = services.length;
    
    if (connectedCount === totalCount) return 'All Systems Operational';
    if (connectedCount === 0) return 'All Systems Down';
    return `${connectedCount}/${totalCount} Systems Operational`;
  };

  const getOverallStatusColor = () => {
    const services = Object.values(status);
    const connectedCount = services.filter(s => s.status === 'connected').length;
    const totalCount = services.length;
    
    if (connectedCount === totalCount) return 'text-green-600';
    if (connectedCount === 0) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Purely Development Status
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            MCP Integration Status Dashboard
          </p>
          <div className={`text-xl font-semibold ${getOverallStatusColor()}`}>
            {getOverallStatus()}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={checkAllServices}
            disabled={isRefreshing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {isRefreshing ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(status).map(([key, service]) => (
            <div
              key={key}
              className={`p-6 rounded-lg border-2 ${getStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </h3>
                </div>
                {service.responseTime && (
                  <span className="text-sm text-gray-500">
                    {service.responseTime}ms
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      service.status === 'connected'
                        ? 'text-green-600'
                        : service.status === 'error'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {service.status === 'connected'
                      ? 'Connected'
                      : service.status === 'error'
                      ? 'Error'
                      : 'Checking...'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Checked:</span>
                  <span className="text-gray-900">
                    {service.lastChecked.toLocaleTimeString()}
                  </span>
                </div>

                {service.error && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      <strong>Error:</strong> {service.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Environment:</span>
              <span className="ml-2 text-gray-900">
                {process.env.NODE_ENV || 'development'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <span className="ml-2 text-gray-900">
                {new Date().toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Auto Refresh:</span>
              <span className="ml-2 text-gray-900">Every 30 seconds</span>
            </div>
            <div>
              <span className="text-gray-600">Version:</span>
              <span className="ml-2 text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            Troubleshooting
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>If services are showing as disconnected:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Check your environment variables</li>
              <li>Verify API keys and tokens are valid</li>
              <li>Ensure network connectivity</li>
              <li>Check MCP server configurations</li>
            </ul>
            <p className="mt-4">
              <strong>Need help?</strong> Check the{' '}
              <a
                href="/docs/troubleshooting"
                className="text-yellow-800 underline hover:text-yellow-900"
              >
                troubleshooting guide
              </a>{' '}
              or contact the team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
