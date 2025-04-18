import { LawyerRole, LawyerSpecialization } from "@/types/enums";
import { model, models, Schema, Document } from "mongoose";

export interface ILawyer {
  name: string;
  email: string;
  specialization: LawyerSpecialization; 
  caseCount: number;
  role: LawyerRole;
  barNumber?: string;
}

export interface ILawyerDoc extends ILawyer, Document { }

const LawyerSchema = new Schema<ILawyer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    specialization: {
      type: String,
      enum: Object.values(LawyerSpecialization), 
      required: true,
      default: LawyerSpecialization.Other,
    },
    caseCount: { type: Number, default: 0 },
    role: {
      type: String,
      enum: Object.values(LawyerRole), 
      default: LawyerRole.Guest, 
    },
    barNumber: { type: String },
  },
  { timestamps: true }
);

const Lawyer = models.Lawyer || model<ILawyer>("Lawyer", LawyerSchema);

export default Lawyer;