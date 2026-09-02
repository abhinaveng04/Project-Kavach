import docker

docker_client = docker.from_env()
container = docker_client.containers.run(
    image="sovereign-sandbox:1.0",
    network_mode="none",                    # IP transit impossible
    mem_limit="2g",                         # overrides the locked 1 GB (pandas safety)
    pids_limit=128,
    security_opt=["no-new-privileges"],     # privilege-escalation block
    cap_drop=["ALL"],                       # defense in depth
    volumes={
        "/srv/sovereign/job_out": {         # host tmpfs mounted rw,noexec,nosuid
            "bind": "/tmp/job/out",
            "mode": "rw",
        }
    },
    command=["python", "/tmp/job/script.py"],
    detach=True,
)
# /var/run/docker.sock is NEVER mounted into a container — enforced by config review + preflight grep
