import axios from "axios";
import { BREVO_KEY_ID, FRONTEND_URL, SENDER_EMAIL } from "./env.js";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Storage App",
          email: SENDER_EMAIL,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": BREVO_KEY_ID,
          "Content-Type": "application/json",
        },
      },
    );
    // console.log(res)
    return { success: true, data: res.data };
  } catch (error: any) {
    console.log(error);
    console.error("Brevo email error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data };
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const htmlMsg = `<div style="text-align:center">
                            <h2 style="font-size:20px;font-weight:300">Welcome to your Book-Kart!!! Verify Your Email<br>
                            <p style="font-size:16px">Thanks for Registering  Click to Verify</p>
                            <button style="padding-inline:12px;font-size:26px">
                            <a style="${FRONTEND_URL}/verify-email/${token}" href="#">Verify Now</a>
                            </button>
                    </div>`;

    const response = await sendEmail(email, "Verify Your Email", htmlMsg);

    return response;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function sendResetPasswordLinktoEmail(email:string,resetPasswordToken:string){
    try {
    const htmlMsg = `<div style="text-align:center">
                            <h2 style="font-size:20px;font-weight:300">Welcome to your Book-Kart!!! Reset your password<br>
                            <p style="font-size:16px">Click to Reset Password</p>
                            <button style="padding-inline:12px;font-size:26px">
                            <a style="${FRONTEND_URL}/verify-email/${resetPasswordToken}" href="#">Reset Password</a>
                            </button>
                    </div>`;

    const response = await sendEmail(email, "Reset your password", htmlMsg);

    return response;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}


