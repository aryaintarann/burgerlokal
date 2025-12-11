"use client";

import styles from './CartDrawer.module.css';
import { useStore } from '@/store/useStore';
import { X } from 'lucide-react';
import { useState } from 'react';
import { placeOrder } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
    const { isCartOpen, toggleCart, cart, removeFromCart, clearCart } = useStore();
    const [isOrdering, setIsOrdering] = useState(false);
    const router = useRouter();

    if (!isCartOpen) return null;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setIsOrdering(true);
        try {
            const orderId = await placeOrder(cart);
            clearCart();
            setIsOrdering(false);
            toggleCart();
            router.push(`/order/${orderId}`);
        } catch (e) {
            console.error(e);
            alert('Failed to place order');
            setIsOrdering(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) toggleCart();
        }}>
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Your Order</h2>
                    <button className={styles.closeButton} onClick={toggleCart}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {cart.length === 0 ? (
                        <div className={styles.empty}>Your cart is empty</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemName}>{item.quantity}x {item.product.name}</div>
                                    <div className={styles.itemMods}>
                                        {item.selectedModifiers.map(mod => (
                                            <span key={mod.id}>+ {mod.name}</span>
                                        ))}
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <div className={styles.price}>{formatPrice(item.price * item.quantity)}</div>
                                        <button className={styles.removeButton} onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.totalRow}>
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <button
                        className={styles.checkoutButton}
                        disabled={cart.length === 0 || isOrdering}
                        onClick={handleCheckout}
                        style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
                    >
                        {isOrdering ? 'Placing Order...' : 'Pay at Cashier'}
                    </button>
                </div>
            </div>
        </div>
    );
}
