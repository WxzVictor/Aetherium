namespace AetheriumBack.Models;

public class User
{
    public int UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
    public DateTimeOffset SignUpDate { get; set; }
    public Reservation Reservation { get; set; }

    private User() { }

    public User(string[] attributes)
    {
        FirstName = attributes[0];
        LastName = attributes[1];
        Email = attributes[2];
        Age = int.Parse(attributes[3]);
        SignUpDate = DateTimeOffset.Parse(attributes[4]);
    }

}
