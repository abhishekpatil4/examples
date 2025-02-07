import os
from dotenv import load_dotenv
from composio_llamaindex import ComposioToolSet, Action
from llama_index.core.agent import FunctionCallingAgent
from llama_index.core.llms import ChatMessage
from llama_index.llms.openai import OpenAI
from newConnectionPy import setup_account_connection
from inquirerPrompts import get_calendar_prompts

load_dotenv()

print(
    """ 
--------------------------------------
Agent: Create an event
Tools used: Google Calendar
Description: Creates a new event on Google Calendar
--------------------------------------
"""
)

toolset = ComposioToolSet(api_key=os.getenv("COMPOSIO_API_KEY"))


def main():
    setup_account_connection(
        entity_id="default", app_name="GOOGLECALENDAR", toolset=toolset
    )
    prompts = get_calendar_prompts()

    user_prompt_calendar_time = prompts["user_prompt_calendar_time"]
    user_prompt_meeting_title = prompts["user_prompt_meeting_title"]

    llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    tools = toolset.get_tools(
        actions=[
            Action.GOOGLECALENDAR_CREATE_EVENT,
            Action.GOOGLECALENDAR_GET_CURRENT_DATE_TIME,
        ]
    )

    prefix_messages = [
        ChatMessage(
            role="system",
            content="You are a calendar assistant that schedules events in Google Calendar",
        )
    ]
    agent = FunctionCallingAgent.from_tools(
        llm=llm, tools=tools, prefix_messages=prefix_messages, verbose=False
    )
    response = agent.chat(
        f"""Schedule a new event:
        Time: {user_prompt_calendar_time}
        Duration: 1hr
        Title: {user_prompt_meeting_title}
        
        Use UTC timezone and return the event details and link as plain text & not as markdown."""
    )
    print(response)


if __name__ == "__main__":
    main()
