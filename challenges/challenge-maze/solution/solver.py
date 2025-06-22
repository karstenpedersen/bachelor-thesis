#!/usr/bin/python3 
import time
from pwn import * # type: ignore
import re
import os
from sshtunnel import SSHTunnelForwarder


def BFS(x: int) -> str:
	"""generates all possible paths in the given depth in a string 
	>>> BFS(2)
	"RRbLRbRLbLLb"
	"""
	last_path = [""]
	i=0
	while i < x:
		last_path = [y+"R" for y in last_path] + [y+"L" for y in last_path]
		i=i+1
	path = ''.join([y+"b" for y in last_path])
	return path



def solver(host, port) -> None:
	"""runs and completes the maze game"""
	p = remote(host, port)

	length = 12
	flag = None
	i=0
	pathe = BFS(length)
	pathe_length  = len(pathe)
	while flag == None:
		move = pathe[i]
		p.sendline(move)
		i=i+1
		if i == pathe_length :
			i=0 
			length = length+2
			pathe = BFS(length)
			pathe_length = len(pathe)
		flag = re.search("flag{.*}",f"{p.recv()}")

	print("Flag has been found")
	with open("/run/solution/flag.txt", "w") as f:
		f.write(flag[0])

	return



if __name__ == '__main__':

	SSH_DOMAIN = os.environ["SSH_SERVICE_INTERNAL_URL"]
	SSH_PORT = int(os.environ["SSH_PORT"])


	REMOTE_HOST = "chall"
	REMOTE_PORT = 1337

	LOCAL_HOST = "127.0.0.1"
	LOCAL_PORT = 3242

	server = SSHTunnelForwarder(
    (SSH_DOMAIN, SSH_PORT),
    ssh_username="test",
    ssh_password="test",
    allow_agent=False,
    host_pkey_directories=None, 
    remote_bind_address=(REMOTE_HOST, REMOTE_PORT),
    local_bind_address=(LOCAL_HOST, LOCAL_PORT),
	)

	server.start()
	solver(LOCAL_HOST, LOCAL_PORT)
	server.stop() 
	
	with open("/run/solution/flag.txt", "r") as f:
		content = f.read()
	print(content)
	
