import {  useEffect } from "react";
import ProductList from "./ProductList";
import LoadingComponent from "../../app/layout/LoadingCOmponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters, fetchProductsAsync, productSelectors } from "./catalogSlice";
import { AnyAction } from "redux";
import { RootState } from "../../app/store/configureStore";
import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Paper, Radio, RadioGroup, TextField } from "@mui/material";

const sortOptions = [
   {value: 'name', label: 'Alphabetical'},
   {value: 'priceDesc', label: 'Price - High  to Low'},
   {value: 'price', label: 'Price - Low to High'}
]


export default function Catalog() {
   const products = useSelector(productSelectors.selectAll);
   const dispatch = useDispatch();
   const {productsLoaded, status, filtersLoaded, brands, types}= useSelector((state: RootState) => state.catalog);

   useEffect(() =>{
         if (!productsLoaded) { dispatch(fetchProductsAsync() as unknown as AnyAction);}   
   }, [dispatch, productsLoaded])

   useEffect(() => {
      if (!filtersLoaded) { dispatch(fetchFilters() as unknown as AnyAction)}
   }, [dispatch, filtersLoaded])
   
   if (status.includes('pending')) return <LoadingComponent message='Loading product...'/>

 return (
    <Grid container spacing={4}>
      <Grid item xs ={3}> 
      <Paper sx={{mb: 2}}>
         <TextField
         label='Search Products'
         variant='outlined'
         fullWidth
         />
         
      </Paper>
      <Paper sx={{mb:2, p:2}}>
      <FormControl>
  <RadioGroup>
   {sortOptions.map(({value, label}) => (
    <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
   ))}
  </RadioGroup>
</FormControl>
      </Paper>

      <Paper sx={{mb:2, p:2}}>
      <FormGroup>
         {brands.map(brand => (
            <FormControlLabel control={<Checkbox/>} label={brand} key={brand}/>
         ))}
</FormGroup>
      </Paper>

      <Paper sx={{mb:2, p:2}}>
  <FormGroup>
     {types.map(type => (
        <FormControlLabel control={<Checkbox/>} label={type} key={type}/>
     ))}
  </FormGroup>
</Paper>
      </Grid>

      <Grid item xs={9}>
      <ProductList products={products}/> 
      </Grid>
      
    </Grid>
   
 )
}