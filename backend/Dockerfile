FROM python:3.9-slim-bullseye
ENV PYTHONUNBUFFERED=1
WORKDIR /api

RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    libssl-dev \
    pkg-config \
    apt-utils \
    vim \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY goodFoodProj/requirements.txt /api/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY goodFoodProj/ /api/

EXPOSE 8008
CMD ["python", "manage.py", "runserver", "0.0.0.0:8008"]