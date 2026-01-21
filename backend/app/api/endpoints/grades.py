from fastapi import APIRouter, UploadFile, File
from app.services.grades_service import process_grades_file

router = APIRouter()

@router.post("/upload")
async def upload_grades(file: UploadFile = File(...)):
    """
    Carga masiva de notas vía CSV/Excel.
    Columnas esperadas: university_id, average_grade, failed_subjects
    """
    result = await process_grades_file(file)
    return result