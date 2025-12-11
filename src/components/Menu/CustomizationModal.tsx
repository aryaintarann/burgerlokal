"use client";

import { useEffect, useState } from 'react';
import styles from './CustomizationModal.module.css';
import { useStore } from '@/store/useStore';
import { X, Check } from 'lucide-react';
import { Modifier } from '@prisma/client';

export default function CustomizationModal() {
    const { selectedProduct, isModalOpen, closeProductModal, addToCart } = useStore();
    const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
    const [quantity, setQuantity] = useState(1);

    // Reset state when product changes
    useEffect(() => {
        setSelectedModifiers([]);
        setQuantity(1);
    }, [selectedProduct]);

    if (!isModalOpen || !selectedProduct) return null;

    const toggleModifier = (modifier: Modifier) => {
        const exists = selectedModifiers.find(m => m.id === modifier.id);
        if (exists) {
            setSelectedModifiers(selectedModifiers.filter(m => m.id !== modifier.id));
        } else {
            setSelectedModifiers([...selectedModifiers, modifier]);
        }
    };

    const calculateTotal = () => {
        const base = selectedProduct.price;
        const mods = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
        return (base + mods) * quantity;
    };

    const handleAddToCart = () => {
        addToCart({
            id: Date.now().toString(),
            product: selectedProduct,
            quantity,
            selectedModifiers,
            price: calculateTotal() / quantity // Unit price
        });
        closeProductModal();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    return (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) closeProductModal();
        }}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{selectedProduct.name}</h2>
                    <button className={styles.closeButton} onClick={closeProductModal}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>{selectedProduct.description}</p>

                    {selectedProduct.modifiers.length > 0 && (
                        <div className={styles.modifiersSection}>
                            <h3 className={styles.sectionTitle}>Customization</h3>
                            <div className={styles.modifierList}>
                                {selectedProduct.modifiers.map(mod => {
                                    const isActive = selectedModifiers.some(m => m.id === mod.id);
                                    return (
                                        <div
                                            key={mod.id}
                                            className={`${styles.modifierItem} ${isActive ? styles.active : ''}`}
                                            onClick={() => toggleModifier(mod)}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {isActive && <Check size={16} color="var(--primary)" />}
                                                {mod.name}
                                            </span>
                                            <span>
                                                {mod.price === 0 ? 'Free' : `+${formatPrice(mod.price)}`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.addButton} onClick={handleAddToCart}>
                        <span>Add to Order</span>
                        <span>{formatPrice(calculateTotal())}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
