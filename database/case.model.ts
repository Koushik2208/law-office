import { CaseStatus } from "@/types/enums";
import { model, models, Schema, Document, Types } from "mongoose";

export interface ICase {
  caseNumber: string;
  title: string;
  clientName: string;
  lawyerId: Types.ObjectId;
  courtId: Types.ObjectId;
  hearingIds: Types.ObjectId[];
  status: CaseStatus;
}

export interface ICaseDoc extends ICase, Document {}

const CaseSchema = new Schema<ICase>(
  {
    caseNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    clientName: { type: String, required: true },
    lawyerId: { type: Schema.Types.ObjectId, required: true, ref: "Lawyer" },
    courtId: { type: Schema.Types.ObjectId, required: true, ref: "Court" },
    hearingIds: { type: [Schema.Types.ObjectId], default: [] },
    status: {
      type: String,
      enum: Object.values(CaseStatus),
      default: CaseStatus.Pending,
    },
  },
  { timestamps: true }
);

const Case = models.Case || model<ICase>("Case", CaseSchema);

export default Case;
