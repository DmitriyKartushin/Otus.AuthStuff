export const authService = {
  isAuthenticated: false,
  
  async initAuth() {
    if (!authService.isAuthenticated) {
      const response = await fetch("/Account/me");
      authService.isAuthenticated = response.ok;
      
      return await response.json();
    }
    
    return null;
  },
  
  async authenticate(email, password) {
    const resp = await fetch("/Account/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })

    if (resp.ok) {
      authService.isAuthenticated = true;
    } else {
      // const content = await resp.json();
      // setTimeout(cb, 100); // fake async  
    }
  },

  signout(cb) {
    authService.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};