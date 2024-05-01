using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;

public class BasketController : BaseApiController
{
    private readonly StoreContext _context;
    public BasketController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket(GetBuyerId());
   
        if (basket == null) return NotFound();

        return basket.MapBasketToDto();
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(AddDeleteBasketDto addToBasketDto)
    {
        var basket = await RetrieveBasket(GetBuyerId());
    
        basket ??= CreateBasket();

        var product = await _context.Products.FindAsync(addToBasketDto.ProductId);

        if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });

        basket.AddItem(product, addToBasketDto.Quantity);


        var result = await _context.SaveChangesAsync() > 0;
 

        if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

        return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity = 1)
    {
        var basket = await RetrieveBasket(GetBuyerId());

        if (basket == null) return NotFound();

        basket.RemoveItem(productId, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
    }

    private async Task<Basket> RetrieveBasket(string buyerId)
    {
        if (string.IsNullOrEmpty(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }

        var result = await _context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(basket => basket.BuyerId == buyerId);
        return result;

    }

   private string GetBuyerId()
{
    var buyerId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Request.Cookies["buyerId"];
    return buyerId;
}

    private Basket CreateBasket()
    {
        var buyerId = User.Identity?.Name;
        if (string.IsNullOrEmpty(buyerId))
        {
            buyerId = Guid.NewGuid().ToString();

        }

        var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
        Response.Cookies.Append("buyerId", buyerId, cookieOptions);

        var basket = new Basket { BuyerId = buyerId };
        _context.Baskets.Add(basket);
        return basket;
    }
}