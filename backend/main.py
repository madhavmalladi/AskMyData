from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from workflow import run_workflow
import os
from dotenv import load_dotenv

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with domain later
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run")
async def run_agent(request: Request):
    data = await request.json()
    text = data.get("text")
    csv = data.get("csv")
    result = run_workflow(text, csv)
    return result
