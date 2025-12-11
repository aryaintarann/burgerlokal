import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Clean up
    await prisma.orderItemModifier.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.modifier.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    // 1. Modifiers
    const extraCheese = await prisma.modifier.create({ data: { name: 'Extra Cheese', price: 5000 } })
    const extraPatty = await prisma.modifier.create({ data: { name: 'Extra Patty', price: 15000 } })
    const noPickles = await prisma.modifier.create({ data: { name: 'No Pickles', price: 0 } })
    const noOnions = await prisma.modifier.create({ data: { name: 'No Onions', price: 0 } })
    const spicySauce = await prisma.modifier.create({ data: { name: 'Spicy Sauce', price: 2000 } })

    // 2. Categories
    const catBurgers = await prisma.category.create({ data: { name: 'Burgers', sortOrder: 1 } })
    const catSides = await prisma.category.create({ data: { name: 'Sides', sortOrder: 2 } })
    const catDrinks = await prisma.category.create({ data: { name: 'Drinks', sortOrder: 3 } })

    // 3. Products

    // Burgers
    await prisma.product.create({
        data: {
            name: 'Classic Burger',
            description: 'Juicy beef patty with fresh lettuce, tomato, and our secret sauce.',
            price: 35000,
            image: '/images/classic-burger.jpg',
            categoryId: catBurgers.id,
            modifiers: {
                connect: [
                    { id: extraCheese.id },
                    { id: extraPatty.id },
                    { id: noPickles.id },
                    { id: noOnions.id },
                    { id: spicySauce.id }
                ]
            }
        }
    })

    await prisma.product.create({
        data: {
            name: 'Cheeseburger Deluxe',
            description: 'Classic burger with melted cheddar cheese and caramelized onions.',
            price: 45000,
            image: '/images/cheeseburger.jpg',
            categoryId: catBurgers.id,
            modifiers: {
                connect: [
                    { id: extraCheese.id },
                    { id: extraPatty.id },
                    { id: noPickles.id },
                    { id: noOnions.id },
                    { id: spicySauce.id }
                ]
            }
        }
    })

    await prisma.product.create({
        data: {
            name: 'Double Trouble',
            description: 'Two beef patties, double cheese, and double the flavor.',
            price: 65000,
            image: '/images/double-burger.jpg',
            categoryId: catBurgers.id,
            modifiers: {
                connect: [
                    { id: extraCheese.id },
                    { id: extraPatty.id },
                    { id: noPickles.id },
                    { id: noOnions.id },
                    { id: spicySauce.id }
                ]
            }
        }
    })

    // Sides
    await prisma.product.create({
        data: {
            name: 'Golden Fries',
            description: 'Crispy salted french fries.',
            price: 20000,
            image: '/images/fries.jpg',
            categoryId: catSides.id,
            modifiers: {
                connect: [
                    { id: spicySauce.id }
                ]
            }
        }
    })

    await prisma.product.create({
        data: {
            name: 'Onion Rings',
            description: 'Battered and fried onion rings with dipping sauce.',
            price: 25000,
            image: '/images/onion-rings.jpg',
            categoryId: catSides.id,
            modifiers: {
                connect: [
                    { id: spicySauce.id }
                ]
            }
        }
    })

    // Drinks
    await prisma.product.create({
        data: {
            name: 'Cola',
            description: 'Iced cold cola.',
            price: 15000,
            image: '/images/cola.jpg',
            categoryId: catDrinks.id
        }
    })

    await prisma.product.create({
        data: {
            name: 'Lemonade',
            description: 'Freshly squeezed lemonade.',
            price: 18000,
            image: '/images/lemonade.jpg',
            categoryId: catDrinks.id
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
