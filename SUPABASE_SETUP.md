# Configuración de Supabase

## 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que el proyecto se inicialice

## 2. Obtener credenciales

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - `Project URL` (será tu `NEXT_PUBLIC_SUPABASE_URL`)
   - `anon` / `public` key (será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## 4. Crear la tabla de mensajes

Ve a **SQL Editor** en Supabase y ejecuta el siguiente SQL:

```sql
-- Crear tabla de mensajes
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  avatar_name TEXT NOT NULL,
  avatar_type TEXT NOT NULL CHECK (avatar_type IN ('videojuego', 'coche', 'actor')),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (opcional, para mayor seguridad)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Permitir lectura e inserción a todos (para chat anónimo)
CREATE POLICY "Allow read access" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON messages FOR INSERT WITH CHECK (true);
```

## 5. Habilitar Realtime

1. Ve a **Database** > **Replication** en Supabase
2. Enciende el switch para **Realtime**
3. Ve a **Database** > **Tables**
4. Selecciona la tabla `messages`
5. En la pestaña **Realtime**, activa la replicación para esta tabla

## 6. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
