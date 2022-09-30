import { Schema, model, models } from 'mongoose';

interface IUser {
    name: string,
    user: string,
    password: string,
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default models.User || model<IUser>("User", UserSchema)