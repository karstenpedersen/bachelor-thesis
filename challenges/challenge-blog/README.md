# Challenge: Exif Marks the Spot

Capture the flag challenge to test the players knowledge about OSINT techniques.

## Services

This challenge sets up two usable web domain, where the player has to gather usable information.

### Blog (chall)

This is web domain 1, where the player gains access to a professor personal travelling blog. Here they can read information about the professor, or download pictures with data. Accessible on `blog.$DOMAIN`

### Flight-logs (chall)

This is web domain 2, where the player gains access to a site with information of different airplanes, travel and departure informations. Accessible on `flight-logs.$DOMAIN`

### Healthcheck (healthcheck)

This is a simple server that responds with 'OK' and a status code 200. This is used for the CTF platform.

## Vulnerabilities

- The Professor doesn't follow standard internet procedure, and constantly posts on their vacation. They also doesn't strip their picture of metadata, which reveals even more information.

## Solution

1. Navigate to the website at blog.$DOMAIN:8080.
2. Read through the website.
3. Download the correct picture.
4. Extract metadata.
5. Search with extract gps coordinates on maps.
6. Use found information on flight-logs.$DOMAIN:8080.
7. Craft flag with the following format flag{$IATACODE_$FLIGHTNUMBER}.


## Development

```bash
# see available recipes
just

# start development
just dev

# run solution
just solution

# bundle challenge for QEMU
just bundle
```


### Pulled from the original example

    This challenge demonstrates hosting two webites on each their subdomain.

    The entry point to the challenge is a domain `$DOMAIN` (e.g., `2a1f15ee-4d30-40ae.local.lan` from where there are links to the following sites:
    - `web1.2a1f15ee-4d30-40ae.local.lan`
    - `web2.2a1f15ee-4d30-40ae.local.lan`

    For more elaborate challenges with various domains, we suggest to look at the setting of the ssh challenge that allows players to use ssh port forwarding and more freedom on the choice of domains to use.


