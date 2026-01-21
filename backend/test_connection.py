import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# 1. Cargar Entorno
print("--- DIAGNÓSTICO DE CONEXIÓN ---")
load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("ERROR FATAL: No se leyeron las variables de entorno.")
    sys.exit(1)

print("Credenciales detectadas.")

# 2. Conectar Cliente
try:
    supabase = create_client(url, key)
    print("Cliente Supabase inicializado.")
except Exception as e:
    print(f"ERROR al crear cliente: {e}")
    sys.exit(1)

# 3. PRUEBA CRÍTICA: Buscar Periodo Académico
print("\n--- PRUEBA 1: Tabla 'academic_periods' ---")
try:
    # Intentamos leer la tabla que causa el error
    response = supabase.table("academic_periods").select("*").execute()

    if not response.data:
        print("❌ ALERTA ROJA: La tabla 'academic_periods' está VACÍA.")
        print("El sistema falla porque no sabe a qué fecha asignar las notas.")
        print("SOLUCIÓN: Debes ejecutar el INSERT SQL en Supabase.")
    else:
        print("✅ ÉXITO: Se encontraron periodos académicos.")
        print(f"Datos: {response.data}")

        # Verificar si hay uno activo
        active = [p for p in response.data if p.get('is_active')]
        if active:
            print(f"✅ Periodo Activo encontrado ID: {active[0]['id']}")
        else:
            print("⚠️ ADVERTENCIA: Hay periodos, pero NINGUNO tiene 'is_active': true.")

except Exception as e:
    print(f"❌ ERROR TÉCNICO en Prueba 1: {e}")

# 4. PRUEBA DE ESTUDIANTES
print("\n--- PRUEBA 2: Tabla 'students' ---")
try:
    response = supabase.table("students").select("id, university_id").limit(3).execute()
    print(f"✅ ÉXITO: Conexión a estudiantes correcta. Se leyeron {len(response.data)} filas.")
except Exception as e:
    print(f"❌ ERROR TÉCNICO en Prueba 2: {e}")