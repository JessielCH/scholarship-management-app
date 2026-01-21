import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. Forzar la carga del .env buscando la ruta exacta
# Esto arregla problemas si corres uvicorn desde otra carpeta
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, "../../.env")
load_dotenv(env_path)

# 2. Leer variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

print(f"--- DEBUG CONEXIÓN ---")
print(f"Ruta buscada para .env: {env_path}")
print(f"URL encontrada: {url}")
print(f"KEY encontrada: {'SI (Oculta)' if key else 'NO ENCONTRADA (ERROR)'}")
print(f"----------------------")

if not url or not key:
    raise ValueError("CRÍTICO: Faltan las credenciales SUPABASE_URL o SUPABASE_KEY en el .env. Revisa el archivo backend/.env")

# 3. Crear Cliente
try:
    supabase: Client = create_client(url, key)
except Exception as e:
    raise ValueError(f"Error al iniciar cliente Supabase: {e}")