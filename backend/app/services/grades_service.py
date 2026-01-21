import pandas as pd
import traceback
import sys
from io import BytesIO
from fastapi import UploadFile, HTTPException
from app.core.database import supabase


async def process_grades_file(file: UploadFile):
    print(f"--- [DEBUG] INICIO CARGA: {file.filename} ---", flush=True)

    try:
        # 1. VERIFICACIÓN
        if not supabase:
            raise Exception("El cliente Supabase es None.")

        # 2. LEER
        contents = await file.read()
        try:
            if file.filename.endswith('.csv'):
                df = pd.read_csv(BytesIO(contents))
            else:
                df = pd.read_excel(BytesIO(contents))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error leyendo archivo: {str(e)}")

        # 3. LIMPIEZA
        df.columns = df.columns.str.strip()
        required_columns = ['university_id', 'average_grade', 'failed_subjects']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(status_code=400, detail=f"Faltan columnas: {required_columns}")

        # 4. PERIODO
        print("--- [DEBUG] Buscando periodo...", flush=True)
        period_res = supabase.table("academic_periods").select("id").eq("is_active", True).execute()
        if not period_res.data:
            period_res = supabase.table("academic_periods").select("id").limit(1).execute()

        if not period_res.data:
            raise HTTPException(status_code=400, detail="NO HAY PERIODO ACADÉMICO EN BD.")
        period_id = period_res.data[0]['id']

        # 5. MAPEO
        # Normalizamos a string y quitamos espacios
        matriculas_csv = df['university_id'].astype(str).str.strip().tolist()
        print(f"--- [DEBUG] Buscando {len(matriculas_csv)} matriculas...", flush=True)

        response = supabase.table("students").select("id, university_id").in_("university_id", matriculas_csv).execute()

        # Mapa: { 'UCE-TEST-001': 'uuid-largo...' }
        # Aseguramos que la clave del mapa también esté limpia
        student_map = {str(row['university_id']).strip(): row['id'] for row in response.data}

        print(f"--- [DEBUG] Estudiantes encontrados en BD: {len(student_map)}", flush=True)

        # 6. COMPARACIÓN DETALLADA (AQUÍ ESTÁ EL PROBLEMA)
        records_to_insert = []
        errors = []

        print("--- [DETECTOR] Iniciando comparación fila por fila ---", flush=True)

        for index, row in df.iterrows():
            # Limpieza agresiva: String, Strip
            csv_id = str(row['university_id']).strip()

            if csv_id in student_map:
                records_to_insert.append({
                    "student_id": student_map[csv_id],
                    "period_id": period_id,
                    "average_grade": float(row['average_grade']),
                    "failed_subjects": int(row['failed_subjects']),
                    "is_regular": int(row['failed_subjects']) == 0
                })
            else:
                # Si falla, imprimimos por qué
                msg = f"FILA {index}: '{csv_id}' NO coincide con ninguna clave en BD."
                print(f"--- [ERROR MATCH] {msg}", flush=True)
                errors.append(msg)

        # 7. INSERTAR
        if records_to_insert:
            print(f"--- [DEBUG] Insertando {len(records_to_insert)} registros...", flush=True)
            try:
                res = supabase.table("academic_records").upsert(
                    records_to_insert,
                    on_conflict="student_id, period_id"
                ).execute()
                print("--- [DEBUG] ¡INSERCIÓN EXITOSA! ---", flush=True)
            except Exception as e:
                print(f"--- [ERROR SQL] {e}", flush=True)
                raise HTTPException(status_code=500, detail=f"Error SQL: {e}")
        else:
            print("--- [ALERTA] La lista de inserción está VACÍA. Revisa los errores de match arriba.", flush=True)

        return {
            "status": "success",
            "processed": len(records_to_insert),
            "errors": errors
        }

    except Exception as e:
        print("\n!!!!!!!! ERROR CRÍTICO !!!!!!!!", flush=True)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))