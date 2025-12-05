import os
import time
import json
import requests
import pika
from datetime import datetime

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
LAT = os.getenv("LATITUDE", "-23.55")
LON = os.getenv("LONGITUDE", "-46.63")
INTERVAL = int(os.getenv("INTERVAL_SECONDS", "300"))

def get_weather(lat, lon):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json()

def main():
    params = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.queue_declare(queue='weather.jobs', durable=True)

    while True:
        try:
            data = get_weather(LAT, LON)
            message = {
                "source": "open-meteo",
                "timestamp": datetime.utcnow().isoformat(),
                "latitude": float(LAT),
                "longitude": float(LON),
                "payload": data
            }
            channel.basic_publish(
                exchange='',
                routing_key='weather.jobs',
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2,
                ))
            print("Published weather", message["timestamp"])
        except Exception as e:
            print("Error collecting/publishing:", e)
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()
