using System;
using System.Threading.Tasks;
using Otus.AuthOnSpa.Models;

namespace Otus.AuthOnSpa.Service
{
  public class UserService
  {
    public async Task<User> TryGetUser(string email, string password)
    {
      if (email.Equals("test@test.com", StringComparison.OrdinalIgnoreCase) && password == "test")
      {
        return new User
        {
          Login = "test",
          Email = "test@test.com",
        };
      }

      return null;
    }
  }
}