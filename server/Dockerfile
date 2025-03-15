FROM golang:latest AS builder

WORKDIR /app

# Copy go module files
COPY go.mod go.sum ./
# Modify go.mod to use available Go version
RUN go version && \
    go mod edit -go=1.22 && \
    go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o pocketbase .

# Use a smaller image for the final container
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/pocketbase .

# Create a directory for PocketBase data
RUN mkdir -p /app/pb_data
VOLUME /app/pb_data

# Expose the default PocketBase port
EXPOSE 8090

# Run the application
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
