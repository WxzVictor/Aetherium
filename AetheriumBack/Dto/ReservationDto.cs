namespace AetheriumBack.Dto;
public class ReservationDto
{
    public int UserId { get; set; }
    public int FlightId { get; set; }
    public int? SeatId { get; set; }
    public DateTimeOffset DateTimeOffset { get; set; }
    public string? SeatClass { get; set; }
    public double? TotalPrice { get; set; }
}
