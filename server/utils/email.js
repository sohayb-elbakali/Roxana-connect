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
  sendSmtpEmail.subject = 'Verify Your Email - Roxana';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Roxana, ${name}!</h2>
      <p>Thank you for registering. Please verify your email address to activate your account.</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This link will expire in 24 hours. If you didn't create this account, please ignore this email.
      </p>
    </div>
  `;
  
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Verification email sent via Brevo:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
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
  sendSmtpEmail.subject = 'Reset Your Password - Roxana';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="color: #666; word-break: break-all;">${resetUrl}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
      </p>
    </div>
  `;
  
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Password reset email sent via Brevo:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
