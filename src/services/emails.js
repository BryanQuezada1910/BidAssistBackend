import nodemailer from "nodemailer";
import mustache from 'mustache';
import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;

export class MailWrapper {

  static transporter = null;

  static createTransporter() {
    if (this.transporter) return this.transporter;

    return this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }


  static async send(emails, subject, html) {
    try {
      const transporter = this.createTransporter();
      const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: emails.join(','),
        subject,
        html
      });
      console.log("Message sent to: %s", info.accepted);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  static loadTemplate(templatePath, variables = {}) {
    let template = fs.readFileSync(templatePath, 'utf8');
    return mustache.render(template, variables);
  }

  static sendResetPasswordEmail(to, resetUrl) {
    const templatePath = path.join(__dirname, '../templates/emails/forgot-password.html');
    const htmlContent = this.loadTemplate(templatePath, { reset_url: resetUrl });
    const subject = 'Reestablecer contraseña';
    this.send(to, subject, htmlContent);
  }

  static sendWelcomeEmail(to, userName) {
    const templatePath = path.join(__dirname, '../templates/emails/welcome.html');
    const htmlContent = this.loadTemplate(templatePath, { user_name: userName });
    const subject = 'Bienvenido a BidAssist';
    this.send(to, subject, htmlContent);
  }

  static sendHighPriorityNotificationEmail(to, tickets, detailsUrl) {
    const templatePath = path.join(__dirname, '../templates/emails/tickets-updated.html');
    const html = this.loadTemplate(templatePath, { tickets, details_url: detailsUrl });
    const subject = 'Notificación de Cambio de Prioridad de Tickets a "High"';

    this.send(to, subject, html);
  }
}
