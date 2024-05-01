import {Elements} from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import {loadStripe} from "@stripe/stripe-js";
import { useState, useEffect } from 'react';
import agent from '../../app/api/agent';
import { useAppDispatch } from '../../app/store/configureStore';
import { setBasket } from '../basket/basketSlice';
import LoadingComponent from "../../app/layout/LoadingCOmponent";

const stripePromise = loadStripe('pk_test_51P5gFwCiRwIcdtF4FLyFjZ8v1PYuVxRacxSVML2BVeGzpevVhYgvwI7sgejrUVZxLkHpmddFVbZgsYc0XPNKfKZs006hulLXQ5');

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.error(error))
            .finally(() => setLoading(false))
    }, [dispatch]);

    if (loading) return <LoadingComponent message='Loading checkout' />

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}