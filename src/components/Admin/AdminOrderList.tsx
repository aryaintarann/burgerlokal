"use client";

import { useEffect, useState } from 'react';
import AdminOrderCard from './AdminOrderCard';
import styles from '@/app/admin/page.module.css'; // Reuse existing grid styles
import { fetchActiveOrders } from '@/app/actions';

interface Props {
    initialOrders: any[];
}

export default function AdminOrderList({ initialOrders }: Props) {
    const [orders, setOrders] = useState(initialOrders);

    useEffect(() => {
        // Poll every 3 seconds
        const interval = setInterval(async () => {
            try {
                const freshOrders = await fetchActiveOrders();
                setOrders(freshOrders);
            } catch (error) {
                console.error("Failed to poll orders:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (orders.length === 0) {
        return <div className={styles.empty}>No active orders</div>;
    }

    // Sort locally just in case, though server does it too
    // Keeping server order is safest to prevent jumping if timestamps are close
    return (
        <div className={styles.grid}>
            {orders.map((order: any) => (
                <AdminOrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}
