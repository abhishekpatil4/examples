from InquirerPy import prompt
from datetime import datetime, timedelta

def get_default_datetime_string():
    tomorrow = datetime.now() + timedelta(days=1)
    day = tomorrow.day
    suffix = 'th' if 11 <= day <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
    return tomorrow.strftime(f"%-d{suffix} %b at 4 PM IST ")

def get_calendar_prompts():
    questions = [
        {
            'type': 'input',
            'name': 'calendar_time',
            'message': 'When would you like to schedule the event?',
            'default': get_default_datetime_string()
        },
        {
            'type': 'input',
            'name': 'meeting_title',
            'message': 'What is the event title?',
            'default': ''
        }
    ]
    
    answers = prompt(questions)
    
    return {
        "user_prompt_calendar_time": answers["calendar_time"],
        "user_prompt_meeting_title": answers["meeting_title"]
    }