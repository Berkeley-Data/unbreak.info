# Website
## Local web server instructions
Install pipenv.  
See - https://pipenv.pypa.io/en/latest/   
I use Homebrew for OS X.

Navigate to `website` directory in your local `w210_voter_propensity` repo.

Create a virtual environment with Python 3.7. Will probably also work with lesser versions of Python.
```bash
pipenv --python 3.7
```
The virtual environment creation process should tell you where it is located. For me that is: `/Users/nick/.venvs/website-1VgVnLN8`. Activate the virtual environment, replacing my environment directory with yours but make sure `/bin/activate` is appended to the end.
```bash
source /Users/nick/.venvs/website-1VgVnLN8/bin/activate
```
Install dependencies.
```bash
pipenv install
```
## Start the Flask webserver
```bash
python app.py
```

Website should be visible at http://127.0.0.1:5000/