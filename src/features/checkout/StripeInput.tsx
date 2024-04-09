import { InputBaseComponentProps } from '@mui/material';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface Props extends InputBaseComponentProps { }

export const StripeInput = forwardRef(function StripeInput({ component: Component, ...props }: Props,
    ref: React.Ref<unknown>) {
    const elementRef = useRef<unknown>();

    useImperativeHandle(ref, () => ({
        focus: () => (elementRef.current as HTMLElement).focus()
    }));

    return (
        <Component
            onReady={(element: unknown) => (elementRef.current = element)}
            {...props}
        />
    )
});