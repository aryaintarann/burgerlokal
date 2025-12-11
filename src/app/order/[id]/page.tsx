import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export const revalidate = 0; // Dynamic status

interface Props {
    params: { id: string }
}

export default async function OrderPage({ params }: Props) {
    const orderId = parseInt(params.id);

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true,
                    modifiers: { include: { modifier: true } }
                }
            }
        }
    });

    if (!order) {
        return <div>Order not found</div>;
    }

    // Simulated status logic based on time if we wanted, but let's just show "COOKING" as per MVP default
    // or use the status from DB. DB seed default is RECEIVED.
    // We can update it via a button or just show it.

    const steps = ['RECEIVED', 'COOKING', 'READY'];
    const currentStepIndex = steps.indexOf(order.status) === -1 ? 0 : steps.indexOf(order.status);

    return (
        <div className={styles.main}>
            <div className="container">
                <Link href="/" style={{ marginBottom: '2rem', display: 'block' }}>&larr; Back to Menu</Link>

                <div className={styles.card}>
                    <div className={styles.orderId}>Order #{order.id}</div>
                    <div className={styles.status}>{order.status}</div>

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

                    <p style={{ color: 'var(--text-muted)' }}>
                        Please wait at your table. We will call your number.
                    </p>

                    <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px solid var(--divider)', paddingTop: '1rem' }}>
                        <h3>Summary</h3>
                        {order.items.map(item => (
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
            </div>
        </div>
    );
}
