import nodemailer from 'nodemailer';

export const sendTicketEmail = async (
  email: string,
  ticketDetails: {
    eventName: string;
    date: Date;
    venue: string;
    seatNumber: string;
    bookingId: string;
    qrCodeUrl: string;
    bannerUrl?: string | null;
  }
) => {
  try {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #030712; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin: 0; font-size: 28px;">EventHub Tickets</h1>
          <p style="color: #9ca3af; margin-top: 5px;">Your Booking is Confirmed</p>
        </div>
        
        ${ticketDetails.bannerUrl ? `<img src="${ticketDetails.bannerUrl}" style="width: 100%; border-radius: 12px; margin-bottom: 20px; object-fit: cover; height: 200px;" alt="Banner" />` : ''}
        
        <div style="background-color: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1f2937; margin-bottom: 30px;">
          <h2 style="margin-top: 0; color: #ffffff; font-size: 22px;">${ticketDetails.eventName}</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 5px 0; color: #d1d5db;"><strong>Date:</strong> ${new Date(ticketDetails.date).toLocaleString()}</p>
            <p style="margin: 5px 0; color: #d1d5db;"><strong>Venue:</strong> ${ticketDetails.venue}</p>
            <p style="margin: 5px 0; color: #d1d5db;"><strong>Seat:</strong> ${ticketDetails.seatNumber}</p>
            <p style="margin: 5px 0; color: #d1d5db;"><strong>Booking ID:</strong> ${ticketDetails.bookingId}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
            <p style="color: #9ca3af; margin-bottom: 10px; font-size: 14px;">Your Digital Pass</p>
            <img src="${ticketDetails.qrCodeUrl}" style="width: 150px; height: 150px; border-radius: 8px;" alt="QR Code" />
          </div>
        </div>
        
        <div style="text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Need help? Contact support@eventhub.com</p>
          <p>© ${new Date().getFullYear()} EventHub India. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"EventHub" <tickets@eventhub.com>',
      to: email,
      subject: `Your Ticket: ${ticketDetails.eventName}`,
      html: emailHtml,
    });

    console.log('Ticket email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info.messageId;
  } catch (error) {
    console.error('Error sending ticket email:', error);
    // Ignore error so that it does not crash booking flow
  }
};
