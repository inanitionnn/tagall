import { Suspense } from 'react';
import { Navbar } from '../_components/modules';
import Loaging from '../loading';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar>
        <Suspense fallback={<Loaging />}>{children}</Suspense>
      </Navbar>
    </>
  );
}
