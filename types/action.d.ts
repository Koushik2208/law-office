interface PaginatedSearchParams {
    page?: string;
    pageSize?: string;
    query?: string;
    filter?: string;
    sort?: string;
}

interface CreateCaseParams {
    caseNumber: string;
    title: string;
    clientName: string;
    lawyerId: string;
    courtId: string;
    status?: "pending" | "disposed";
}

interface UpdateCaseParams extends Partial<CreateCaseParams> {
    id: string;
}

interface CreateHearingParams {
    caseId: string;
    date: string;
    description: string;
}

interface UpdateHearingParams extends Partial<CreateHearingParams> {
    id: string;
}

interface CreateCourtParams {
    name: string;
    location: string;
}

interface UpdateCourtParams extends Partial<CreateCourtParams> {
    id: string;
}

interface CreateLawyerParams {
    name: string;
    email: string;
    password?: string;
    barNumber?: string;
    specialization: "Criminal Law" | "Civil Law" | "Family Law" | "Corporate Law" | "Immigration Law" | "Other";
    role?: "admin" | "lawyer" | "guest";
}

interface UpdateLawyerParams extends Partial<CreateLawyerParams> {
    id: string;
}

interface GetCasesParams extends PaginatedSearchParams {
    lawyerId?: string;
    courtId?: string;
    status?: "pending" | "disposed";
    startDate?: string;
    endDate?: string;
}

interface GetHearingsParams extends PaginatedSearchParams {
    caseId?: string;
    courtId?: string;
    lawyerId?: string;
    status?: "pending" | "disposed";
    startDate?: string;
    endDate?: string;
}

interface GetCourtsParams extends PaginatedSearchParams { }

interface GetLawyersParams extends PaginatedSearchParams {
    specialization?: "Criminal Law" | "Civil Law" | "Family Law" | "Corporate Law" | "Immigration Law" | "Other";
    name?: string;
}

interface AuthCredentials {
    name: string;
    email: string;
    password?: string;
    role?: "admin" | "lawyer" | "guest";
    specialization?: "Criminal Law" | "Civil Law" | "Family Law" | "Corporate Law" | "Immigration Law" | "Other";
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

interface GetDashboardStatsParams {
    startDate?: string;
    endDate?: string;
}

interface GetRecentCasesParams {
    limit?: number;
}

interface GetUpcomingHearingsParams {
    limit?: number;
}

interface GetCaseStatusDistributionParams {
    startDate?: string;
    endDate?: string;
}

interface GetHearingsByMonthParams {
    year?: number;
}