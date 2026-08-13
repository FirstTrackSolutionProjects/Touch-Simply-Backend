const generateHtmlBody = (data) => {
    const { name, email, phone, course, message } = data;
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Contact Us Submission - Touch Simply</title>
        <style>
            /* Email client reset and base styles */
            body {
                background-color: #ffffff;
                color: #000000;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            table {
                border-spacing: 0;
            }
            td {
                padding: 0;
            }
            
            /* Template styles */
            .wrapper {
                width: 100%;
                background-color: #ffffff;
                padding: 40px 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #ffffff;
                padding: 30px;
                text-align: center;
                border-bottom: 3px solid #6b21a8; /* Purple accent border */
            }
            .header h1 {
                color: #6b21a8; /* Purple header */
                margin: 0;
                font-size: 28px;
                letter-spacing: 1px;
            }
            .body-content {
                padding: 30px;
            }
            .intro {
                color: #000000;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 25px;
            }
            .field-container {
                background-color: #f9fafb;
                padding: 20px;
                border-radius: 6px;
                border-left: 4px solid #6b21a8; /* Purple side border */
            }
            .field-row {
                margin-bottom: 15px;
            }
            .field-row:last-child {
                margin-bottom: 0;
            }
            .label {
                color: #6b21a8; /* Purple label */
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
                display: block;
                margin-bottom: 5px;
            }
            .value {
                color: #000000; /* Black value text */
                font-size: 16px;
                margin: 0;
                line-height: 1.4;
                white-space: pre-wrap;
            }
            .footer {
                background-color: #ffffff;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .footer p {
                color: #6b7280;
                font-size: 12px;
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <table class="container" width="100%" align="center" cellpadding="0" cellspacing="0">
                <!-- Header Section -->
                <tr>
                    <td class="header">
                        <h1>Touch Simply</h1>
                    </td>
                </tr>
                
                <!-- Body Section -->
                <tr>
                    <td class="body-content">
                        <p class="intro">You have received a new message from your website's Contact Us form. Here are the details:</p>
                        
                        <div class="field-container">
                            <!-- Name Field -->
                            <div class="field-row">
                                <span class="label">Name:</span>
                                <p class="value">${name}</p>
                            </div>
                            
                            <!-- Email Field -->
                            <div class="field-row">
                                <span class="label">Email:</span>
                                <p class="value">${email}</p>
                            </div>
                            
                            <!-- Phone Field -->
                            <div class="field-row">
                                <span class="label">Phone:</span>
                                <p class="value">${phone}</p>
                            </div>
                            
                            <!-- Message Field -->
                            <div class="field-row">
                                <span class="label">Message:</span>
                                <p class="value">${message}</p>
                            </div>
                        </div>
                    </td>
                </tr>
                
                <!-- Footer Section -->
                <tr>
                    <td class="footer">
                        <p>&copy; 2026 Touch Simply. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>`
}

const contactUsEmailTemplate = (data) => {
    const htmlBody = generateHtmlBody(data);
    const subject = `Contact Form Submission`;
    return {
        html: htmlBody,
        subject
    }
}

module.exports = contactUsEmailTemplate;