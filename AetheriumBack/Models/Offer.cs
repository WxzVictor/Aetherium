namespace AetheriumBack.Models;

public class Offer
{
    public Guid OfferId { get; set; }
    public Guid FlightId { get; set; }
    public Guid HotelId { get; set; }
    public int DiscountPercentage { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }

    private Offer() { }
}
