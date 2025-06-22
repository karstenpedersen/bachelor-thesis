OUT_DIR := 'out'
CHALLENGES_DIR := 'challenges'
CHALLENGE_ZIP_NAME := 'challenge.zip'
PROJECT_ZIP := OUT_DIR / 'source-code.zip'

HTTP_PORT := '8080'
SSH_PORT := '8022'
CONFIG_ADDRESS := 'http://10.0.2.2:8000'
VM_FILE := 'alpine_VM.qcow2'
MEM := '1024'

CLOUD_INIT_DIR := '/tmp/cloud-init'
CLOUD_INIT_DATA_DIR := 'cloud-init'
TEMP_CLOUD_INIT_PID := OUT_DIR + '/cloud-init.pid'


# show help menu
default:
	@just --list

# run a CTF challenge
run CHALLENGE:
	#!/usr/bin/env bash
	echo "Running '{{CHALLENGE}}' in QEMU"

	just _cloud-init--init
	just _challenge--prime {{CHALLENGE}} {{CLOUD_INIT_DIR}}

	just _cloud-init--serve
	sleep 2

	if [ -e /dev/kvm ]; then
		just _vm--run
	else
		just _vm--run-without-acceleration
	fi

	just _cloud-init--stop

# run challenge locally
dev CHALLENGE:
	@echo "Running '{{CHALLENGE}}' on local machine"
	@cd {{CHALLENGES_DIR}}/{{CHALLENGE}} && just dev

# run the solution for a CTF challenge
solution CHALLENGE:
	@echo "Running solution for '{{CHALLENGE}}'"
	@cd {{CHALLENGES_DIR}}/{{CHALLENGE}} && just solution

# list available CTF challenges
challenges:
	@echo "Challenges:"
	@cd {{CHALLENGES_DIR}} && ls -1 | sed 's/^/- /'

# archive project
archive:
	@rm -rfv {{OUT_DIR}}
	@mkdir -p {{OUT_DIR}}
	git ls-files --others --cached --exclude-standard | zip -@r {{PROJECT_ZIP}}

# cleanup
clean:
	@rm -rfv {{OUT_DIR}}
	@rm -rfv {{CLOUD_INIT_DIR}}

# run primed CTF challenge in virtual machine
_vm--run:
	qemu-system-x86_64 \
		-cpu host -machine type=q35,accel=kvm -m {{MEM}} \
		-nographic \
		-snapshot \
		-net nic \
		-netdev id=net00,type=user,hostfwd=tcp::{{SSH_PORT}}-:{{SSH_PORT}},hostfwd=tcp::{{HTTP_PORT}}-:{{HTTP_PORT}},hostfwd=tcp::8443-:8443 \
		-device virtio-net-pci,netdev=net00 \
		-drive if=virtio,format=qcow2,file={{VM_FILE}} \
		-smbios type=1,serial=ds='nocloud;s={{CONFIG_ADDRESS}}'

# run primed CTF challenge in virtual machine (without kvm)
_vm--run-without-acceleration:
	qemu-system-x86_64 \
		-machine type=q35 -m {{MEM}} \
		-nographic \
		-snapshot \
		-net nic \
		-netdev id=net00,type=user,hostfwd=tcp::{{SSH_PORT}}-:{{SSH_PORT}},hostfwd=tcp::{{HTTP_PORT}}-:{{HTTP_PORT}},hostfwd=tcp::8443-:8443 \
		-device virtio-net-pci,netdev=net00 \
		-drive if=virtio,format=qcow2,file={{VM_FILE}} \
		-smbios type=1,serial=ds='nocloud;s={{CONFIG_ADDRESS}}'

# bundle CTF challenge
_challenge--bundle CHALLENGE:
	@echo "Bundling '{{CHALLENGE}}'"
	@cd {{CHALLENGES_DIR}}/{{CHALLENGE}} && just bundle

# bundle and prime CTF challenge
_challenge--prime CHALLENGE DEST: (_challenge--bundle CHALLENGE)
	@echo "Priming '{{CHALLENGE}}' into '{{DEST}}'"
	@cp {{CHALLENGES_DIR}}/{{CHALLENGE}}/{{OUT_DIR}}/{{CHALLENGE_ZIP_NAME}} {{DEST}}/{{CHALLENGE_ZIP_NAME}}

# initialize cloud-init
_cloud-init--init:
	@mkdir -p {{CLOUD_INIT_DIR}}
	@cp -r {{CLOUD_INIT_DATA_DIR}}/* {{CLOUD_INIT_DIR}}

# serve cloud-init files on a http server
_cloud-init--serve:
	#!/usr/bin/env bash
	mkdir -p {{OUT_DIR}}
	python3 -m http.server --directory {{CLOUD_INIT_DIR}} &
	echo $! > {{TEMP_CLOUD_INIT_PID}}

# stop cloud-init http server
_cloud-init--stop:
	#!/usr/bin/env bash
	PID=$(cat {{TEMP_CLOUD_INIT_PID}})
	kill $PID
