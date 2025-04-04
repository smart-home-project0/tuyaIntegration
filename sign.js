import crypto from "crypto"
 import dotenv from "dotenv"

 dotenv.config();
// הפרטים של הלקוח
const client_id = process.env.ACCSESS_KEY;
const client_secret =process.env.SECRET_KEY;

// יצירת חותמת זמן
const timestamp = Date.now().toString();
console.log("Timestamp:", timestamp);

// יצירת המחרוזת לחתימה
const stringToSign = client_id + timestamp + client_secret;

// יצירת החתימה
const signature = crypto.createHmac('sha256', client_secret).update(stringToSign).digest('hex');

console.log("Signature:", signature);
