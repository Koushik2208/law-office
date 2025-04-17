interface Lawyer {
  _id: Types.ObjectId;
  name: string;
  specialization: string;
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
  status: "pending" | "disposed";
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

