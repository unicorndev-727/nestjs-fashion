import getStripe from "../Util/getStripejs";

import React, { useEffect, useMemo, useState } from 'react';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import axios from "axios";
import Button from "../Buttons/Button";
import { useTranslations } from "next-intl";

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
    const t = useTranslations("CartWishlist");
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (elements == null) {
            return;
        }

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            // Show error to your customer
            setErrorMessage(submitError?.message ?? '');
            return;
        }

        //@ts-ignore
        const { error } = await stripe?.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            clientSecret,
            confirmParams: {
                return_url: process.env.NEXT_PUBLIC_FRONTEND_URL ?? 'https://localost:3000/stripe-status',
            },
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrorMessage(error?.message ?? '');
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <PaymentElement />
            <Button
                type="submit"
                value={t("place_order")}
                size="xl"
                extraClass={`w-full`}
                disabled={!stripe || !elements || !clientSecret}
            />
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    );
};

const CheckoutElement = ({ amount, currency = 'usd' }: { amount: number, currency: string }) => {
    const [clientSecret, setClientSecret] = useState<string>('');

    useEffect(() => {
        (async () => {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkouts/stripe/payment-intent`, {
                amount,
                currency
            });
            const { client_secret } = await res.data;
            setClientSecret(client_secret)
        })();
    }, [amount, currency])

    const options = useMemo(() => ({
        // passing the client secret obtained in step 3
        clientSecret,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
    }), [clientSecret]);

    if (!clientSecret) {
        return <>Loading...</>
    }

    return (<Elements stripe={getStripe()} options={options}>
        <CheckoutForm clientSecret={clientSecret} />
    </Elements>)
};

export default CheckoutElement;
