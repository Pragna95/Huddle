FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# copy project
COPY . /app/

# expose Django port
EXPOSE 8001

# run server (IMPORTANT: different port from other service)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]