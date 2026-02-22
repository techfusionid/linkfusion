'use client';

import { BarChart3, Eye, MousePointer, Users, TrendingUp, TrendingDown, ArrowLeft, Globe, Monitor, Smartphone, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dummy data
const stats = {
  totalViews: 12847,
  viewsChange: 12.5,
  totalClicks: 3421,
  clicksChange: 8.3,
  clickRate: 26.6,
  clickRateChange: -2.1,
  uniqueVisitors: 4523,
  visitorsChange: 15.2,
};

const viewsData = [
  { day: 'Mon', views: 420, clicks: 112 },
  { day: 'Tue', views: 380, clicks: 98 },
  { day: 'Wed', views: 520, clicks: 145 },
  { day: 'Thu', views: 610, clicks: 178 },
  { day: 'Fri', views: 580, clicks: 156 },
  { day: 'Sat', views: 340, clicks: 89 },
  { day: 'Sun', views: 290, clicks: 72 },
];

const topLinks = [
  { title: 'My Portfolio', url: 'portfolio.com', clicks: 1247, percentage: 36.4 },
  { title: 'YouTube Channel', url: 'youtube.com/@me', clicks: 892, percentage: 26.1 },
  { title: 'Twitter/X', url: 'x.com/me', clicks: 654, percentage: 19.1 },
  { title: 'GitHub', url: 'github.com/me', clicks: 423, percentage: 12.4 },
  { title: 'Newsletter', url: 'newsletter.com', clicks: 205, percentage: 6.0 },
];

const trafficSources = [
  { source: 'Direct', visits: 2847, percentage: 44.2, icon: Globe },
  { source: 'Social Media', visits: 1523, percentage: 23.6, icon: ShareIcon },
  { source: 'Search', visits: 1102, percentage: 17.1, icon: SearchIcon },
  { source: 'Referral', visits: 982, percentage: 15.2, icon: ExternalLink },
];

const countries = [
  { country: 'Indonesia', flag: '🇮🇩', visits: 2156, percentage: 33.5 },
  { country: 'United States', flag: '🇺🇸', visits: 1247, percentage: 19.4 },
  { country: 'India', flag: '🇮🇳', visits: 892, percentage: 13.9 },
  { country: 'Brazil', flag: '🇧🇷', visits: 543, percentage: 8.4 },
  { country: 'Germany', flag: '🇩🇪', visits: 412, percentage: 6.4 },
];

const devices = [
  { device: 'Mobile', percentage: 68, icon: Smartphone },
  { device: 'Desktop', percentage: 28, icon: Monitor },
  { device: 'Tablet', percentage: 4, icon: TabletIcon },
];

// Simple chart component
function SimpleBarChart({ data }: { data: typeof viewsData }) {
  const maxViews = Math.max(...data.map(d => d.views));

  return (
    <div className="flex items-end justify-between gap-2 h-40 pt-4">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center justify-end h-32">
            <div
              className="w-full max-w-[32px] bg-primary/80 rounded-t-sm transition-all hover:bg-primary"
              style={{ height: `${(item.views / maxViews) * 100}%` }}
              title={`${item.views} views`}
            />
          </div>
          <span className="text-xs text-muted-foreground">{item.day}</span>
        </div>
      ))}
    </div>
  );
}

// Share icon component
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

// Search icon component
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// Tablet icon component
function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

// Progress bar component
function ProgressBar({ percentage, className = '' }: { percentage: number; className?: string }) {
  return (
    <div className={`h-2 bg-secondary rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 md:px-6 shrink-0 bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/editor" className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display text-lg font-bold tracking-tight">
            <span className="text-primary">Link</span>Fusion
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground text-sm mt-1">Track your profile performance and visitor engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Eye className="w-5 h-5 text-muted-foreground" />
                {stats.viewsChange > 0 ? (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{stats.viewsChange}%
                  </span>
                ) : (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {stats.viewsChange}%
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold font-display">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Views</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <MousePointer className="w-5 h-5 text-muted-foreground" />
                {stats.clicksChange > 0 ? (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{stats.clicksChange}%
                  </span>
                ) : (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {stats.clicksChange}%
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold font-display">{stats.totalClicks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Clicks</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                {stats.clickRateChange > 0 ? (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{stats.clickRateChange}%
                  </span>
                ) : (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {stats.clickRateChange}%
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold font-display">{stats.clickRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Click Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-muted-foreground" />
                {stats.visitorsChange > 0 ? (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{stats.visitorsChange}%
                  </span>
                ) : (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {stats.visitorsChange}%
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold font-display">{stats.uniqueVisitors.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Unique Visitors</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Views Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Views This Week</CardTitle>
              <CardDescription>Daily profile views for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={viewsData} />
            </CardContent>
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Device Breakdown</CardTitle>
              <CardDescription>Visitor devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {devices.map((device, i) => (
                <div key={i} className="flex items-center gap-3">
                  <device.icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{device.device}</span>
                      <span className="text-sm font-medium">{device.percentage}%</span>
                    </div>
                    <ProgressBar percentage={device.percentage} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Top Links */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Top Performing Links</CardTitle>
              <CardDescription>Most clicked links on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{link.clicks.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{link.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sources" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="sources" className="flex-1">Sources</TabsTrigger>
                  <TabsTrigger value="countries" className="flex-1">Countries</TabsTrigger>
                </TabsList>
                <TabsContent value="sources" className="mt-4 space-y-3">
                  {trafficSources.map((source, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <source.icon className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">{source.source}</span>
                          <span className="text-sm font-medium">{source.percentage}%</span>
                        </div>
                        <ProgressBar percentage={source.percentage} />
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="countries" className="mt-4 space-y-3">
                  {countries.map((country, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">{country.country}</span>
                          <span className="text-sm font-medium">{country.percentage}%</span>
                        </div>
                        <ProgressBar percentage={country.percentage} />
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
