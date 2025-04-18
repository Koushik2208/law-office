import { LawyerSpecialization } from "@/types/enums";
import { z } from "zod";

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long. " })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),

  specialization: z.nativeEnum(LawyerSpecialization).optional(),

  barNumber: z.string().optional(),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." })
      .optional(),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const LawyerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  phone: z.string().optional(),
  role: z.literal("lawyer"),
  barNumber: z.string().optional(),
  specialization: z.nativeEnum(LawyerSpecialization),
});

export const CaseSchema = z.object({
  caseNumber: z.string().min(1, { message: "Case number is required." }),
  title: z.string().min(1, { message: "Title is required." }),
  clientName: z.string().min(1, { message: "Client name is required." }),
  lawyerId: z.string().min(1, { message: "Lawyer ID is required." }),
  courtId: z.string().min(1, { message: "Court ID is required." }),
});

export const CourtSchema = z.object({
  name: z.string().min(1, { message: "Court name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  type: z.string().min(1, { message: "Court type is required." }),
});

export const HearingSchema = z.object({
  caseId: z.string().min(1, { message: "Case ID is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  type: z.string().min(1, { message: "Hearing type is required." }),
  notes: z.string().optional(),
});

export const CreateLawyerSchema = LawyerSchema;
export const UpdateLawyerSchema = LawyerSchema.partial();
export const DeleteLawyerSchema = z.object({
  id: z.string().min(1, { message: "Lawyer ID is required." }),
});

export const CreateCaseSchema = CaseSchema;
export const UpdateCaseSchema = CaseSchema.partial();
export const DeleteCaseSchema = z.object({
  id: z.string().min(1, { message: "Case ID is required." }),
});

export const CreateCourtSchema = CourtSchema;
export const UpdateCourtSchema = CourtSchema.partial();
export const DeleteCourtSchema = z.object({
  id: z.string().min(1, { message: "Court ID is required." }),
});

export const CreateHearingSchema = HearingSchema;
export const UpdateHearingSchema = HearingSchema.partial();
export const DeleteHearingSchema = z.object({
  id: z.string().min(1, { message: "Hearing ID is required." }),
});

export const SearchLawyerSchema = PaginatedSearchParamsSchema.extend({
  name: z.string().optional(),
  specialization: z.nativeEnum(LawyerSpecialization).optional(),
});

export const SearchCaseSchema = PaginatedSearchParamsSchema.extend({
  lawyerId: z.string().optional(),
  courtId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const SearchCourtSchema = PaginatedSearchParamsSchema.extend({
  type: z.string().optional(),
});

export const SearchHearingSchema = PaginatedSearchParamsSchema.extend({
  caseId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
