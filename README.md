# Crypto vs. NonCrypto Hashing Performance

A Benchmark test suite aimed at highlighting the performance cost of using a Crypto algorithm to generate hashs where security is not a concern. 

### Test System

- AWS ec2 `m4.2xlarge` ( 8 cores, 32gb ram ) 
- Ubuntu 17.10 base AMI ( ubuntu/images/hvm-ssd/ubuntu-artful-17.10-amd64-server-20171026.1 (ami-3702cc4f) )
- NodeJS 8.9.1

### Exection results

![perf results](/assets/perf_runs.png?raw=true "Five test runs")