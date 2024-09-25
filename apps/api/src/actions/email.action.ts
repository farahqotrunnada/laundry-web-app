import { BACKEND_URL, RESEND_API, RESEND_FROM } from '@/config';
import { EmailType, User } from '@prisma/client';

import ApiError from '@/utils/error.util';
import { EmailChangeEmail } from '@/emails/email-change';
import { PasswordResetEmail } from '@/emails/password-reset';
import { Resend } from 'resend';
import { VerificationEmail } from '@/emails/verification';
import { generateEmailToken } from '@/utils/encrypt.util';
import moment from 'moment';
import prisma from '@/libs/prisma';
import { render } from '@react-email/components';

export default class EmailAction {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(RESEND_API);
  }

  sendVerificationEmail = async (user: User) => {
    try {
      const { user_id, email } = user;

      const log = await prisma.emailLog.findFirst({
        where: {
          email,
          type: EmailType.Verification,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (log && moment().diff(log.created_at, 'hours') < 1) {
        throw new ApiError(
          429,
          'There is already a verification email sent to this email address, please wait for an hour before sending another email'
        );
      }

      const email_token = generateEmailToken({
        user_id,
        email,
      });

      const url = new URL(BACKEND_URL);
      url.pathname = '/api/v1/auth/verify';
      url.searchParams.set('token', email_token);

      const text = await render(VerificationEmail({ user, url: url.toString() }), {
        plainText: true,
      });

      await this.resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Email Verification',
        react: VerificationEmail({ user, url: url.toString() }),
        text,
      });

      await prisma.emailLog.create({
        data: {
          email,
          type: EmailType.Verification,
        },
      });

      return email;
    } catch (error) {
      throw error;
    }
  };

  sendForgotPasswordEmail = async (user: User) => {
    try {
      const { user_id, email } = user;

      const log = await prisma.emailLog.findFirst({
        where: {
          email,
        },
      });

      // if (log && moment().diff(log.created_at, 'hours') < 1) {
      //   throw new ApiError(
      //     429,
      //     'There is already a request for password reset sent to this email address. Please wait for a few hours before requesting another reset.'
      //   );
      // }

      const email_token = generateEmailToken({
        user_id,
        email,
      });

      const url = new URL(BACKEND_URL);
      url.pathname = '/api/v1/auth/reset-password';
      url.searchParams.set('token', email_token);

      const text = await render(PasswordResetEmail({ user, url: url.toString() }), {
        plainText: true,
      });

      await this.resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Password Reset',
        react: PasswordResetEmail({ user, url: url.toString() }),
        text,
      });
    } catch (error) {
      throw error;
    }
  };

  sendEmailChangeEmail = async (user: User) => {
    try {
      const { user_id, email } = user;

      const log = await prisma.emailLog.findFirst({
        where: {
          email,
        },
      });

      if (log && moment().diff(log.created_at, 'hours') < 1) {
        throw new ApiError(
          429,
          'There is already a request for email change sent to this email address. Please wait for a few hours before requesting another change.'
        );
      }

      const email_token = generateEmailToken({
        user_id,
        email,
      });

      const url = new URL(BACKEND_URL);
      url.pathname = '/api/v1/auth/confirm-email';
      url.searchParams.set('token', email_token);

      const text = await render(EmailChangeEmail({ user, url: url.toString() }), {
        plainText: true,
      });

      await this.resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Email Change',
        react: EmailChangeEmail({ user, url: url.toString() }),
        text,
      });
    } catch (error) {
      throw error;
    }
  };
}
