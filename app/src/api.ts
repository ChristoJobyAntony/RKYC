import axios from 'axios'

const base_api = axios.create({
    baseURL: 'http://localhost:5003',
    timeout: 50000,
    timeoutErrorMessage: "Network Error",
    validateStatus: (status) =>  status < 422
})

async function check_availability (aadhaar_id :string) : Promise<{ result: boolean }> {
    const params = {
        aadhaar_id
    }
    const resp = await base_api.get(
        "/user/available",
        {params}
    )
    return resp.data
}

async function issue_otp_enroll(aadhaar_id: string) : Promise<{token: string, type: string}>{
    const params = {
        aadhaar_id
    }
    const resp = await base_api.post(
        "/user/enroll/otp/issue",
        null,
        {params},
    )
    if (resp.status != 200) throw new Error(resp.data.detail)
    return resp.data
}

async function verify_otp(aadhaar_id : string, token: string, otp: number) : Promise<{result : boolean}>{
    const params = {
        aadhaar_id,
        token,
        otp
    }
    const resp = await base_api.post (
        "/user/enroll/otp/verify",
        null,
        {params}
    )
    if (resp.status != 200) throw new Error(resp.data.detail)
    return resp.data
}

async function enroll_user (aadhaar_id: string, otp_token: string, videoBlob: Blob, audioBlob: Blob) {
    let formData = new FormData();
    let video = new File([videoBlob], "video.webm");
    let audio = new File([audioBlob], "audio.wav");
    formData.append('video', video, "video.webm");
    formData.append('audio', audio, "audio.wav");
    formData.append('aadhaar_id', aadhaar_id);
    formData.append('otp_token', otp_token);

    return base_api.post(`/user/enroll/register`,
        formData, {
           headers: {
             'Content-Type': `multipart/form-data`,
           }
        }
    ) 
}

async function check_is_enrolled(aadhaar_id: string) : Promise<{result: boolean}> {
    const params = {
        aadhaar_id
    }
    const resp = await base_api.get(
        "/user/enrolled",
        {params}
    )
    return resp.data
}

async function issue_otp_verification(aadhaar_id: string) : Promise<{token: string, type: string}>{ 
    const params = {
        aadhaar_id
    }
    const resp = await base_api.post(
        "/user/verify/otp/issue",
        null,
        {params},
    )
    if (resp.status != 200) throw new Error(resp.data.detail)
    return resp.data
}

async function verify_otp_verification(aadhaar_id : string, token: string, otp: number) : Promise<{result: boolean, sequence: string}>{
    const params = {
        aadhaar_id,
        token,
        otp
    }
    const resp = await base_api.post (
        "/user/verify/otp/verify",
        null,
        {params}
    )
    if (resp.status != 200) throw new Error(resp.data.detail)
    return resp.data
}

async function verify_user (aadhaar_id: string, otp_token: string, videoBlob: Blob, audioBlob: Blob) {
    let formData = new FormData();
    let video = new File([videoBlob], "video.webm");
    let audio = new File([audioBlob], "audio.wav");
    formData.append('video', video, "video.webm");
    formData.append('audio', audio, "audio.wav");
    formData.append('aadhaar_id', aadhaar_id);
    formData.append('otp_token', otp_token);

    return base_api.post(`/user/verify/authenticate`,
        formData, {
           headers: {
             'Content-Type': `multipart/form-data`,
           }
        }
    ) 
}


export default {
    check_availability,
    issue_otp_enroll,
    verify_otp,
    enroll_user,
    check_is_enrolled,
    issue_otp_verification,
    verify_otp_verification,
    verify_user
};