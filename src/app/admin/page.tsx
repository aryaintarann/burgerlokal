import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';
import AdminOrderList from '@/components/Admin/AdminOrderList';
export default async function AdminPage() {
    // Fetch initial state
    const activeOrders = await prisma.order.findMany({
        where: {
            status: { notIn: ['COMPLETED', 'ARCHIVED'] }
        },
        include: {
            items: {
                include: {
                    product: true,
                    modifiers: { include: { modifier: true } }
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Kitchen / Cashier</h1>
                <Link href="/" className={styles.backLink}>Go to Menu</Link>
            </header>

            <main>
                <AdminOrderList initialOrders={activeOrders} />
            </main>
        </div>
    );
}
