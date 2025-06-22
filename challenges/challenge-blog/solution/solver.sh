#!/bin/bash

# Logs the domain being used for the challenge
echo "Trying to echo Domain: $DOMAIN"

# -------------------------------
# Setup: Setting up variables and urls.
# -------------------------------
IMAGE_URL2="https://$DOMAIN/pictures/p12.png"
OUTPUT_FILE="pic.png"                                                                                                   
URL="https://$DOMAIN"


# -------------------------------
# Step 1: Extracting airport code from the blog page.
# -------------------------------
STARTINGPOINT=$(curl --insecure "https://blog.$DOMAIN" | grep -o "CPH")
echo "Starting Point for Prof. PP: $STARTINGPOINT"


# -------------------------------
# Step 2: Download picture containing Metadata
# -------------------------------
# Using wget to getting the accesible picture on website 1  
wget --no-check-certificate "https://blog.$DOMAIN/pictures/p12.png" -O "$OUTPUT_FILE"
echo "Downloaded picture saved as: $OUTPUT_FILE"


# -------------------------------
# Step 3: Extract Metadata from image, such as GPS and Date.
# -------------------------------
# Extracting information in it's raw form so it can be used again
GPS=$(exiftool "$OUTPUT_FILE" -n | grep "GPS.Position" | sed 's/.*: //')
echo "GPS Locations: $GPS"

DATE=$(exiftool "$OUTPUT_FILE" | grep "Date/Time.Original" | awk '{print $4}' | sed 's/:/-/g')
echo "Time Create: $DATE"

# ---------------------------------------------------
# Step 4: Finding out IATA airport code based on GPS from image
# ---------------------------------------------------
# Simulating going onto google maps, and pasting the GPS Coordinates, where after looking at the map, to realise the closest AIRPORT
if [ "$GPS" == "35.769272 140.389898" ]; then 
	IATA="NRT"
	fi
echo "IATA AIRPORT for the Challenge Picture: $IATA"

# ---------------------------------------------------
# Step 5: Search on the flight log service webpage, for flight info.
# ---------------------------------------------------
SEARCHURL=$"https://flight-logs.$DOMAIN/index.php?departingAirport=$IATA&arrivingAirport=$STARTINGPOINT"
echo "Searching flight logs at: $SEARCHURL"

RESPONSE=$(curl --insecure -s "$SEARCHURL")


# ---------------------------------------------------
# Step 6: Extract flight number using regex
# ---------------------------------------------------
FLIGHTNUMBER=$(echo "$RESPONSE" | grep -oP "[A-Z]{2}[0-9]{3}(?=\\s*<br><strong>Departure:</strong>\\s*NRT\\s+at\\s+$DATE)")
echo "Print Flight Number: $FLIGHTNUMBER"


# ---------------------------------------------------
# Step 7: Format and save flag
# ---------------------------------------------------
FLAG="flag{"$IATA"_"$FLIGHTNUMBER"}"
echo "$FLAG" > /run/solution/flag.txt
echo "The flag saved in /run/solution/flag.txt is: $(cat /run/solution/flag.txt)"









