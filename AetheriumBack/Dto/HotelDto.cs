namespace AetheriumBack.Dto;
public class HotelDto
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
}
