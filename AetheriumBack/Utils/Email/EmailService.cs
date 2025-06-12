using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;

namespace AetheriumBack.Utils.Email
{
    public class EmailService
    {
        private readonly string _from = "tu-cuenta@gmail.com"; // Tu cuenta de Gmail
        private readonly string _password = "tu-app-password"; // Usa una App Password de Gmail

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_from));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, false);
            await smtp.AuthenticateAsync(_from, _password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
