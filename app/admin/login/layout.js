export const metadata = {
  title: "Login Admin - Dusun Grenggeng",
  description: "Halaman login untuk administrator website Dusun Grenggeng",
  robots: "noindex, nofollow",
};

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  );
}
