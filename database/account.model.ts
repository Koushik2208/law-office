import { model, models, Schema, Document, Types } from "mongoose";

export interface IAccount {
    userId: Types.ObjectId;
    provider: string;
    providerAccountId: string;
    password?: string;
}

export interface IAccountDoc extends IAccount, Document { }

const AccountSchema = new Schema<IAccount>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "Lawyer", required: true },
        provider: { type: String, required: true },
        providerAccountId: { type: String, required: true },
        password: { type: String },
    },
    { timestamps: true }
);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account = models.Account || model<IAccount>("Account", AccountSchema);

export default Account;