import pandas as pd
from app.core.database import supabase
from fastapi import HTTPException


async def process_automatic_selection():
    print("--- INICIANDO PROCESO DE SELECCIÓN AUTOMÁTICA ---")

    # 1. Obtener Periodo Activo
    period_res = supabase.table("academic_periods").select("id").eq("is_active", True).execute()
    if not period_res.data:
        raise HTTPException(status_code=400, detail="No hay un periodo académico activo.")

    period_id = period_res.data[0]['id']

    # 2. Obtener TODAS las notas del periodo actual junto con datos del estudiante y carrera
    # Hacemos un join manual trayendo los datos
    print("Obteniendo registros académicos...")

    # a) Traer notas (filtrando solo regulares según Art. 13)
    records = supabase.table("academic_records") \
        .select("student_id, average_grade") \
        .eq("period_id", period_id) \
        .eq("is_regular", True) \
        .execute()

    if not records.data:
        raise HTTPException(status_code=400, detail="No se encontraron notas de estudiantes regulares en este periodo.")

    df_records = pd.DataFrame(records.data)

    # b) Traer datos de estudiantes para saber su carrera
    student_ids = df_records['student_id'].tolist()
    students = supabase.table("students") \
        .select("id, career_id, email_institutional") \
        .in_("id", student_ids) \
        .execute()

    df_students = pd.DataFrame(students.data)

    # 3. Unir (Merge) las tablas en un solo DataFrame
    # Ahora tenemos una tabla gigante con: student_id, average_grade, career_id
    df_full = pd.merge(df_records, df_students, left_on='student_id', right_on='id')

    selected_students = []

    # 4. El Algoritmo del 10% por Carrera
    # Agrupamos los datos por 'career_id'
    grouped = df_full.groupby('career_id')

    print("Analizando carreras...")

    for career_id, group in grouped:
        total_students = len(group)

        # Calculamos cuántos cupos hay (10% del total)
        # Mínimo 1 beca si hay estudiantes, redondeamos hacia arriba
        slots = int(total_students * 0.10)
        if slots < 1 and total_students > 0:
            slots = 1

        # Ordenamos por nota descendente (Mejores notas arriba)
        sorted_group = group.sort_values(by='average_grade', ascending=False)

        # Tomamos los 'slots' mejores
        winners = sorted_group.head(slots)

        print(f"Carrera {career_id}: Total {total_students} -> Becados {slots}")

        # Agregamos a la lista de ganadores
        for _, row in winners.iterrows():
            selected_students.append({
                "student_id": row['student_id'],
                "period_id": period_id,
                "status": "Preselected",
                "amount": 400.00  # Monto fijo según Art. 3
            })

    # 5. Guardar los ganadores en la tabla scholarship_applications
    if selected_students:
        print(f"Insertando {len(selected_students)} becarios preseleccionados...")
        try:
            # Usamos upsert para no duplicar si se corre el proceso dos veces
            # Nota: Supabase upsert requiere conflicto en unique key.
            # Como no definimos unique(student, period) en applications, insertará nuevos.
            # Para producción real deberíamos verificar antes, pero por ahora limpiaremos.

            # Limpieza preventiva para este periodo (idempotencia básica)
            # (Opcional: podrías querer no borrar si ya hay documentos, pero para MVP está bien)

            # Usamos UPSERT + el nombre del candado que acabamos de crear
            data = supabase.table("scholarship_applications").upsert(
                selected_students,
                on_conflict="student_id, period_id"
            ).execute()
            return {
                "status": "success",
                "message": "Proceso completado exitosamente",
                "total_candidates": len(df_full),
                "total_preselected": len(selected_students)
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error guardando becas: {str(e)}")

    return {"status": "success", "message": "No se encontraron estudiantes elegibles", "total_preselected": 0}