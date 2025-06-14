namespace AetheriumBack.Dto;
public class ReservationDeleteResponseDto
{
    public int ReservationId { get; set; }
    public DateTimeOffset DeletedAt { get; set; }
}
