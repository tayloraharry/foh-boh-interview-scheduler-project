## Backend
- Directory: back-end

### Set Up
- `cd back-end`
- `python -m virtualenv .venv`
- `cd .\.venv\Scripts\`
- `.\activate`
- `cd ../../` (to back-end root directory)
- `pip install -r requirements.txt`
- `python .\manage.py makemigrations`
- `python .\manage.py migrate`
- `python .\manage.py loaddata interview`
- `python .\manage.py runserver`

## Frontend
- Directory: front-end

### Set Up
- `cd front-end/app`
- `npm install`
- `npm start`
- Visit [http://localhost:3000](http://localhost:3000)
