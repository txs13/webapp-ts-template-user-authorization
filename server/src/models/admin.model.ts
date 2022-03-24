import mongoose from "mongoose";

export interface AdminInput {
    userId: string,
    description?: string
}

const AdminSchema = new mongoose.Schema<AdminDocument>({
    userId: {type: String, required: true, unique: true},
    description: {type: String}
},{
    timestamps: true
})

export interface AdminDocument extends AdminInput, mongoose.Document {
    createdAt: Date,
    updatedAt: Date
}

const AdminModel = mongoose.model<AdminDocument>("Admin", AdminSchema)

export default AdminModel