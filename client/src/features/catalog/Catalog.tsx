import { Product } from "../../app/models/product";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingCOmponent";



export default function Catalog() {
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() =>{
   agent.Catalog.list()
   .then(products => setProducts(products))
   .catch(error => console.log(error))
   .finally(() => setLoading(false))
   }, [])
   
   if (loading) return <LoadingComponent message='Loading product...'/>

 return (
    <>
       <ProductList products={products}/> 
    </>
   
 )
}