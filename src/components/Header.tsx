"use client";

import styles from './Header.module.css';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/store/useStore';

export default function Header() {
    const cart = useStore(state => state.cart);
    const toggleCart = useStore(state => state.toggleCart);

    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="BurgerLokal Logo"
                        width={140}
                        height={40}
                        style={{ objectFit: 'contain', height: '40px', width: 'auto' }}
                        priority
                    />
                </Link>
                <button className={styles.cartButton} onClick={toggleCart}>
                    <ShoppingBag size={18} />
                    <span>{itemCount}</span>
                </button>
            </div>
        </header>
    );
}
