import { model, models, Schema, Document, Types } from "mongoose";

export interface IHearing {
  caseId: Types.ObjectId;
  date: string;
  description: string;
}

export interface IHearingDoc extends IHearing, Document {}

const HearingSchema = new Schema<IHearing>(
  {
    caseId: { 
      type: Schema.Types.ObjectId, 
      required: true, 
      ref: "Case" 
    },
    date: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Hearing = models.Hearing || model<IHearing>("Hearing", HearingSchema);

export default Hearing; 