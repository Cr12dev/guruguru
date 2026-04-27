# Configuración de Supabase para Guruguru Forum

## 1. Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión o crea una cuenta
4. Crea un nuevo proyecto con un nombre (ej: "guruguru-forum")
5. Elige una región cercana a ti
6. Configura una contraseña para la base de datos
7. Espera a que el proyecto se cree (puede tardar unos minutos)

## 2. Obtener las credenciales

1. Ve a la sección "Settings" > "API"
2. Copia los siguientes valores:
   - **Project URL**: Tu URL del proyecto (ej: `https://fsmyhhhuvajsguhrpuus.supabase.co`)
   - **anon/public key**: Tu clave pública (empieza con `eyJ...`)

## 3. Configurar las variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Añade las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```

Reemplaza `tu_url_aqui` y `tu_clave_anon_aqui` con los valores que copiaste en el paso 2.

## 4. Crear la tabla de mensajes

1. Ve a la sección "SQL Editor" en Supabase
2. Haz clic en "New query"
3. Pega el siguiente SQL y ejecútalo:

```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  avatar_name TEXT NOT NULL,
  avatar_type TEXT NOT NULL CHECK (avatar_type IN ('videojuego', 'coche', 'actor')),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE user_presence (
  user_id UUID PRIMARY KEY,
  online BOOLEAN DEFAULT TRUE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update own messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Allow delete own messages" ON messages FOR DELETE USING (true);

CREATE POLICY "Allow read access" ON user_presence FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON user_presence FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update own presence" ON user_presence FOR UPDATE USING (true);
CREATE POLICY "Allow delete own presence" ON user_presence FOR DELETE USING (true);
```

## 5. Habilitar Realtime

1. Ve a la sección "Database" > "Replication"
2. Activa el switch de "Realtime"
3. Ve a "Database" > "Tables" > "messages"
4. En la pestaña "Realtime", activa la replicación para la tabla `messages`
5. Ve a "Database" > "Tables" > "user_presence"
6. En la pestaña "Realtime", activa la replicación para la tabla `user_presence`

## 6. Verificar la configuración

Ahora puedes ejecutar el proyecto:

```bash
npm run dev
```

Si todo está configurado correctamente, deberías ver el chat funcionando en [http://localhost:3000](http://localhost:3000) en tu navegador.
