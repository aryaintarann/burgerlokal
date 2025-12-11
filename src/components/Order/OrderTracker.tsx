"use client";

import { useEffect, useState } from 'react';
import styles from '@/app/order/[id]/page.module.css'; // Reuse existing styles
import { fetchOrder } from '@/app/actions';
import Link from 'next/link';

interface Props {
    initialOrder: any;
}

export default function OrderTracker({ initialOrder }: Props) {
    const [order, setOrder] = useState(initialOrder);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const freshOrder = await fetchOrder(initialOrder.id);
                if (freshOrder) {
                    setOrder(freshOrder);
                }
            } catch (error) {
                console.error("Failed to update order:", error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [initialOrder.id]);

    const steps = ['RECEIVED', 'COOKING', 'READY'];
    const currentStepIndex = steps.indexOf(order.status) === -1 ? 0 : steps.indexOf(order.status);
    const isCompleted = order.status === 'COMPLETED';

    return (
        <div className={styles.card}>
            <div className={styles.orderId}>Order #{order.id}</div>
            <div className={styles.status}>
                {isCompleted ? 'COMPLETED' : order.status}
            </div>

            {!isCompleted && (
                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <div key={step} className={`${styles.step} ${index <= currentStepIndex ? styles.active : ''}`}>
                            <div className={styles.stepDot}>
                                {index < currentStepIndex && <span>✓</span>}
                            </div>
                            <div className={styles.stepLabel}>{step}</div>
                        </div>
                    ))}
                </div>
            )}

            <p style={{ color: 'var(--text-muted)' }}>
                {isCompleted
                    ? "Order completed. Thank you for dining with us!"
                    : "Please wait at your table. We will call your number."}
            </p>

            <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px solid var(--divider)', paddingTop: '1rem' }}>
                <h3>Summary</h3>
                {order.items.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
                        <span>{item.quantity}x {item.product.name}</span>
                        <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity)}</span>
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '1rem' }}>
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total)}</span>
                </div>
            </div>
        </div>
    );
}
