import dotenv from "dotenv"
import crypto  from 'crypto';

dotenv.config();

const t = Date.now();
const clientId = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_KEY; // 16位密钥
const signMethod = "HMAC-SHA256";
//sign
function signHMAC(message, secretKey) {
    const hmac = crypto.createHmac('sha256', secretKey); // 创建一个HMAC对象，使用SHA256算法和指定的密钥
    hmac.update(message); // 更新HMAC状态
    const signature = hmac.digest('hex'); // 计算HMAC值并以16进制字符串形式返回
    return signature; // 返回HMAC值
}
function sha256(message) {

    
    const hash = crypto.createHash('sha256');
    hash.update(message);
    return hash.digest();
}
const message = clientId+t+"GET"+"\n"+"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"+"\n"+"\n"+"/v1.0/token?grant_type=1"; // 要签名的消息数据
const signature = signHMAC(message, secretKey); // 对消息进行签名，并将签名结果保存到变量中
const url = "https://openapi.tuyaeu.com/v1.0/token?grant_type=1";
const sign = signature.toUpperCase();
console.log(`sign ${sign}`);

fetch(url, {
    method: "GET",
    headers: {
        "client_id": clientId,
        "sign": sign,
        "t": t,
        "sign_method": signMethod
    }
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const access_token = data.result.access_token;
        const body = {
            "commands":[
                {
                    "code": "switch_1",
                    "value":true
                }
            ]
        };
        const bodys = sha256(JSON.stringify(body)).toString("hex")
        const str2 =`${clientId}${access_token}${t}POST\n${bodys}\n\n/v1.0/devices/bfcca327de01d70a53yjvi/commands`
        //console.log("eeeeeeeeeeeeeeee",str2)
        const sign2 = signHMAC(str2, secretKey).toUpperCase()
        console.log(`sign2 ${sign2}`);
        const url2 = "https://openapi.tuyaeu.com/v1.0/devices/bfcca327de01d70a53yjvi/commands";
        fetch(url2, {
            method: "POST",
            body:JSON.stringify(body),
            headers: {
                "client_id": clientId,
                "access_token":access_token,
                "sign": sign2,
                "t": t,
                "Content-Type": "application/json",
                "sign_method": signMethod,
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)

            })
    })
    .catch(error => {
        console.error(error);
        // 在这里处理错误
    });