"use client";

import styles from './AdminOrderCard.module.css';
import { updateOrderStatus } from '@/app/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
    order: any; // Using any for simplicity with complex Prisma include, or define generic type
}

export default function AdminOrderCard({ order }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusUpdate = async (newStatus: string) => {
        setIsLoading(true);
        await updateOrderStatus(order.id, newStatus);
        setIsLoading(false);
        router.refresh(); // Refresh server components to show new status order/list
    };

    const nextStatus = {
        'RECEIVED': 'COOKING',
        'COOKING': 'READY',
        'READY': 'COMPLETED',
        'COMPLETED': 'ARCHIVED'
    } as const;

    const statusColor = {
        'RECEIVED': 'var(--text-muted)',
        'COOKING': 'var(--primary)',
        'READY': '#4CAF50',
        'COMPLETED': 'var(--text-muted)'
    };

    const currentStatusColor = statusColor[order.status as keyof typeof statusColor] || 'white';

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.id}>#{order.id}</span>
                <span className={styles.time}>
                    {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={styles.status} style={{ color: currentStatusColor }}>
                    {order.status}
                </span>
            </div>

            <div className={styles.items}>
                {order.items.map((item: any) => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.itemHeader}>
                            <span className={styles.quantity}>{item.quantity}x</span>
                            <span className={styles.productName}>{item.product.name}</span>
                        </div>
                        {item.modifiers.length > 0 && (
                            <div className={styles.modifiers}>
                                {item.modifiers.map((m: any) => m.modifier.name).join(', ')}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.total}>
                Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total)}
            </div>

            <div className={styles.actions}>
                {order.status !== 'COMPLETED' && order.status !== 'ARCHIVED' && (
                    <button
                        className={styles.actionButton}
                        onClick={() => handleStatusUpdate(nextStatus[order.status as keyof typeof nextStatus])}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : `Mark as ${nextStatus[order.status as keyof typeof nextStatus]}`}
                    </button>
                )}
            </div>
        </div>
    );
}
