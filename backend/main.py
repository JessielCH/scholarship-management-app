from fastapi import FastAPI
from app.api.endpoints import grades, selection # <--- Importar selection

app = FastAPI(title="Scholarship Management System API")

app.include_router(grades.router, prefix="/api/v1/grades", tags=["Grades"])
app.include_router(selection.router, prefix="/api/v1/selection", tags=["Selection"]) # <--- Agregar Router

@app.get("/")
def read_root():
    return {"message": "API is running correctly"}