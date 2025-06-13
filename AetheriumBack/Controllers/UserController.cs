using AetheriumBack.Database;
using AetheriumBack.Dto;
using AetheriumBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AetheriumContext _context;
    public UserController(AetheriumContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser([FromBody] UserDto userDto)
    {
        if (userDto is null || string.IsNullOrEmpty(userDto.FirebaseUid))
            return BadRequest("User data is invalid.");

        // Comprobamos si existe ese FirebaseUid
        User? existingUser = await _context.User
            .FirstOrDefaultAsync(u => u.FirebaseUid == userDto.FirebaseUid);

        if (existingUser is not null)
            return Conflict("User with this Firebase UID already exists.");

        User user = new ()
        {
            FirebaseUid = userDto.FirebaseUid,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Email = userDto.Email,
            Age = userDto.Age,
            SignUpDate = DateTimeOffset.UtcNow
        };

        _context.User.Add(user);
        await _context.SaveChangesAsync();

        return Ok(userDto);
    }

    [HttpGet("byfirebase/{firebaseUid}")]
    public async Task<IActionResult> GetByFirebaseUid(string firebaseUid)
    {
        if (string.IsNullOrEmpty(firebaseUid))
            return BadRequest("FirebaseUid requerido.");

        User? user = await _context.User.FirstOrDefaultAsync(u => u.FirebaseUid == firebaseUid);
        if (user is null)
            return NotFound();

        UserDto response = new ()
        {
            UserId = user.UserId,
            FirebaseUid = user.FirebaseUid,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Age = user.Age,
            SignUpDate = user.SignUpDate
        };

        return Ok(response);
    }

    [HttpDelete("{firebaseUid}")]
    public async Task<IActionResult> DeleteUser(string firebaseUid)
    {
        User? user = await _context.User
            .FirstOrDefaultAsync(u => u.FirebaseUid == firebaseUid);
        
        if (user is null)
            return NotFound("User not found.");

        _context.User.Remove(user);
        await _context.SaveChangesAsync();
        return Ok("User deleted successfully.");
    }
}
