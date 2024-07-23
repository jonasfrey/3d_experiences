pid_websersocket=$(pgrep -f "websersocket_416b1a0f-05a1-440b-8309-bc20065092b6.js")
watch -n 1 ps -p $pid_websersocket -o pid,etime,%cpu,%mem,cmd