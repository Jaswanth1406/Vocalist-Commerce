import { Waves } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full max-w-5xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-full">
            <Waves className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-headline">
          Vocalist Commerce
        </h1>
      </div>
    </header>
  );
}
