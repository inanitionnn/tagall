'use client';

import { Toaster } from 'sonner';

type Props = {
  children: React.ReactNode;
};
export function ToastWrapper(props: Props) {
  const { children } = props;
  return (
    <>
      <Toaster position="top-right" expand={true} />
      {children}
    </>
  );
}
