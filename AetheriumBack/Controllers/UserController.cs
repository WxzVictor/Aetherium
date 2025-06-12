// Controllers/UserController.cs
using AetheriumBack.Dto;
using AetheriumBack.Models;
using Microsoft.AspNetCore.Mvc;

namespace AetheriumBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AetheriumDbContext _context;

        public UserController(AetheriumDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            var existing = await _context.User.FirstOrDefaultAsync(u => u.Uid == dto.Uid);
            if (existing != null)
            {
                return BadRequest(new { message = "El usuario ya existe." });
            }

            var newUser = new User
            {
                Uid = dto.Uid,
                Email = dto.Email,
                UserName = dto.Username
            };

            _context.User.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario registrado correctamente." });
        }
    }
}
