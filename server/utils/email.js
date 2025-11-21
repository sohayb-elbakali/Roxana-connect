const SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require("config");

// Configure API key
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || 'ScIV30dXwamJ6fCH';

// Create API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send verification email
 */
const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { 
    email: process.env.EMAIL_FROM || '9bb3d6001@smtp-brevo.com',
    name: 'Roxana'
  };
  sendSmtpEmail.to = [{
    email: email,
    name: name
  }];
  sendSmtpEmail.subject = 'Verify Your Email - Roxana Connect';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="color: white; font-size: 30px;">💼</span>
        </div>
        <h2 style="color: #1f2937; margin: 0;">Welcome to Roxana Connect!</h2>
      </div>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Thank you for joining Roxana Connect! We're excited to have you as part of our professional community.
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        To get started and unlock all features, please verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Verify My Email
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
      <p style="color: #9ca3af; word-break: break-all; font-size: 13px; background: #f3f4f6; padding: 12px; border-radius: 6px;">${verificationUrl}</p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
          <strong>Note:</strong> This verification link will expire in 24 hours.
        </p>
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 8px 0 0 0;">
          If you didn't create an account with Roxana Connect, please ignore this email.
        </p>
      </div>
    </div>
  `;
  
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error sending verification email');
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { 
    email: process.env.EMAIL_FROM || '9bb3d6001@smtp-brevo.com',
    name: 'Roxana'
  };
  sendSmtpEmail.to = [{
    email: email,
    name: name
  }];
  sendSmtpEmail.subject = 'Reset Your Password - Roxana Connect';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span style="color: white; font-size: 30px;">🔒</span>
        </div>
        <h2 style="color: #1f2937; margin: 0;">Password Reset Request</h2>
      </div>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        We received a request to reset your password for your Roxana Connect account.
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Click the button below to create a new password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Reset My Password
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
      <p style="color: #9ca3af; word-break: break-all; font-size: 13px; background: #f3f4f6; padding: 12px; border-radius: 6px;">${resetUrl}</p>
      <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 30px 0; border-radius: 6px;">
        <p style="color: #991b1b; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong>⚠️ Security Notice:</strong> This password reset link will expire in 1 hour for your security.
        </p>
      </div>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
          <strong>Didn't request this?</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 8px 0 0 0;">
          For security reasons, we recommend changing your password if you suspect unauthorized access to your account.
        </p>
      </div>
    </div>
  `;
  
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error sending password reset email');
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
