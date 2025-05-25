namespace AetheriumBack.Models;

public class Offer
{
    public int OfferId { get; set; }
    public int FlightId { get; set; }
    public int HotelId { get; set; }
    public int DiscountPercentage { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }

    private Offer() { }
}
