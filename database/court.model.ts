import { model, models, Schema, Document } from "mongoose";

export interface ICourt {
  name: string;
  location: string;
}

export interface ICourtDoc extends ICourt, Document {}

const CourtSchema = new Schema<ICourt>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const Court = models.Court || model<ICourt>("Court", CourtSchema);

export default Court; 