#!/bin/sh
exec socat TCP-LISTEN:1337,fork,reuseaddr EXEC:"python3 /chal/maze_game.py",stderr