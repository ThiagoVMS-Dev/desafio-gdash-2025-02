package main

import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "log"
  "net/http"
  "bytes"
  "os"
  "time"

  "github.com/streadway/amqp"
)

type Message struct {
  Source string `json:"source"`
  Timestamp string `json:"timestamp"`
  Latitude float64 `json:"latitude"`
  Longitude float64 `json:"longitude"`
  Payload map[string]interface{} `json:"payload"`
}

func failOnError(err error, msg string) {
  if err != nil {
    log.Fatalf("%s: %s", msg, err)
  }
}

func main() {
  rabbitURL := os.Getenv("RABBITMQ_URL")
  apiEndpoint := os.Getenv("API_ENDPOINT")
  apiToken := os.Getenv("API_TOKEN")

  if rabbitURL == "" || apiEndpoint == "" {
    log.Fatal("RABBITMQ_URL and API_ENDPOINT required")
  }

  conn, err := amqp.Dial(rabbitURL)
  failOnError(err, "Failed to connect to RabbitMQ")
  defer conn.Close()

  ch, err := conn.Channel()
  failOnError(err, "Failed to open channel")
  defer ch.Close()

  q, err := ch.QueueDeclare(
    "weather.jobs",
    true,
    false,
    false,
    false,
    nil,
  )
  failOnError(err, "Failed to declare queue")

  msgs, err := ch.Consume(q.Name, "", true, false, false, false, nil)
  failOnError(err, "Failed to register consumer")

  forever := make(chan bool)

  go func() {
    for d := range msgs {
      var m Message
      if err := json.Unmarshal(d.Body, &m); err != nil {
        log.Println("invalid message:", err)
        continue
      }
      // add processed_at
      if m.Payload == nil {
        m.Payload = map[string]interface{}{}
      }
      m.Payload["processed_at"] = time.Now().UTC().Format(time.RFC3339)
      bodyBytes, _ := json.Marshal(m)
      req, _ := http.NewRequest("POST", apiEndpoint, bytes.NewBuffer(bodyBytes))
      req.Header.Set("Content-Type", "application/json")
      if apiToken != "" {
        req.Header.Set("X-API-TOKEN", apiToken)
      }
      res, err := http.DefaultClient.Do(req)
      if err != nil {
        log.Println("failed to POST to API:", err)
        continue
      }
      b, _ := ioutil.ReadAll(res.Body)
      log.Println("API response:", res.Status, string(b))
      res.Body.Close()
    }
  }()

  log.Printf("Worker started, awaiting messages")
  <-forever
}
