using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        [Key]
        public int Id { get; set; }
        public int ProductId {get; set;}
        public string Name {get; set;}
           public string PictureUrl {get; set;}
    }
}