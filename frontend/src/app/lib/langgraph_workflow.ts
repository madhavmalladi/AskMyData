interface WorkflowInput {
  text: string;
  csv: any;
}

interface ChartData {
  chartType: "bar" | "line" | "pie" | "scatter";
  title: string;
  data: Array<{ label: string; value: number }>;
  xAxis?: string;
  yAxis?: string;
  description?: string;
}

interface WorkflowResult {
  text: string;
  csv: any;
  reasoning: string;
  csv_analysis: string;
  chart_data: ChartData;
  validation: string;
}

export async function runLangGraphWorkflow({
  text,
  csv,
}: WorkflowInput): Promise<WorkflowResult> {
  try {
    const res = await fetch("http://localhost:8000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, csv }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error running LangGraph workflow:", error);
    throw error; // Re-throw or handle appropriately
  }
}
