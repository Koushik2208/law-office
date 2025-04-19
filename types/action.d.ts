// Case-related types
interface CreateCaseParams {
  caseNumber: string;
  title: string;
  clientName: string;
  lawyerId: Types.ObjectId;
  courtId: Types.ObjectId;
  hearingIds?: Types.ObjectId[];
  status?: "pending" | "disposed" | "unassigned";
}

interface UpdateCaseParams extends Partial<CreateCaseParams> {
  id: Types.ObjectId;
}

interface GetCasesParams extends PaginatedSearchParams {
  lawyerId?: Types.ObjectId;
  courtId?: Types.ObjectId;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface GetRecentCasesParams {
  limit?: number;
}

// Hearing-related types
interface CreateHearingParams {
  caseNumber: string;
  date: string;
  description?: string;
}

interface UpdateHearingParams extends Partial<CreateHearingParams> {
  id: Types.ObjectId;
}

interface GetHearingsParams extends PaginatedSearchParams {
  caseId?: Types.ObjectId;
  caseNumber?: string;
  startDate?: string;
  endDate?: string;
}

interface GetUpcomingHearingsParams {
  limit?: number;
}

interface GetHearingsByMonthParams {
  year?: number;
}

// Court-related types
interface GetCourtsParams extends PaginatedSearchParams {
  name?: string;
  location?: string
}

interface CreateCourtParams {
  name: string;
  location: string;
}

interface UpdateCourtParams extends Partial<CreateCourtParams> {
  id: Types.ObjectId;
}

// Lawyer-related types
interface CreateLawyerParams {
  name: string;
  email: string;
  barNumber?: string;
  specialization:
  | "Criminal Law"
  | "Civil Law"
  | "Family Law"
  | "Corporate Law"
  | "Immigration Law"
  | "Real Estate Law"
  | "Other";
  role: "admin" | "lawyer" | "guest";
}

interface UpdateLawyerParams extends Partial<CreateLawyerParams> {
  id: Types.ObjectId;
}

interface GetLawyersParams extends PaginatedSearchParams {
  specialization?: string;
  role?: string;
}

// Auth-related types
interface AuthCredentials {
  name: string;
  email: string;
  password?: string;
  role?: "admin" | "lawyer" | "guest";
  specialization?:
  | "Criminal Law"
  | "Civil Law"
  | "Family Law"
  | "Corporate Law"
  | "Immigration Law"
  | "Other";
  barNumber?: string;
}

interface SignInWithOAuthParams {
  provider: "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    username: string;
    role?: "admin" | "lawyer" | "guest";
  };
}

// Dashboard/Stats-related types
interface GetDashboardStatsParams {
  startDate?: string;
  endDate?: string;
}

interface GetCaseStatusDistributionParams {
  startDate?: string;
  endDate?: string;
}

// Common/Utility types
interface IdParams {
  id: string;
}
