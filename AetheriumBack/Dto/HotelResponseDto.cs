using AetheriumBack.Models;

namespace AetheriumBack.Dto;
public class HotelResponseDto
{
    public int Total { get; set; }
    public IEnumerable<HotelDto> Hotels { get; set; }
}
