import { model, models, Schema, Document } from "mongoose";

export enum LawyerRole {
  Admin = "admin",
  Lawyer = "lawyer",
}

export interface ILawyer {
  name: string;
  specialization: string;
  caseCount: number;
  role: LawyerRole;
}

export interface ILawyerDoc extends ILawyer, Document {}

const LawyerSchema = new Schema<ILawyer>(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    caseCount: { type: Number, default: 0 },
    role: {
      type: String,
      enum: Object.values(LawyerRole),
      default: LawyerRole.Lawyer,
    },
  },
  { timestamps: true }
);

const Lawyer = models.Lawyer || model<ILawyer>("Lawyer", LawyerSchema);

export default Lawyer; 