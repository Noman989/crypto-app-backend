import mongoose from "mongoose";

const { Schema } = mongoose;

const connect_to_mongodb = async () => {
    console.log("⚙️⚙️⚙️ Connecting to MongoDB... \n");
    mongoose.connect('mongodb+srv://e4coder:123qwefast@cluster0.kuggd.mongodb.net/crypto-app?retryWrites=true&w=majority');
    console.log("⚡⚡⚡ Connected to MongoDB \n");
};

interface IUser {
    name: string;
    wallet_address: string;
    private_key: string;
    username: string;
    password: string;
}
const UserSchema = new Schema<IUser>({
    name: Schema.Types.String,
    wallet_address: Schema.Types.String,
    private_key: Schema.Types.String,
    username: { type: Schema.Types.String, unique: true },
    password: Schema.Types.String,
});
const Users = mongoose.model<IUser>('Users', UserSchema);

export {
    connect_to_mongodb,
    Users,
    IUser
};