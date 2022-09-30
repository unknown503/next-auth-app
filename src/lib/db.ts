import mongoose from 'mongoose';

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qmulkcq.mongodb.net/?retryWrites=true&w=majority`;

const ConnectMongo = async () => {
    mongoose.connect(uri)
}

export default ConnectMongo