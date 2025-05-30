namespace AetheriumBack.Models;

public class Hotel
{
    public int HotelId { get; set; }
    public string HotelName { get; set; }
    public string Address { get; set; }
    public decimal Rating { get; set; }
    public string ContactNumber { get; set; }
    public decimal PricePerNight { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Email { get; set; }
    public DateTimeOffset CheckInTime { get; set; }
    public DateTimeOffset CheckOutTime { get; set; }
    public ICollection<Offer> Offer { get; set; }

    private Hotel() { }

    public Hotel(string[] attributes)
    {
        HotelName = attributes[0];
        Address = attributes[1];
        City = attributes[2];
        Country = attributes[3];
        Rating = decimal.Parse(attributes[4]);
        ContactNumber = attributes[5];
        PricePerNight = decimal.Parse(attributes[6]);
        Email = attributes[7];
        CheckInTime = DateTimeOffset.Parse(attributes[8]);
        CheckOutTime = DateTimeOffset.Parse(attributes[9]);
    }

}
