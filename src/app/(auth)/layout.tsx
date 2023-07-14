interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <main className="container absolute flex items-center col-span-1 -translate-y-1/2 top-1/2 md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
        {children}
      </main>
    </div>
  );
}
