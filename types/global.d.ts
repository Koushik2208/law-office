type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface Lawyer {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  specialization: string;
  barNumber?: string;
  caseCount: number;
  role: "admin" | "lawyer";
}

interface Case {
  _id: Types.ObjectId;
  caseNumber: string;
  title: string;
  clientName: string;
  lawyerId: Types.ObjectId;
  courtId: Types.ObjectId;
  hearingIds: Types.ObjectId[];
  status: "pending" | "disposed" | "unassigned";
  createdAt: string;
  updatedAt: string;
}

interface Court {
  _id: Types.ObjectId;
  name: string;
  location: string;
}

interface Hearing {
  _id: Types.ObjectId;
  caseId: Types.ObjectId;
  date: string;
  description: string;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}
