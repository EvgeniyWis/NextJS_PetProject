import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/*
  Серверная фабрика клиента Supabase для Route Handlers (App Router):
  - Инициализация через переменные окружения: SUPABASE_URL и SUPABASE_SERVICE_ROLE
  - Максимально простая конфигурация без таймаутов и ретраев
  - Экземпляр клиента мемоизируется на уровне модуля, чтобы не пересоздавать его на каждый запрос
*/

// Кэшируем созданный клиент в модульной области (один инстанс на процесс)
let memoizedClient: SupabaseClient | undefined;

// Создаёт новый экземпляр Supabase-клиента, настроенный для серверного использования
function createServerClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

  // Валидация обязательных переменных окружения
  if (!url) throw new Error('SUPABASE_URL is not set');
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE is not set');

  // Создаём Supabase-клиент с минимальными серверными настройками
  return createClient(url, serviceRoleKey, {
    auth: {
      // На сервере сессии не храним и не автообновляем
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Публичная функция для получения (мемоизированного) клиента в Route Handlers
export function getSupabaseServer(): SupabaseClient {
  if (!memoizedClient) memoizedClient = createServerClient();
  return memoizedClient;
}
