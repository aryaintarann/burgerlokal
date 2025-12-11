import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';
import OrderTracker from '@/components/Order/OrderTracker';

export const revalidate = 0;

interface Props {
    params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: Props) {
    const { id } = await params;
    const orderId = parseInt(id);

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

    // Pass styling down or wrap logic? OrderTracker uses page.module.css
    // We keep the container layout here.

    return (
        <div className={styles.main}>
            <div className="container">
                <Link href="/" style={{ marginBottom: '2rem', display: 'block' }}>&larr; Back to Menu</Link>
                <OrderTracker initialOrder={order} />
            </div>
        </div>
    );
}
