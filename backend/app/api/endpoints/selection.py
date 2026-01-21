from fastapi import APIRouter
from app.services.selection_service import process_automatic_selection

router = APIRouter()

@router.post("/run-process")
async def run_selection_process():
    """
    EJECUCIÓN DEL ALGORITMO:
    1. Analiza notas del periodo activo.
    2. Calcula el top 10% por carrera.
    3. Genera aplicaciones 'Preselected'.
    """
    result = await process_automatic_selection()
    return result