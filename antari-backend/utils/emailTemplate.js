/**
 * @param {string} otp - The 6-digit OTP code
 * @param {"register" | "login"} type - The type of OTP email to send
 * @returns {string} HTML email template
 */
const getOtpTemplate = (otp, type = "register") => {
    const isLogin = type === "login";

    const title = isLogin ? "Sign-In Verification" : "Welcome to Antari Store";
    const subtitle = isLogin ? "Secure Login Code" : "Email Verification Code";
    const message = isLogin
        ? "You requested a sign-in code for your Antari Store account. Use the code below to complete your login."
        : "Thank you for signing up! Use the code below to verify your email address and activate your account.";
    const actionLabel = isLogin ? "Complete Sign In" : "Verify & Activate Account";

    const accentColor = isLogin ? "#4f46e5" : "#2563eb"; // Indigo for login, Blue for register
    const badgeText = isLogin ? "LOGIN OTP" : "REGISTRATION OTP";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Antari Store — ${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f3f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f3f6; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px;">
                    
                    <!-- Header Brand Bar -->
                    <tr>
                        <td style="background-color: #0f172a; border-radius: 16px 16px 0 0; padding: 28px 40px; text-align: center;">
                            <img 
                                src="https://res.cloudinary.com/dn19hommj/image/upload/v1775212927/emaillogoantarri_kug9zp.png" 
                                alt="AntariStore" 
                                width="130"
                                style="max-width: 130px; filter: brightness(0) invert(1); display: block; margin: 0 auto;" 
                            />
                        </td>
                    </tr>

                    <!-- Colored Accent Bar -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, ${accentColor}, #06b6d4); border-radius: 0;"></td>
                    </tr>

                    <!-- Main Card Body -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 48px 40px 36px; border-radius: 0;">
                            
                            <!-- Badge -->
                            <div style="text-align: center; margin-bottom: 24px;">
                                <span style="display: inline-block; background-color: ${accentColor}15; color: ${accentColor}; font-size: 11px; font-weight: 700; letter-spacing: 2px; padding: 6px 16px; border-radius: 100px; text-transform: uppercase; border: 1px solid ${accentColor}30;">
                                    ${badgeText}
                                </span>
                            </div>

                            <!-- Title -->
                            <h1 style="margin: 0 0 12px; color: #0f172a; font-size: 26px; font-weight: 800; text-align: center; letter-spacing: -0.5px; line-height: 1.2;">
                                ${title}
                            </h1>
                            <p style="margin: 0 0 36px; color: #64748b; font-size: 15px; text-align: center; line-height: 1.6; font-weight: 400;">
                                ${message}
                            </p>

                            <!-- OTP Code Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 36px;">
                                        <div style="display: inline-block; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px 48px; text-align: center; min-width: 220px;">
                                            <p style="margin: 0 0 6px; color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">${subtitle}</p>
                                            <p style="margin: 0; color: #0f172a; font-size: 44px; font-weight: 900; letter-spacing: 10px; font-variant-numeric: tabular-nums; line-height: 1.2;">
                                                ${otp}
                                            </p>
                                            <p style="margin: 10px 0 0; color: #f97316; font-size: 12px; font-weight: 700; letter-spacing: 1px;">
                                                ⏱ Expires in 10 minutes
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td style="border-top: 1px solid #f1f5f9; height: 1px;"></td>
                                </tr>
                            </table>

                            <!-- Security Warning -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff7ed; border-radius: 12px; border: 1px solid #fed7aa; margin-bottom: 12px;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0; color: #9a3412; font-size: 13px; font-weight: 600; line-height: 1.5;">
                                            🔒 <strong>Security Notice:</strong> Antari Store will never ask for your OTP via phone or chat. Do not share this code with anyone.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 20px 0 0; color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.6;">
                                If you did not ${isLogin ? "attempt to sign in" : "create an account"}, you can safely ignore this email. Your account remains secure.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; border-radius: 0 0 16px 16px; padding: 28px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px; color: #0f172a; font-size: 13px; font-weight: 700; letter-spacing: 1px;">ANTARI STORE</p>
                            <p style="margin: 0 0 16px; color: #94a3b8; font-size: 12px;">
                                Premium E-Commerce · India
                            </p>
                            <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                                <tr>
                                    <td style="padding: 0 10px;">
                                        <a href="#" style="color: #64748b; font-size: 12px; text-decoration: none; font-weight: 600;">Help Center</a>
                                    </td>
                                    <td style="color: #cbd5e1; font-size: 12px;">|</td>
                                    <td style="padding: 0 10px;">
                                        <a href="#" style="color: #64748b; font-size: 12px; text-decoration: none; font-weight: 600;">Privacy Policy</a>
                                    </td>
                                    <td style="color: #cbd5e1; font-size: 12px;">|</td>
                                    <td style="padding: 0 10px;">
                                        <a href="#" style="color: #64748b; font-size: 12px; text-decoration: none; font-weight: 600;">Unsubscribe</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                                © ${new Date().getFullYear()} Antari Store. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>

</body>
</html>
    `;
};

module.exports = getOtpTemplate;