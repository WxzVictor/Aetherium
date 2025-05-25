using AetheriumBack.Models;

namespace AetheriumBack.Dto;
public class HotelRespondeDto
{
    public int Total { get; set; }
    public IEnumerable<Hotel> Hotels { get; set; }

}
