

using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
           public int Id {get; set;}
          public string BuyerId {get; set;}
          
          [Required]
          public ShippingAddress ProductId {get; set;}
          public DateTime OrderDate { get; set; } = DateTime.Now;
          public List<OrderItem> Subtotal { get; set; }
           public long DeliveryFee {get; set;}
          public long SubTotal {get; set;}
          
         public long GetTotal()
            {
            return  SubTotal + DeliveryFee;
            }
    }
}