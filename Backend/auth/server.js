import app from './src/app.js';
import connectToDB from './src/db/db.js';


connectToDB();

app.listen(3000, ()=>{
    console.log("Auth service is running on port 3000");
});