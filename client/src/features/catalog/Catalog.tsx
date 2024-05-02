import ProductList from "./ProductList";
import { useDispatch, useSelector } from "react-redux";
import {
  setPageNumber,
  setProductParams,
} from "./catalogSlice";

import { RootState } from "../../app/store/configureStore";
import { FormControl, Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioGroupButton";
import CheckboxButtons from "../../app/components/CheckBoxButtons";
import AppPagination from "../../app/components/AppPagination";
import LoadingComponent from "../../app/layout/LoadingCOmponent";
import useProducts from "../../app/hooks/useProducts";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High  to Low" },
  { value: "price", label: "Price - Low to High" },
];

export default function Catalog() {
  const {products, brands, types, metaData, filtersLoaded} = useProducts();
  const dispatch = useDispatch();
  const {productParams} = useSelector((state: RootState) => state.catalog);



  if (!filtersLoaded) return <LoadingComponent message="Loading product..." />;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <RadioButtonGroup
              selectedValue={productParams.orderBy}
              options={sortOptions}
              onChange={(e) =>
                dispatch(setProductParams({ orderBy: e.target.value }))
              }
            />
          </FormControl>
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ brands: items }))
            }
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) =>
              dispatch(setProductParams({ types: items }))
            }
          />
        </Paper>
      </Grid>

      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        )}
      </Grid>
    </Grid>
  );
}
