FROM python:3.10.17-slim

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /app

COPY solve.py pwnfish .
COPY libs ./libs

CMD [ "python3" , "solve.py" ]
