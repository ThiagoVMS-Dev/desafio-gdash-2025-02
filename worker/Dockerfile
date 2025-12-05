FROM golang:1.21-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o worker .

FROM alpine:3.18
WORKDIR /app
COPY --from=build /app/worker .
CMD ["./worker"]
