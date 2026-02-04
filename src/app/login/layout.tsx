import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner Login',
  description:
    'Sign in to your MoveCompare partner portal to manage leads, credits, and your company profile.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
