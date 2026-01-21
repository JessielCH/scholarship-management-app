from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import grades, selection

# Inicialización de la App
app = FastAPI(
    title="Sistema de Gestión de Becas UCE",
    description="API para la gestión automática de becas estudiantiles",
    version="1.0.0"
)

# --- CONFIGURACIÓN CORS (MODO PERMISIVO) ---
# El navegador bloquea la respuesta si esto no está configurado exactamente así.
# Usamos ["*"] para permitir TODO en desarrollo.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # <--- ESTO ES LA CLAVE: Acepta localhost, 127.0.0.1, todo.
    allow_credentials=True,
    allow_methods=["*"],      # Permite POST, GET, OPTIONS, etc.
    allow_headers=["*"],      # Permite cualquier header
)

# --- RUTAS DE LA API ---
app.include_router(grades.router, prefix="/api/v1/grades", tags=["Grades"])
app.include_router(selection.router, prefix="/api/v1/selection", tags=["Selection"])

# --- ROOT ENDPOINT ---
@app.get("/")
def read_root():
    return {"status": "online", "system": "Scholarship API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)