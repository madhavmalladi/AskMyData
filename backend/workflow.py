from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from typing import Dict, Any, TypedDict
import json
import os
from dotenv import load_dotenv

# Load environment variables before instantiating agents
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

class WorkflowState(TypedDict):
    text: str
    csv: Any
    reasoning: str
    csv_analysis: str
    chart_data: Dict[str, Any] 
    validation: str

reason_agent = ChatOpenAI(model="gpt-4o-mini", temperature=0)
csv_process_agent = ChatOpenAI(model="gpt-4o", temperature=0)
action_agent = ChatOpenAI(model="gpt-4o-mini", temperature=0, model_kwargs={"response_format": {"type": "json_object"}})
observation_agent = ChatOpenAI(model="gpt-4o-mini", temperature=0)


# Reasoning agent function
def reason_step(state: Dict[str, Any]) -> Dict[str, Any]:
    user_text = state.get("text", "")
    messages = [
        SystemMessage(content = "You are a reasoning agent. Interpret the user's intent."),
        HumanMessage(content = user_text)
    ]
    response = reason_agent.invoke(messages)
    state["reasoning"] = response.content
    return state

# CSV Process agent function
def csv_process_step(state: Dict[str, Any]) -> Dict[str, Any]:
    csv_data = state.get("csv", [])
    reasoning = state.get("reasoning", "")
    messages = [
        SystemMessage(content="You are a CSV analysis agent. Use the reasoning to extract the relevant data."),
        HumanMessage(content=f"Reasoning: {reasoning}\nCSV Data: {csv_data}")
    ]
    response = csv_process_agent.invoke(messages)
    state["csv_analysis"] = response.content
    return state

# Action agent function
def action_step(state: Dict[str, Any]) -> Dict[str, Any]:
    analysis = state.get("csv_analysis", "")
    messages = [
        SystemMessage(content="""You are an action agent that generates chart configurations for data visualization.
        
Return a JSON object with the following structure:
{
  "chartType": "bar|line|pie|scatter|area",
  "title": "Chart title",
  "data": [{"label": "...", "value": ...}, ...],
  "xAxis": "X-axis label",
  "yAxis": "Y-axis label",
  "description": "Brief description of what the chart shows"
}

Ensure the response is valid JSON only, no additional text."""),
        HumanMessage(content=f"Based on this analysis, generate chart configuration:\n\n{analysis}")
    ]
    response = action_agent.invoke(messages)
    
    try:
        # Parse the JSON response
        chart_data = json.loads(response.content)
    except json.JSONDecodeError:
        # Fallback if JSON parsing fails
        chart_data = {
            "chartType": "bar",
            "title": "Error parsing chart data",
            "data": [],
            "error": "Failed to parse LLM response as JSON",
            "raw_response": response.content
        }
    
    state["chart_data"] = chart_data
    return state

# Observation agent function
def observation_step(state: Dict[str, Any]) -> Dict[str, Any]:
    chart_data = state.get("chart_data", {})
    # Convert dict to string for the validation agent
    chart_data_str = json.dumps(chart_data, indent=2)
    messages = [
        SystemMessage(content="You are an observation agent. Check for hallucination, bias, and context drift in the chart configuration."),
        HumanMessage(content=f"Chart Configuration:\n{chart_data_str}")
    ]
    response = observation_agent.invoke(messages)
    state["validation"] = response.content
    return state


# LangGraph workflow
def run_workflow(user_text: str, csv_data: Any) -> Dict[str, Any]:
    graph = StateGraph(WorkflowState)

    graph.add_node("ReasonAgent", reason_step)
    graph.add_node("CSVProcessAgent", csv_process_step)
    graph.add_node("ActionAgent", action_step)
    graph.add_node("ObservationAgent", observation_step)

    graph.set_entry_point("ReasonAgent")
    graph.add_edge("ReasonAgent", "CSVProcessAgent")
    graph.add_edge("CSVProcessAgent", "ActionAgent")
    graph.add_edge("ActionAgent", "ObservationAgent")
    graph.add_edge("ObservationAgent", END)

    workflow = graph.compile()
    initial_state = {
        "text": user_text,
        "csv": csv_data
    }

    result = workflow.invoke(initial_state)
    return result

