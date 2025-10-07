import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // Указываем корень проекта для Turbopack, чтобы избежать выбора неверного workspace root
    root: __dirname,
  },
};

export default nextConfig;
