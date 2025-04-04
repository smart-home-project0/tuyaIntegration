import { TuyaContext } from '@tuya/tuya-connector-nodejs';
import dotenv from "dotenv"

dotenv.config();

const tuya = new TuyaContext({
    baseUrl: 'https://openapi.tuyaeu.com',
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

console.log("===========device info===============");
const device = await tuya.device.detail({
    device_id: 'bfcca327de01d70a53yjvi'
});
console.log(device);

console.log("===========device's functions ===============");
const response = await tuya.request({
    method: 'GET',
    path: `/v1.0/devices/bfcca327de01d70a53yjvi/functions`
});
console.log(JSON.stringify(response.result.functions, null, 2));


console.log("===========first status ==============");
const status = await tuya.request({
    method: 'GET',
    path: `/v1.0/devices/bfcca327de01d70a53yjvi/status`
});
console.log(status);

console.log("===========commands==============");
const res = await tuya.request({
    method: 'POST',
    path: `/v1.0/devices/bfcca327de01d70a53yjvi/commands`,
    body: {
        commands: [
            {
                code: 'switch_1',
                value: false
            }
        ]
    }
});
console.log(res);

// wait 2 seconds to update status
await new Promise(resolve => setTimeout(resolve, 2000));

console.log("===========second status ===============");
const status2 = await tuya.request({
    method: 'GET',
    path: `/v1.0/devices/bfcca327de01d70a53yjvi/status`
});
console.log(status2);

// console.log("===========list devices ===============");
// const space_devices = await tuya.request({
//     method: 'GET',
//     path: '/v2.0/cloud/thing/space/device',
//     query: {
//         space_id: '227219137', 
//         page_size: 20, 
//         page_no: 1     
//     }
// });
// console.log("space_devices:", space_devices);

console.log("===========space ===============");
const spaces = await tuya.request({
    method: 'GET',
    path: '/v2.0/cloud/space/child'
});

console.log("Spaces:", spaces);

//לא מצליח לשלוח 2 מכשירים-מוזר
console.log("=========== Device List By space and device_id ===============");
const devices = await tuya.device.list({
    space_id: '227219137',
    page_size: 20,
    device_ids: 'bfcca327de01d70a53yjvi'
    });
console.log("Devices:", devices);
console.log("Devices details:", devices.result.list);

console.log("===========space details ===============");
const spaceDetails = await tuya.request({
    method: 'GET',
    path: `/v2.0/cloud/space/227219137`
});
console.log("Space Details:", spaceDetails);

console.log("===========post device to space ===============");
const respo=await tuya.request({
    method: 'POST',
    path: '/v2.0/cloud/thing/bf39f426e164f7c93ahllr/transfer',  
    body: {
        "space_id": 227219137  
    }
});
console.log("post device to space ", JSON.stringify(respo, null, 2)); 
