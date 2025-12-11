"use server";

import { prisma } from '@/lib/prisma';
import { CartItem } from '@/store/useStore';

export async function placeOrder(items: CartItem[]) {
    // Calculate total on server to be safe (re-fetching prices ideally),
    // but for MVP trust client or just sum up what we have.
    // We'll trust client prices for simplicity here, but in real app fetch Product.price

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await prisma.order.create({
        data: {
            status: 'RECEIVED',
            total: total,
            items: {
                create: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.price,
                    // Modifiers
                    modifiers: {
                        create: item.selectedModifiers.map(mod => ({
                            modifierId: mod.id,
                            price: mod.price
                        }))
                    }
                }))
            }
        }
    });


    return order.id;
}

export async function updateOrderStatus(orderId: number, status: string) {
    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
    // revalidatePath('/admin'); 
}

export async function fetchActiveOrders() {
    return await prisma.order.findMany({
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
}

export async function fetchOrder(orderId: number) {
    return await prisma.order.findUnique({
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
}
