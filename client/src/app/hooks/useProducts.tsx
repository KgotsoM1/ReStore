import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { productSelectors, fetchProductsAsync, fetchFilters } from "../../features/catalog/catalogSlice";
import { useAppSelector, RootState } from "../store/configureStore";

export default function useProducts() {

    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useDispatch();
    const {
      productsLoaded,
      filtersLoaded,
      brands,
      types,
      metaData,
    } = useSelector((state: RootState) => state.catalog);
  
    useEffect(() => {
      if (!productsLoaded) {
        dispatch(fetchProductsAsync() as unknown as AnyAction);
      }
    }, [dispatch, productsLoaded]);
  
    useEffect(() => {
      if (!filtersLoaded) {
        dispatch(fetchFilters() as unknown as AnyAction);
      }
    }, [dispatch, filtersLoaded]);

    return { products, filtersLoaded,productsLoaded, brands, types, metaData}
}