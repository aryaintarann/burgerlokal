import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Header from '@/components/Header';
import styles from './page.module.css';
import ProductItem from '@/components/Menu/ProductItem';
import CustomizationModal from '@/components/Menu/CustomizationModal';
import CartDrawer from '@/components/Cart/CartDrawer';

export const revalidate = 60;

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: { modifiers: true }
      }
    },
    orderBy: {
      sortOrder: 'asc'
    }
  });

  return (
    <div className={styles.main}>
      <Header />

      <div className="container">
        <div className={styles.hero}>
          <Image
            src="/logo.png"
            alt="BurgerLokal"
            width={220}
            height={80}
            priority
            className={styles.heroLogo}
          />
          <p>Premium Smash Burgers & Sides</p>
        </div>

        {categories.map(category => (
          <section key={category.id} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category.name}</h2>
            <div className={styles.grid}>
              {category.products.map(product => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <CustomizationModal />
      <CartDrawer />
    </div>
  );
}
