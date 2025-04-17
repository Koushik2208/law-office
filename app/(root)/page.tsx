import { 
  getDashboardStats, 
  getRecentCases, 
  getUpcomingHearings, 
  getCaseStatusDistribution, 
  getHearingsByMonth 
} from "@/lib/actions/dashboard.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Suspense } from "react";

// Stats Cards Component
async function StatsCards() {
  const stats = await getDashboardStats();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCases}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeCases} active cases
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hearings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHearings}</div>
          <p className="text-xs text-muted-foreground">
            {stats.upcomingHearings} upcoming hearings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Recent Cases Component
async function RecentCases() {
  const cases = await getRecentCases();
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Cases</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {cases.map((caseItem: any) => (
              <div key={caseItem._id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {caseItem.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {caseItem.caseNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{caseItem.status}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {caseItem.lawyerId?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Upcoming Hearings Component
async function UpcomingHearings() {
  const hearings = await getUpcomingHearings();
  
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Hearings</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {hearings.map((hearing: any) => (
              <div key={hearing._id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {hearing.caseId?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(hearing.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {hearing.caseId?.caseNumber}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Case Status Distribution Component
async function CaseStatusDistribution() {
  const statuses = await getCaseStatusDistribution();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {statuses.map((status: any) => (
            <div key={status._id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium capitalize">{status._id}</p>
              </div>
              <p className="text-sm font-medium">{status.count}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Hearings by Month Component
async function HearingsByMonth() {
  const monthlyData = await getHearingsByMonth();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hearings by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {monthlyData.map((month: any) => (
            <div key={month._id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {new Date(2000, month._id - 1).toLocaleString('default', { month: 'long' })}
                </p>
              </div>
              <p className="text-sm font-medium">{month.count}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton Components
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Suspense fallback={<ListSkeleton />}>
          <RecentCases />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <UpcomingHearings />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<ListSkeleton />}>
          <CaseStatusDistribution />
        </Suspense>

        <Suspense fallback={<ListSkeleton />}>
          <HearingsByMonth />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
