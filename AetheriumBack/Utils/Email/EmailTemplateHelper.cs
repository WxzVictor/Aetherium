using AetheriumBack.Dto;
using System.Text;

namespace AetheriumBack.Utils.Email
{
    public static class EmailTemplateHelper
    {
        public static string LoadReservationEmailTemplate(ReservationResponseDto dto, string userName, string userEmail)
        {
            var sb = new StringBuilder();

            sb.AppendLine("<div style=\"font-family: 'Segoe UI', 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #f0f4f8, #e8ecf1); padding: 60px;\">");
            sb.AppendLine("<div style=\"max-width: 620px; margin: auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1); overflow: hidden;\">");

            sb.AppendLine("<div style=\"background-color: #fdc921; padding: 30px; text-align: center;\">");
            sb.AppendLine("<h2 style=\"color: #1d2d4a; font-size: 24px; font-weight: 600; margin: 0;\">✈️ Confirmación de Reserva</h2>");
            sb.AppendLine("</div>");

            sb.AppendLine("<div style=\"padding: 40px 30px;\">");

            sb.AppendLine($"<p style=\"font-size: 17px;\"><strong>👤 Nombre:</strong> {userName}</p>");
            sb.AppendLine($"<p style=\"font-size: 17px;\"><strong>📧 Correo:</strong> {userEmail}</p>");
            sb.AppendLine($"<p style=\"font-size: 17px;\"><strong>📅 Fecha de Reserva:</strong> {dto.ReservationDateTime.LocalDateTime:dd/MM/yyyy HH:mm}</p>");
            sb.AppendLine($"<p style=\"font-size: 17px;\"><strong>🔢 Número de Vuelo:</strong> {dto.FlightId.FlightCode}</p>");
            sb.AppendLine($"<p style=\"font-size: 17px;\"><strong>🛫 Salida:</strong> {dto.FlightId.DepartureAirport.City} ({dto.FlightId.DepartureAirport.Code}) - {dto.FlightId.DepartureTime:dd/MM/yyyy HH:mm}</p>");
            sb.AppendLine($"<p style=\"font-size: 17px;\"><strong>🛬 Llegada:</strong> {dto.FlightId.ArrivalAirport.City} ({dto.FlightId.ArrivalAirport.Code}) - {dto.FlightId.ArrivalTime:dd/MM/yyyy HH:mm}</p>");
            sb.AppendLine($"<p style=\"font-size: 17px;\"><strong>💺 Asiento:</strong> {(dto.SeatId != null ? dto.SeatId.SeatNumber : "No asignado")}</p>");

            sb.AppendLine("</div></div></div>");

            return sb.ToString();
        }
    }
}
