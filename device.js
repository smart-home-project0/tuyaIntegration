
import crypto from "crypto"

async function toggleDevice(accessToken, deviceId, state) {
    const t = Date.now().toString();
    const clientId = "XXX";
    const secretKey = 'XXX';

    // sign
    function signHMAC(message, secretKey) {
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(message);
        const signature = hmac.digest('hex');
        return signature;
    }
    const message = clientId + t + "POST" + "\n" + "" + "\n" + "\n" + `/v1.0/devices/${deviceId}/commands`;
    const signature = signHMAC(message, secretKey);
    const sign = signature.toString().toUpperCase();
    const signMethod = "HMAC-SHA256";

    const url = "https://openapi.tuyaeu.com/v1.0/devices/" + deviceId + "/commands";
    const headers = {
        "client_id": clientId,
        "sign": sign,
        "t": t,
        "sign_method": signMethod,
        "Authorization": "Bearer " + accessToken
    };

    const body = {
        "commands": [
            {
                "code": "switch_1",  
                "value": state // true להדלקה, false לכיבוי
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.success) {
            console.log('Device state changed successfully:', data);
        } else {
            console.log('Error changing device state:', data);
        }
    } catch (error) {
        console.error('Error toggling device:', error);
    }
}

// דוגמת קריאה לפונקציה (הדלקה או כיבוי)
const accessToken = 'XXX'; // הכנס את ה-Access Token שלך
const deviceId = 'XXX'; // הכנס את ה-Device ID שלך
const state = true; // true להדלקה, false לכיבוי

toggleDevice(accessToken, deviceId, state);
