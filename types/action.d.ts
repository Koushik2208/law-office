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
    specialization: string;
    role?: "admin" | "lawyer";
}

interface UpdateLawyerParams extends Partial<CreateLawyerParams> {
    id: string;
}

interface GetCasesParams extends PaginatedSearchParams {
    lawyerId?: string;
    courtId?: string;
    status?: "pending" | "disposed";
}

interface GetHearingsParams extends PaginatedSearchParams {
    caseId?: string;
    courtId?: string;
    lawyerId?: string;
    status?: "pending" | "disposed";
}

interface GetCourtsParams extends PaginatedSearchParams {}

interface GetLawyersParams extends PaginatedSearchParams {
    role?: "admin" | "lawyer";
} 