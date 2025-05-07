import mongoose from 'mongoose'
const DBCONNECT =  async () => {
    try {

        let DB = await mongoose.connect(process.env.MONGODB_URI)
        if (DB.connection.readyState) {
            console.log('Connect to MongoDB')
        }
        else {
            console.log('MongoDB not Connect');
            
        }
    } 
    catch (err) { 
        console.log(err);   
        
    }
}
export default DBCONNECT