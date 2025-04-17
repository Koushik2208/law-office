import { model, models, Schema, Document } from "mongoose";

// Optional enum for a field
export enum SomeEnum {
  OptionA = "Option A",
  OptionB = "Option B",
  OptionC = "Option C",
}

// Interface representing the data structure
export interface IExampleName {
  field1: string;
  field2?: number;
  field3: boolean;
  enumField?: SomeEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for the Mongoose Document
export interface IExampleNameDoc extends IExampleName, Document {}

// Define the schema
const ExampleNameSchema = new Schema<IExampleName>(
  {
    field1: { type: String, required: true },
    field2: { type: Number },
    field3: { type: Boolean, default: false },
    enumField: {
      type: String,
      enum: Object.values(SomeEnum),
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Export the model
const ExampleName =
  models.ExampleName || model<IExampleName>("ExampleName", ExampleNameSchema);

export default ExampleName;
