namespace AetheriumBack.Dto;
public class FlightSearchResultDto
{
    public IEnumerable<FlightResponseDto> OutFlights { get; set; }
    public IEnumerable<FlightResponseDto> ReturnFlight { get; set; }
    public int TotalOut { get; set; }
    public int TotalReturn { get; set; }
    public DateTimeOffset LastUpdate { get; set; }
}
