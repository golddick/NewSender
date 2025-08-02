// lib/templates/welcomeTemplate.ts
interface WelcomeTemplateParams {
  name?: string;
  email: string;
}

export const getWelcomeTemplate = ({ name, email }: WelcomeTemplateParams) => ({
  title: "Welcome to TheNews!",
  content: {
    subject: `Welcome${name ? ` ${name}` : ''} to TheNews!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: right; font-size: 14px; color: #999; }
              .button { background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Welcome to TheNews!</h1>
          </div>
          <div class="content">
              <p>Hello${name ? ` ${name}` : ''},</p>
              <p>Thank you for subscribing to our newsletter with ${email}.</p>
              <p>We're excited to share our latest updates with you.</p>
              <div style="text-align: center;">
                  <a href="#" class="button">Explore Content</a>
              </div>
          </div>
          <div class="footer">
              <p>Best regards,<br>The TheNews Team</p>
          </div>
      </body>
      </html>
    `,
    text: `Welcome${name ? ` ${name}` : ''} to TheNews!\n\nThank you for subscribing with ${email}.\n\nWe're excited to share our latest updates with you.`
  }
});
