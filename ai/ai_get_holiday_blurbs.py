import requests, os, json
import time

OPENAI_API_KEY = os.environ['OPENAI_API_KEY']
OPENAI_API_URI = os.environ['OPENAI_API_URI']

root_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

api_key = OPENAI_API_KEY
endpoint = OPENAI_API_URI


def ask_question(question):
    """ Asks a question to OpenAI's `/completion` endpoint """

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    data = {
        'model': 'text-davinci-003',
        'prompt': question,
        'max_tokens': 100
    }

    response = requests.post(endpoint, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()['choices'][0]['text']
    elif response.status_code == 429:
        return f"Error {response.status_code}: Rate limit hit... Retrying..."
    else:
        return f"Error: {response.status_code}"
    
    
def create_blurb_json():
    """ Creates a json of holiday names and their blurbs populated from OpenAI responses """

    new_holiday_blurbs_json = open(f'{root_directory}/ai/json/new_holiday_blurbs.json')
    new_json = json.load(new_holiday_blurbs_json)

    directory = f'{root_directory}/json/holidays'
    for file in os.listdir(directory):
        file_name = os.path.join(directory, file)
        f  = open(file_name)
        holidays = json.load(f)

        for holiday in holidays:
            if holiday['holiday_name'] not in str(new_json):
                question = f"Will you write me a blurb describing {holiday['holiday_name']} and include any history involving it? Keep it under 500 characters."
                answer = ask_question(question)

                if answer[:5] ==  'Error':
                    print(answer)
                    time.sleep(300)
                    return create_blurb_json()
                
                answer = answer.strip()

                new_json.append({
                    "holiday_name": holiday["holiday_name"],
                    "holiday_blurb": answer
                })

                json_object = json.dumps(new_json, indent=4)
                with open("json/new_holiday_blurbs.json", "w") as outfile:
                    outfile.write(json_object)

                if len(new_json) == 366:
                    return print('Success 200: All blurbs created!')

                print(f'{len(new_json)} / 366')
                time.sleep(60)


create_blurb_json()
