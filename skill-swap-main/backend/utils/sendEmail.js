const sendEmail = async (options) => {
    try {
        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender: {
                        name: "SkillSwap Support",
                        email: process.env.BREVO_SENDER_EMAIL
                    },

                    to: [
                        {
                            email: options.email
                        }
                    ],

                    subject: options.subject,

                    textContent: options.message,

                    htmlContent: options.html || options.message
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();

            console.error("Brevo API Error:", error);

            throw new Error(
                `Email sending failed: ${response.status}`
            );
        }

        console.log("Email sent successfully through Brevo API");

    } catch (error) {
        console.error("Send Email Error:", error);
        throw error;
    }
};

module.exports = sendEmail;