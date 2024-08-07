import mongoose, { connect } from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
            // these are the options that we need to pass in order to avoid any warnings/errors
        });
        console.log('Database connection successful');
        return mongoose.connection;
        
    } catch (error) {   
        console.error(`Error: ${error.message}`);
        process.exit(1);
        
    }
}
