import os
import random
import uuid
from faker import Faker
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. Setup Inicial
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

fake = Faker(['es_ES'])

# Configuración
TOTAL_STUDENTS = 5000

# Datos Maestros de la Universidad
FACULTIES = {
    "Facultad de Ingeniería": [
        "Ingeniería en Sistemas de Información",
        "Ingeniería Civil",
        "Ingeniería Industrial",
        "Ingeniería en Computación Gráfica"
    ],
    "Facultad de Ciencias Administrativas": [
        "Administración de Empresas",
        "Contabilidad y Auditoría",
        "Finanzas"
    ],
    "Facultad de Jurisprudencia": [
        "Derecho",
        "Ciencias Policiales"
    ],
    "Facultad de Medicina": [
        "Medicina",
        "Enfermería",
        "Laboratorio Clínico"
    ]
}


# ---------------------------------------------------------
# FUNCIÓN 1: Crear Facultades y Carreras (Si no existen)
# ---------------------------------------------------------
def seed_faculties_and_careers():
    print("--- Verificando Estructura Académica ---")

    # Verificamos si ya hay carreras
    existing = supabase.table("careers").select("id").limit(1).execute()
    if existing.data:
        print("Facultades y carreras ya existen. Saltando creación.")
        # Retornamos los IDs existentes
        all_careers = supabase.table("careers").select("id").execute()
        return [c['id'] for c in all_careers.data]

    print("Creando Facultades y Carreras...")
    created_career_ids = []

    for faculty_name, careers_list in FACULTIES.items():
        # 1. Crear Facultad
        res = supabase.table("faculties").insert({"name": faculty_name}).execute()
        faculty_id = res.data[0]['id']

        # 2. Crear Carreras
        for career_name in careers_list:
            career_data = {
                "faculty_id": faculty_id,
                "name": career_name,
                "total_semesters": 10 if "Ingeniería" in faculty_name else 9
            }
            res_career = supabase.table("careers").insert(career_data).execute()
            created_career_ids.append(res_career.data[0]['id'])

    print(f"¡Estructura creada! {len(created_career_ids)} carreras disponibles.")
    return created_career_ids


# ---------------------------------------------------------
# FUNCIÓN 2: Generar Email
# ---------------------------------------------------------
def generate_student_email(first_name, last_name):
    import unicodedata
    def clean(text):
        return ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn').lower()

    f = clean(first_name.split(' ')[0])
    l = clean(last_name.split(' ')[0])
    return f"{f}{l}{random.randint(10, 99)}@uce.edu.ec"


# ---------------------------------------------------------
# FUNCIÓN 3: Crear Estudiantes
# ---------------------------------------------------------
def seed_students(career_ids):
    print(f"\n--- Generando {TOTAL_STUDENTS} Estudiantes ---")

    students_batch = []

    for i in range(TOTAL_STUDENTS):
        # Datos base
        f_name = fake.first_name()
        l_name = fake.last_name() + " " + fake.last_name()
        email = generate_student_email(f_name, l_name)
        mat_id = 100000 + i
        u_id = f"UCE-{mat_id}"

        # --- USUARIOS DE PRUEBA (IDs Fijos) ---
        if i == 0:
            f_name = "Estudiante"
            l_name = "Becado Prueba"
            email = "estudiante_becado@uce.edu.ec"
            u_id = "UCE-TEST-001"
        elif i == 1:
            f_name = "Estudiante"
            l_name = "Normal Prueba"
            email = "estudiante_normal@uce.edu.ec"
            u_id = "UCE-TEST-002"
        # --------------------------------------

        student_data = {
            "university_id": u_id,
            "email_institutional": email,
            "first_name": f_name,
            "last_name": l_name,
            "career_id": random.choice(career_ids),
            "current_semester": random.randint(2, 9),
            "address": fake.address(),
            "phone_number": fake.phone_number(),
            "profile_id": None
        }
        students_batch.append(student_data)

        # Insertar por lotes
        if len(students_batch) >= 100:
            try:
                supabase.table("students").insert(students_batch).execute()
                students_batch = []
                print(".", end="", flush=True)
            except Exception as e:
                # Si falla por duplicado, lo mostramos pero seguimos
                if "duplicate key" not in str(e):
                    print(f"\nError lote {i}: {e}")

    # Insertar restantes
    if students_batch:
        supabase.table("students").insert(students_batch).execute()

    print("\n\n--- PROCESO TERMINADO ---")
    print("Usuarios clave creados:")
    print("1. estudiante_becado@uce.edu.ec")
    print("2. estudiante_normal@uce.edu.ec")


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------
if __name__ == "__main__":
    # 1. Asegurar Carreras
    ids = seed_faculties_and_careers()

    # 2. Asegurar Estudiantes
    if ids:
        seed_students(ids)
    else:
        print("Error crítico: No se pudieron obtener IDs de carreras.")