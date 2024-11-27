import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React from 'react';

const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "EUR",
    intent: "capture",
};

interface PayPalButtonProps {
    amount: number;
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                style={{ layout: "horizontal" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount.toString(),
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (data, actions) => {
                    if (actions.order) {
                        const details = await actions.order.capture();
                        onSuccess(details);
                    }
                }}
                onError={(err) => {
                    onError(err);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;
