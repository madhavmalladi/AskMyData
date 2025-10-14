# AskMyData - AI-Powered Data Analysis & Visualization

An intelligent data analysis application that uses LangGraph and OpenAI to analyze CSV data and generate interactive visualizations.

## 🏗️ Architecture

- **Backend**: FastAPI + LangGraph + OpenAI (Python)
- **Frontend**: Next.js + TypeScript + React
- **AI Workflow**: Multi-agent reasoning system with 4 specialized agents:
  1. **Reason Agent**: Interprets user intent
  2. **CSV Process Agent**: Analyzes data
  3. **Action Agent**: Generates chart configurations (JSON)
  4. **Observation Agent**: Validates for hallucinations and bias

## 🚀 Setup

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install fastapi uvicorn langchain langchain-openai langgraph python-dotenv openai
   ```

4. **Set up environment variables**:

   ```bash
   # Create .env file
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```

   **⚠️ IMPORTANT**: Replace `your_api_key_here` with your actual OpenAI API key from https://platform.openai.com/api-keys

5. **Start the backend server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd ask-my-data-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Test with Python Script

```bash
cd backend
python test_workflow.py
```

### Test with curl

```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Show me total sales by region",
    "csv": [
      {"region": "North", "sales": 10000},
      {"region": "South", "sales": 15000},
      {"region": "East", "sales": 12000}
    ]
  }'
```

### Example Response

```json
{
  "reasoning": "...",
  "csv_analysis": "...",
  "chart_data": {
    "chartType": "bar",
    "title": "Sales by Region",
    "data": [
      { "label": "North", "value": 10000 },
      { "label": "South", "value": 15000 }
    ],
    "xAxis": "Region",
    "yAxis": "Sales ($)",
    "description": "Bar chart showing sales across regions"
  },
  "validation": "..."
}
```

## 📊 Supported Chart Types

- Bar charts
- Line charts
- Pie charts
- Scatter plots
- Area charts

## 🔒 Security Notes

- ✅ `.env` files are gitignored
- ✅ Never commit API keys
- ⚠️ Update CORS settings in production (`main.py`)
- ⚠️ Add authentication for production deployment

## 📝 API Endpoints

### POST `/run`

Execute the AI workflow on CSV data.

**Request Body**:

```json
{
  "text": "Your analysis request",
  "csv": [
    /* your data array */
  ]
}
```

**Response**: Complete workflow state including chart configuration

## 🛠️ Development

### Project Structure

```
AskMyData/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── workflow.py          # LangGraph workflow
│   ├── .env                 # API keys (NOT in git)
│   └── test_workflow.py     # Test script
├── ask-my-data-frontend/
│   └── src/
│       └── app/
│           └── lib/
│               └── langgraph_workflow.ts
└── README.md
```

## 🤝 Contributing

Before committing:

1. Ensure `.env` is never committed
2. Test your changes with `test_workflow.py`
3. Check linting and formatting

## 📄 License

[Your License Here]
