namespace AetheriumBack.Dto;
public class SeatAvailableDto
{
    public int FlightId { get; set; }
    public IEnumerable<SeatResponseDto> AvailableSeats { get; set; } 
    public int TotalSeats { get; set; }  
    public DateTimeOffset LastUpdate { get; set; } 
}
