using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Otus.AuthOnSpa.Service;

namespace Otus.AuthOnSpa.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserService _userService;

    public AccountController(UserService userService)
    {
      _userService = userService;
    }

    [HttpGet("me")]
    [Authorize]
    public UserModel Me()
    {
      return new UserModel
      {
        Login = User.Identity.Name,
        Email = User.FindFirstValue("email"),
        Roles = User.FindAll(ClaimTypes.Role).Select(x => x.Value)
      };
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {
      if (ModelState.IsValid)
      {
        var user = await _userService.TryGetUser(model.Email, model.Password);
        if (user != null)
        {
          await Authenticate(model.Email);
          return NoContent();
        }
      }

      return BadRequest();
    }

    private async Task Authenticate(string userName)
    {
      var id = new ClaimsIdentity(
        new[]
        {
          new Claim(ClaimsIdentity.DefaultNameClaimType, userName),
          new Claim(ClaimTypes.Email, "userName@test.com"),
          new Claim(ClaimTypes.Role, "admin"),
          new Claim(ClaimTypes.Role, "user"),
          new Claim(ClaimTypes.Role, "reader"),
          new Claim("Company", "Otus"),
          new Claim("Age", "19"),
        },
        "ApplicationCookie",
        ClaimsIdentity.DefaultNameClaimType,
        ClaimsIdentity.DefaultRoleClaimType
      );
      
      await HttpContext.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme, 
        new ClaimsPrincipal(id)
      );
    }
  }

  public class UserModel
  {
    public string Login { get; set; }
    public string Email { get; set; }
    public IEnumerable<string> Roles { get; set; }
  }


  public class LoginModel
  {
    [Required] public string Email { get; set; }
    [Required] public string Password { get; set; }
  }
}