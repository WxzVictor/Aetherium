namespace AetheriumBack.Dto;
public class ReservationResponseDto
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }
    public FlightResponseDto FlightId { get; set; }
    public SeatResponseDto? SeatId { get; set; }
    public DateTimeOffset ReservationDateTime { get; set; }
}
