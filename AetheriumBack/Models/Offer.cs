namespace AetheriumBack.Models;

public class Offer
{
    public int OfferId { get; set; }
    public int FlightId { get; set; }
    public int HotelId { get; set; }
    public int DiscountPercentage { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public Flight Flight { get; set; }
    public Hotel Hotel { get; set; }

    private Offer() { }

    public Offer(string[] attibutes)
    {
        FlightId = int.Parse(attibutes[0]);
        HotelId = int.Parse(attibutes[1]);
        DiscountPercentage = int.Parse(attibutes[2]);
        StartDate = DateTimeOffset.Parse(attibutes[3]);
        EndDate = DateTimeOffset.Parse(attibutes[4]);
    }
}
