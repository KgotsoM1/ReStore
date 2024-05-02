using System.Text.Json;
using API.Data;
using API.Entities;
using API.DTOs;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;


namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            var products =
                await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);

            if (productDto.File != null)
            {
                var uploadResult = await _imageService.AddPhotoAsync(productDto.File);

                if (uploadResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = uploadResult.Error.Message });

                product.PictureUrl = uploadResult.SecureUrl.ToString();
                product.PublicId = uploadResult.PublicId;


            }

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtAction("GetProduct", new { id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Problem creating product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, UpdateProductDto productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest("Mismatch between URL id and productDto id");
            }

            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            _mapper.Map(productDto, product);
     
            if (productDto.File != null)
            {
                var uploadResult = await _imageService.AddPhotoAsync(productDto.File);

                if (uploadResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = uploadResult.Error.Message });

                if (!string.IsNullOrEmpty(product.PublicId))
                {
                    var deletionResult = await _imageService.DeletePhotoAsync(product.PublicId);

                    if (deletionResult.Error != null)
                        return BadRequest(new ProblemDetails { Title = deletionResult.Error.Message });
                }
                product.PictureUrl = uploadResult.SecureUrl.ToString();
                product.PublicId = uploadResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return NoContent();

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

         
            if (product == null) return NotFound();

               if (!string.IsNullOrEmpty(product.PublicId))
                {
                    var deletionResult = await _imageService.DeletePhotoAsync(product.PublicId);

                    if (deletionResult.Error != null)
                        return BadRequest(new ProblemDetails { Title = deletionResult.Error.Message });
                }

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return product;

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
    }
}