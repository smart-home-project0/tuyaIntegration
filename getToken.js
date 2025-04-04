import crypto from 'crypto'


const t = Date.now().toString();
const clientId = "udk9hwada73gp838a7er";
const secretKey = 'c8f8767a506443e086277168696bb285';
//sign
function signHMAC(message, secretKey) {
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(message);
    const signature = hmac.digest('hex');
    console.log(`signature: ${signature}`);
    
    return signature;
}


const message = clientId + t + "GET" + "\n" + "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" + "\n" + "\n" + "/v1.0/token?grant_type=1";
//console.log(message)
const signature = signHMAC(message, secretKey);
//   console.log(signature);

const url = "https://openapi.tuyaeu.com/v1.0/token?grant_type=1";
const sign = signature.toString().toUpperCase();
const signMethod = "HMAC-SHA256";


const headers = {
    "client_id": clientId,
    "sign": sign,
    "t": t,
    "sign_method": signMethod
};


async function getToken() {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });
        const data = await response.json();
        if (data.success) {

            const accessToken = data.result.access_token; // מקבל את ה-Access Token
            console.log('Access Token:', accessToken);
            // getDeviceInfo(accessToken, t);

            return accessToken;  // מחזירים את הטוקן
        } else {
            console.log('Error fetching token:', data);
        }
    } catch (error) {
        console.error('Error fetching token:', error);
    }
}

getToken();
