#!/usr/bin/env bash
# sovereignty_firewall.sh — run as root at boot; watchdog re-asserts jumps every 5s
set -euo pipefail

NIC="eth0"
PEERS=("10.0.99.10" "10.0.99.11")        # whitelisted internal peers — adjust per deployment

# ---- IPv4: dedicated chain (flush-and-rebuild is idempotent) ----
iptables -N SOVEREIGN_EGRESS 2>/dev/null || iptables -F SOVEREIGN_EGRESS
iptables -A SOVEREIGN_EGRESS -o lo -j ACCEPT
iptables -A SOVEREIGN_EGRESS ! -o "${NIC}" -j ACCEPT
for p in "${PEERS[@]}"; do
    iptables -A SOVEREIGN_EGRESS -o "${NIC}" -d "${p}/32" -j ACCEPT
done
iptables -A SOVEREIGN_EGRESS -j LOG --log-prefix "[AIRGAP-EGRESS-DROP] " --log-level 4
iptables -A SOVEREIGN_EGRESS -j DROP
for chain in FORWARD OUTPUT; do
    while iptables -C "${chain}" -j SOVEREIGN_EGRESS 2>/dev/null; do
        iptables -D "${chain}" -j SOVEREIGN_EGRESS
    done
    iptables -I "${chain}" 1 -j SOVEREIGN_EGRESS
done

# ---- IPv6 backstop: deny-by-default (primary control is sysctl disable_ipv6=1, §17) ----
ip6tables -N SOVEREIGN_EGRESS6 2>/dev/null || ip6tables -F SOVEREIGN_EGRESS6
ip6tables -A SOVEREIGN_EGRESS6 -o lo -j ACCEPT
ip6tables -A SOVEREIGN_EGRESS6 -j LOG --log-prefix "[AIRGAP-EGRESS6-DROP] " --log-level 4
ip6tables -A SOVEREIGN_EGRESS6 -j DROP
for chain in FORWARD OUTPUT; do
    while ip6tables -C "${chain}" -j SOVEREIGN_EGRESS6 2>/dev/null; do
        ip6tables -D "${chain}" -j SOVEREIGN_EGRESS6
    done
    ip6tables -I "${chain}" 1 -j SOVEREIGN_EGRESS6
done
