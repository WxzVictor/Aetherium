namespace AetheriumBack.Models;
public class Reservation
{
    public Guid RerservationId { get; set; }
    public Guid UserId { get; set; }
    public Guid FlightId { get; set; }
    public Guid SeatId { get; set; }
    public DateTimeOffset ReservationDateTime { get; set; }
}
