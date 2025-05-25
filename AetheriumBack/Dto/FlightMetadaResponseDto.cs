using AetheriumBack.Models;

namespace AetheriumBack.Dto;
public class FlightMetadaResponseDto
{
    public IEnumerable<FlightResponseDto> Flights { get; set; }
    public int TotalFlights { get; set; }
    public string LastUpdate { get; set; }
}
