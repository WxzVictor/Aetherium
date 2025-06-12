namespace AetheriumBack.Dto;
public class UserDto
{
    public string FirebaseUid { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
    public DateTimeOffset SignUpDate { get; set; }
}
