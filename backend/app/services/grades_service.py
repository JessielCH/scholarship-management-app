import pandas as pd
from io import BytesIO
from fastapi import UploadFile, HTTPException
from app.core.database import supabase


async def process_grades_file(file: UploadFile):
    # 1. Leer el archivo (Soporta CSV y Excel)
    contents = await file.read()

    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Formato no soportado. Use CSV o Excel.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error leyendo archivo: {str(e)}")

    # 2. Validar columnas requeridas
    required_columns = ['university_id', 'average_grade', 'failed_subjects']
    if not all(col in df.columns for col in required_columns):
        raise HTTPException(status_code=400, detail=f"El archivo debe tener las columnas: {required_columns}")

    print(f"Procesando {len(df)} registros...")

    # 3. Obtener IDs reales de estudiantes (UUID) basados en su Matrícula (university_id)
    # Extraemos la lista de matrículas del archivo
    matriculas = df['university_id'].tolist()

    # Consultamos a Supabase quiénes son estos estudiantes
    response = supabase.table("students") \
        .select("id, university_id") \
        .in_("university_id", matriculas) \
        .execute()

    # Creamos un mapa: { "UCE-TEST-001": "uuid-largo-del-estudiante" }
    student_map = {row['university_id']: row['id'] for row in response.data}

    # 4. Preparar datos para insertar
    records_to_insert = []
    errors = []

    # Obtenemos el ID del periodo académico activo (Lo crearemos en el paso de prueba)
    # Por ahora, simularemos que buscamos el primero disponible
    period_res = supabase.table("academic_periods").select("id").limit(1).execute()
    if not period_res.data:
        raise HTTPException(status_code=400, detail="No hay periodos académicos creados en BD.")
    period_id = period_res.data[0]['id']

    for index, row in df.iterrows():
        u_id = row['university_id']

        if u_id in student_map:
            records_to_insert.append({
                "student_id": student_map[u_id],
                "period_id": period_id,
                "average_grade": float(row['average_grade']),
                "failed_subjects": int(row['failed_subjects']),
                "is_regular": int(row['failed_subjects']) == 0  # Si reprobó 0, es regular (simplificación)
            })
        else:
            errors.append(f"Estudiante {u_id} no encontrado en la base de datos.")

    # 5. Insertar masivamente en Supabase
    if records_to_insert:
        try:
            # Upsert permite actualizar si ya existe la nota para ese periodo
            supabase.table("academic_records").upsert(records_to_insert).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error guardando en BD: {str(e)}")

    return {
        "status": "success",
        "processed": len(records_to_insert),
        "errors": errors
    }