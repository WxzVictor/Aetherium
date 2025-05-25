namespace AetheriumBack.Dto;
public class SeatAvailableDto
{
    public int FlightNumber { get; set; }
    public IEnumerable<SeatResponseDto> AvailableSeats { get; set; } 
    public int TotalSeats { get; set; }  
    public DateTimeOffset LastUpdate { get; set; } 
}
