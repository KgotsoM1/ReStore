using API.Entities;
using Microsoft.AspNetCore.Identity;


namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "bob",
                    Email = "bob@test.com"
                };

                await userManager.CreateAsync(user, "Pa$$word");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$word");
                await userManager.AddToRoleAsync(admin, "Admin");
            }

            if (context.Products.Any()) return;

            var products = new List<Product>
            {
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
