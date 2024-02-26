import { Product } from "../../app/models/product";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";


export default function Catalog() {
   const [products, setProducts] = useState<Product[]>([]);

   useEffect(() =>{
     fetch('http://localhost:5256/api/products')
     .then(response => response.json())
     .then(data => setProducts(data))
   }, [])

 return (
    <>
       <ProductList products={products}/> 
    </>
   
 )
}