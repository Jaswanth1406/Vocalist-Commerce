import { Header } from '@/components/layout/header';
import { CatalogCreator } from '@/components/catalog-creator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
        <CatalogCreator />
      </main>
    </div>
  );
}
