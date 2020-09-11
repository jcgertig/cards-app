import nodemailer from 'nodemailer';

import { IUser } from '../../controllers/user';
import { IConfig } from '../general-types';
import { emailTemplate } from './template';

export const sendMail = async (
  config: IConfig,
  to: string,
  subject: string,
  html: string
) => {
  const transporter = nodemailer.createTransport(config.email);
  return transporter.sendMail({
    from: '"Cards App" <no-reply@cards.app>',
    to,
    subject,
    html
  });
};

const identifier = (to: IUser) => (to.username ? to.username : to.email);

export const confirmAccount = async (config: IConfig, to: IUser) => {
  const body = emailTemplate({
    actionLabel: 'Confirm Account',
    actionUrl: `${config.ui}/confirm-account?token=${to.confirmationToken}`,
    blockOneText: `Welcome ${to.email}`,
    blockTwoText: `Please confirm your account so that you can fully access all of the site's features.`
  });
  return await sendMail(config, to.email!, 'Confirm your account', body);
};

export const passwordReset = async (config: IConfig, to: IUser) => {
  const body = emailTemplate({
    actionLabel: 'Reset Password',
    actionUrl: `${config.ui}/password-reset?token=${to.resetPasswordToken}`,
    blockOneText: `Hello ${identifier(to)}`,
    blockTwoText: `Someone has requested a link to change your password. You can do this through the link below.`,
    blockThreeText: `<p>If you didn't request this, please ignore this email.</p>
<p>Your password won't change until you access the link below and create a new one.</p>`
  });
  return await sendMail(config, to.email, 'Password reset request', body);
};

export const passwordChanged = async (config: IConfig, to: IUser) => {
  const body = emailTemplate({
    actionLabel: 'Account',
    actionUrl: `${config.ui}/account`,
    blockOneText: `Hello ${identifier(to)}`,
    blockTwoText: `We're contacting you to notify you that your password has been changed.`
  });
  return await sendMail(config, to.email, 'Password changed', body);
};
