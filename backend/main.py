from fastapi import FastAPI
from app.api.endpoints import grades

app = FastAPI(title="Scholarship Management System API")

# Incluimos las rutas
app.include_router(grades.router, prefix="/api/v1/grades", tags=["Grades"])

@app.get("/")
def read_root():
    return {"message": "API is running correctly"}