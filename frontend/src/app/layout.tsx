import './globals.css';
import type { Metadata } from 'next';
import AppShell from '../components/AppShell';
import Providers from '../components/Providers';

export const metadata: Metadata = {
  title: 'Escuela de Idiomas del Ejército | SACA',
  description: 'Sistema de Gestión Académica - Escuela de Idiomas del Ejército de Bolivia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
