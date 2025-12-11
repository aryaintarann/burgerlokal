import { prisma } from '@/lib/prisma';
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
          <h1>BurgerLokal</h1>
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
