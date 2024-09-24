#!/bin/bash

# MQTT broker details
MQTT_HOST="localhost"
MQTT_PORT="1883"
MQTT_TOPIC="homie/switch/switch/state"

# Function to publish MQTT message
publish_mqtt_message() {
    local state="$1"
    echo "Publishing state: $state to topic: $MQTT_TOPIC"
    mosquitto_pub -h "$MQTT_HOST" -p "$MQTT_PORT" -t "$MQTT_TOPIC" -m "$state"
}

# Main loop
while true; do
    publish_mqtt_message "true"
    sleep 2
    publish_mqtt_message "false"
    sleep 2
done