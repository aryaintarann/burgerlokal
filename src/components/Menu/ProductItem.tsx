"use client";

import styles from './ProductItem.module.css';
import { ProductWithModifiers, useStore } from '@/store/useStore';

interface ProductItemProps {
    product: ProductWithModifiers;
}

export default function ProductItem({ product }: ProductItemProps) {
    const openProductModal = useStore(state => state.openProductModal);

    return (
        <button className={styles.card} onClick={() => openProductModal(product)}>
            <div className={styles.image} />
            <div className={styles.info}>
                <div>
                    <h3 className={styles.name}>{product.name}</h3>
                    <p className={styles.desc}>{product.description}</p>
                </div>
                <div className={styles.price}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                </div>
            </div>
        </button>
    );
}
