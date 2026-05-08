interface WorkflowInput {
  text: string;
  csv: Record<string, unknown>[];
}

export interface ChartData {
  chartType: "bar" | "line" | "pie" | "scatter" | "area";
  title: string;
  data: Array<{ label: string; value: number }>;
  xAxis?: string;
  yAxis?: string;
  description?: string;
}

interface WorkflowResult {
  text: string;
  csv: Record<string, unknown>[];
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
    const res = await fetch(`${backendUrl}/run`, {
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
    throw error;
  }
}
