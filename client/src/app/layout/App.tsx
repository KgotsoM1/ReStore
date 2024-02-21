import { useEffect, useState } from "react";
import {Product} from "../models/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() =>{
    fetch('http://localhost:5256/api/products')
    .then(response => response.json())
    .then(data => setProducts(data))
  }, [])

function addProducts(){
  setProducts(prevState => [...prevState,
     {
      id: prevState.length +101,
      name:'product' + (prevState.length+1), 
      price: 300.00,
      brand: 'some brand',
      description: 'some description',
      pictureUrl: 'http://picsum.photos/200',
    }])
}

  return (
    <div>
     <h1>Re-Store</h1>
       <ul>{products.map((product) => (
    <li key={product.id}> {product.name} - {product.price}</li>
  ))}</ul>
  <button onClick={addProducts}>Add Products</button>
    </div>
  )
}

export default App
